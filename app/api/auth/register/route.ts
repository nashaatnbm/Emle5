/**
 * app/api/auth/register/route.ts
 *
 * Handles user registration.
 * 1. Validates input with Zod
 * 2. Checks email is not already taken
 * 3. Hashes password with bcrypt
 * 4. Creates user in Prisma (PostgreSQL via Supabase)
 * 5. Creates JWT session cookie
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";

// ─── Validation schema ─────────────────────────────────────────────────────
const RegisterSchema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters").max(80),
  email:    z.string().email("Invalid email address").toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  school:   z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Parse + validate
    const body = await req.json();
    const result = RegisterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, school } = result.data;

    // Check for existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Hash password + create user
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        school: school || null,
        plan:        "FREE",
        aiCredits:   10,
        lastLoginAt: new Date(),
      },
      select: {
        id:        true,
        email:     true,
        name:      true,
        plan:      true,
        aiCredits: true,
      },
    });

    // Create session cookie
    await createSession({
      id:        user.id,
      email:     user.email,
      name:      user.name,
      plan:      user.plan,
      aiCredits: user.aiCredits,
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id:        user.id,
          name:      user.name,
          email:     user.email,
          plan:      user.plan,
          aiCredits: user.aiCredits,
        },
      },
      { status: 201 }
    );

  } catch (err) {
    console.error("[AUTH/REGISTER]", err);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
