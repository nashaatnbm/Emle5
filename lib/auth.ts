/**
 * lib/auth.ts
 *
 * Authentication utilities:
 * - Password hashing with bcryptjs
 * - JWT signing/verifying with jose
 * - Session retrieval from cookies
 */

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "CHANGE_THIS_IN_PRODUCTION_emle_qbank_secret"
);
const SESSION_COOKIE = "emle_session";
const SESSION_DURATION = 60 * 60 * 24 * 30; // 30 days

// ─── Types ────────────────────────────────────────────────────────────────
export type SessionUser = {
  id: string;
  email: string;
  name: string;
  plan: string;
  aiCredits: number;
};

// ─── Password ─────────────────────────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ─── JWT ──────────────────────────────────────────────────────────────────
export async function signToken(payload: SessionUser): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

// ─── Session (cookie-based) ────────────────────────────────────────────────
export async function createSession(user: SessionUser): Promise<void> {
  const token = await signToken(user);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

// ─── Get full user from DB ─────────────────────────────────────────────────
export async function getUser() {
  const session = await getSession();
  if (!session) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        aiCredits: true,
        planExpiresAt: true,
        school: true,
        avatarUrl: true,
      },
    });
    return user;
  } catch {
    return null;
  }
}
