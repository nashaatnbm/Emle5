"use client";

/**
 * app/register/page.tsx — MODIFIED in Phase 2
 *
 * Full redesign:
 * - Matches UWorld dark professional style
 * - Connects to /api/auth/register (real DB)
 * - Password strength indicator
 * - School selector (Egyptian medical schools)
 * - Updates AuthContext on success
 */

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { ClientUser } from "@/types";

// ─── Egyptian Medical Schools ──────────────────────────────────────────────
const SCHOOLS = [
  "Kasr Al-Ainy (Cairo University)",
  "Ain Shams University",
  "Alexandria University",
  "Assiut University",
  "Mansoura University",
  "Zagazig University",
  "Tanta University",
  "Banha University",
  "Suez Canal University",
  "Menoufia University",
  "Fayoum University",
  "South Valley University",
  "Aswan University",
  "October 6 University",
  "Misr University for Science and Technology",
  "Other",
];

// ─── Password strength ─────────────────────────────────────────────────────
function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (pw.length === 0) return { score: 0, label: "",        color: "" };
  if (pw.length < 6)  return { score: 1, label: "Too short", color: "bg-red-500" };
  if (pw.length < 8)  return { score: 2, label: "Weak",     color: "bg-orange-500" };

  const hasUpper   = /[A-Z]/.test(pw);
  const hasLower   = /[a-z]/.test(pw);
  const hasNumber  = /\d/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  if (score <= 1) return { score: 2, label: "Weak",   color: "bg-orange-500" };
  if (score <= 2) return { score: 3, label: "Fair",   color: "bg-yellow-500" };
  if (score <= 3) return { score: 4, label: "Good",   color: "bg-emerald-400" };
  return              { score: 5, label: "Strong", color: "bg-emerald-500" };
}

// ─── Icons ─────────────────────────────────────────────────────────────────
const EyeIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOffIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const AlertIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const CheckIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
const LogoIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>;

// ─── Plan benefits ─────────────────────────────────────────────────────────
const TRIAL_BENEFITS = [
  "Access to 100 EMLE-level questions",
  "10 AI question generations",
  "Performance analytics dashboard",
  "Full Tutor Mode explanations",
  "No credit card required",
];

