/**
 * app/api/auth/login/route.ts
 *
 * Handles user login.
 * 1. Validates input
 * 2. Finds user in DB by email
 * 3. Compares password hash
 * 4. Creates JWT session cookie
 * 5. Updates lastLoginAt
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { comparePassword, createSession } from "@/lib/auth";

const LoginSchema = z.object({
  email:    z.string().email("Invalid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const result = LoginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id:           true,
        email:        true,
        name:         true,
        passwordHash: true,
        plan:         true,
        aiCredits:    true,
        planExpiresAt:true,
      },
    });

    // Generic error — don't reveal if email exists
    const INVALID = "Invalid email or password.";

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: INVALID }, { status: 401 });
    }

    const passwordOk = await comparePassword(password, user.passwordHash);
    if (!passwordOk) {
      return NextResponse.json({ error: INVALID }, { status: 401 });
    }

    // Check plan expiry — downgrade to FREE if expired
    let plan = user.plan;
    if (
      user.planExpiresAt &&
      new Date(user.planExpiresAt) < new Date() &&
      plan !== "FREE"
    ) {
      plan = "FREE";
      await prisma.user.update({
        where: { id: user.id },
        data:  { plan: "FREE" },
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data:  { lastLoginAt: new Date() },
    });

    // Create session
    await createSession({
      id:        user.id,
      email:     user.email,
      name:      user.name,
      plan,
      aiCredits: user.aiCredits,
    });

    return NextResponse.json({
      success: true,
      user: {
        id:        user.id,
        name:      user.name,
        email:     user.email,
        plan,
        aiCredits: user.aiCredits,
      },
    });

  } catch (err) {
    console.error("[AUTH/LOGIN]", err);
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
