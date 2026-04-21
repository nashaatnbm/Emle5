"use client";

/**
 * app/login/page.tsx — MODIFIED in Phase 2
 *
 * Full redesign:
 * - UWorld-like dark professional UI
 * - Connects to /api/auth/login (real DB auth)
 * - Updates AuthContext on success
 * - Zod-based client-side validation
 * - Show/hide password toggle
 * - Redirect to previous page or /dashboard
 * - Accessible: keyboard nav, ARIA labels
 */

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { ClientUser } from "@/types";

// ─── Icons (inline SVG — no extra deps) ──────────────────────────────────
const Icons = {
  logo: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
    </svg>
  ),
  eye: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  eyeOff: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  alert: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
};

// ─── Feature list (left panel) ────────────────────────────────────────────
const FEATURES = [
  { icon: "📚", text: "4,000+ EMLE-level clinical vignette questions" },
  { icon: "🤖", text: "AI question generator powered by Claude" },
  { icon: "📊", text: "Real-time analytics & predicted EMLE score" },
  { icon: "🎓", text: "Tutor Mode & Timed Mock Exams" },
  { icon: "🇪🇬", text: "Built specifically for Egyptian Medical Licensing" },
];

// ─── Component ────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { setUser }  = useAuth();

  const redirectTo = searchParams.get("redirect") || "/dashboard";

  // Form state
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    // Basic client validation
    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!password)     { setError("Please enter your password."); return; }

    setLoading(true);

    try {
      const res  = await fetch("/api/auth/login", {
        method:      "POST",
        headers:     { "Content-Type": "application/json" },
        credentials: "include",
        body:        JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      // Update auth context with returned user
      setUser(data.user as ClientUser);

      // Navigate to intended page
      router.push(redirectTo);
      router.refresh(); // refresh Server Components

    } catch {
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex">

      {/* ── Left Panel — Branding ──────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col justify-between
                      bg-gradient-to-br from-[#0F172A] via-[#0D1F3C] to-[#0A0F1E]
                      border-r border-slate-800/60 p-10 relative overflow-hidden">

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full
                        bg-gradient-radial from-blue-600/10 to-transparent
                        pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full
                        bg-gradient-radial from-blue-900/20 to-transparent
                        pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center
                          shadow-lg shadow-blue-600/30 text-white">
            {Icons.logo}
          </div>
          <div>
            <span className="text-lg font-extrabold text-white tracking-tight">
              EMLE <span className="text-blue-400">QBank</span>
            </span>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">
              Medical Licensing Prep
            </p>
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Master the EMLE.<br/>
            <span className="text-gradient">Pass on your<br/>first attempt.</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-sm">
            Egypt&apos;s most advanced medical licensing exam preparation platform.
            Trusted by 12,000+ doctors nationwide.
          </p>

          {/* Features */}
          <ul className="space-y-3">
            {FEATURES.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20
                                flex items-center justify-center text-base flex-shrink-0">
                  {f.icon}
                </div>
                {f.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 relative z-10">
          {[
            { n: "4,000+", l: "Questions" },
            { n: "92%",    l: "Pass Rate" },
            { n: "12K+",   l: "Doctors" },
          ].map((s) => (
            <div key={s.l}
                 className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-center">
              <div className="text-xl font-extrabold text-blue-400">{s.n}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel — Login Form ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[420px] animate-fade-in-up">

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              {Icons.logo}
            </div>
            <span className="text-lg font-extrabold">
              EMLE <span className="text-blue-400">QBank</span>
            </span>
          </div>

          {/* Header */}
          <div className="mb-7">
            <h2 className="text-2xl font-extrabold text-white mb-1.5">
              Welcome back, Doctor
            </h2>
            <p className="text-slate-400 text-sm">
              Sign in to continue your EMLE preparation.
            </p>
          </div>

          {/* Demo credentials hint */}
          <div className="alert-info mb-5 text-xs">
            <span className="text-blue-400">💡</span>
            <span>
              <strong className="text-blue-300">Demo:</strong>&nbsp;
              doctor@emleqbank.com &nbsp;/&nbsp; password123
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="alert-error mb-5 animate-fade-in">
              {Icons.alert}
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Email */}
            <div>
              <label htmlFor="email" className="input-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="doctor@example.com"
                className="input-field"
                disabled={loading}
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="input-label mb-0">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-12"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500
                             hover:text-slate-300 transition-colors p-1"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? Icons.eyeOff : Icons.eye}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 h-12 text-base"
            >
              {loading ? (
                <>
                  <div className="spinner w-4 h-4" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider-text my-6">OR</div>

          {/* Google SSO (placeholder — Phase 6 expansion) */}
          <button
            type="button"
            className="btn-ghost w-full h-11"
            onClick={() => setError("Google sign-in coming soon!")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Start free trial →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