// ─── Component ─────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router      = useRouter();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    name:     "",
    email:    "",
    password: "",
    school:   "",
    terms:    false,
  });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);

  const pwStrength = getPasswordStrength(form.password);

  function update(k: string, v: string | boolean) {
    setForm(f => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    // Client validation
    if (!form.name.trim())         { setError("Please enter your full name."); return; }
    if (!form.email.trim())        { setError("Please enter your email address."); return; }
    if (form.password.length < 8)  { setError("Password must be at least 8 characters."); return; }
    if (!form.terms)               { setError("You must accept the Terms of Service to continue."); return; }

    setLoading(true);

    try {
      const res  = await fetch("/api/auth/register", {
        method:      "POST",
        headers:     { "Content-Type": "application/json" },
        credentials: "include",
        body:        JSON.stringify({
          name:     form.name.trim(),
          email:    form.email.trim().toLowerCase(),
          password: form.password,
          school:   form.school || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      setUser(data.user as ClientUser);
      setSuccess(true);

      // Small delay for success animation then redirect
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1200);

    } catch {
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  }

  // ─── Success screen ────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center p-6">
        <div className="text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500/30
                          rounded-full flex items-center justify-center mx-auto mb-6
                          shadow-correct">
            <span className="text-4xl">🎉</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-2">
            Welcome to EMLE QBank!
          </h2>
          <p className="text-slate-400 mb-4">
            Your account has been created. Your 7-day free trial starts now.
          </p>
          <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm">
            <div className="spinner w-4 h-4 border-emerald-400 border-t-transparent" />
            Redirecting to dashboard...
          </div>
        </div>
      </div>
    );
  }

  // ─── Main form ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0A0F1E] flex">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-[42%] flex-col justify-between
                      bg-gradient-to-br from-[#0F172A] via-[#0D1F3C] to-[#0A0F1E]
                      border-r border-slate-800/60 p-10 relative overflow-hidden">

        <div className="absolute top-0 right-0 w-80 h-80 rounded-full
                        bg-gradient-radial from-blue-600/8 to-transparent pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center
                          shadow-lg shadow-blue-600/30 text-white">
            <LogoIcon />
          </div>
          <div>
            <span className="text-lg font-extrabold text-white">
              EMLE <span className="text-blue-400">QBank</span>
            </span>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">
              Medical Licensing Prep
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20
                          rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-soft" />
            <span className="text-blue-300 text-xs font-semibold">7-Day Free Trial — No Credit Card</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white leading-tight mb-4">
            Start your journey<br/>
            <span className="text-gradient">to EMLE success.</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xs">
            Join 12,000+ Egyptian doctors who prepared smarter and passed the EMLE on their first attempt.
          </p>

          {/* Trial benefits */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 mb-6">
            <p className="text-white font-semibold text-sm mb-4">
              🎁 Your free trial includes:
            </p>
            <ul className="space-y-2.5">
              {TRIAL_BENEFITS.map((b, i) => (
                <li key={i} className="flex items-center gap-2.5 text-slate-300 text-sm">
                  <span className="w-5 h-5 bg-emerald-500/15 border border-emerald-500/30
                                   rounded-full flex items-center justify-center flex-shrink-0 text-emerald-400">
                    <CheckIcon />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial */}
          <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-4">
            <p className="text-slate-300 text-xs italic leading-relaxed mb-3">
              &ldquo;I used EMLE QBank for 3 months and passed on my first attempt.
              The AI-generated questions from my own notes were exactly what I needed.&rdquo;
            </p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center
                              text-white text-xs font-bold">M</div>
              <div>
                <p className="text-white text-xs font-semibold">Dr. Mohamed Hassan</p>
                <p className="text-slate-500 text-xs">Kasr Al-Ainy · Class 2024</p>
              </div>
              <div className="ml-auto text-yellow-400 text-xs">★★★★★</div>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-slate-600 text-xs relative z-10">
          🔒 Your data is encrypted and never shared.
        </p>
      </div>

      {/* ── Right Panel — Form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-[440px] animate-fade-in-up">

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-7 lg:hidden">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <LogoIcon />
            </div>
            <span className="text-lg font-extrabold">
              EMLE <span className="text-blue-400">QBank</span>
            </span>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-white mb-1.5">
              Create your account
            </h2>
            <p className="text-slate-400 text-sm">
              7-day free trial. No credit card required.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="alert-error mb-5 animate-fade-in">
              <AlertIcon />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Name */}
            <div>
              <label htmlFor="name" className="input-label">Full Name</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={e => update("name", e.target.value)}
                placeholder="Dr. Mohamed Hassan"
                className="input-field"
                disabled={loading}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="input-label">Email Address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={e => update("email", e.target.value)}
                placeholder="doctor@example.com"
                className="input-field"
                disabled={loading}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="input-label">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={e => update("password", e.target.value)}
                  placeholder="Minimum 8 characters"
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
                  {showPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              {/* Password strength bar */}
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${pwStrength.color}`}
                      style={{ width: `${(pwStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${
                    pwStrength.score <= 2 ? "text-orange-400" :
                    pwStrength.score <= 3 ? "text-yellow-400" : "text-emerald-400"
                  }`}>
                    {pwStrength.label}
                  </p>
                </div>
              )}
            </div>

            {/* School */}
            <div>
              <label htmlFor="school" className="input-label">
                Medical School <span className="text-slate-500 normal-case font-normal">(optional)</span>
              </label>
              <select
                id="school"
                value={form.school}
                onChange={e => update("school", e.target.value)}
                className="input-field appearance-none"
                disabled={loading}
              >
                <option value="">Select your medical school</option>
                {SCHOOLS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                id="terms"
                type="checkbox"
                checked={form.terms}
                onChange={e => update("terms", e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-blue-500 flex-shrink-0 cursor-pointer"
                disabled={loading}
              />
              <label htmlFor="terms" className="text-sm text-slate-400 cursor-pointer leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-12 text-base mt-2"
            >
              {loading ? (
                <>
                  <div className="spinner w-4 h-4" />
                  Creating account...
                </>
              ) : (
                "Create Account — Start Free Trial"
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
