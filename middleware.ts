/**
 * middleware.ts (root level)
 *
 * Protects routes that require authentication.
 * Redirects unauthenticated users to /login.
 * Redirects logged-in users away from /login and /register.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

// Routes that require authentication
const PROTECTED = ["/dashboard", "/qbank", "/ai-generator"];

// Routes that logged-in users should not see
const AUTH_ONLY  = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("emle_session")?.value;

  const user = token ? await verifyToken(token) : null;
  const isLoggedIn = !!user;

  // Redirect unauthenticated users away from protected routes
  if (PROTECTED.some(p => pathname.startsWith(p)) && !isLoggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from auth pages
  if (AUTH_ONLY.some(p => pathname.startsWith(p)) && isLoggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
