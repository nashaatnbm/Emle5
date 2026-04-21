/**
 * app/api/auth/me/route.ts
 *
 * Returns the current authenticated user's data.
 * Client components call this on mount to hydrate the AuthContext.
 */

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  try {
    // Fetch fresh data from DB (plan may have changed, credits may have been used)
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id:           true,
        email:        true,
        name:         true,
        plan:         true,
        aiCredits:    true,
        planExpiresAt:true,
        school:       true,
        avatarUrl:    true,
        createdAt:    true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch {
    // DB unavailable — return session data as fallback
    return NextResponse.json({ user: session });
  }
}
