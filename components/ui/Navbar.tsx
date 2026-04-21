"use client";

/**
 * components/ui/Navbar.tsx
 *
 * Shared navigation bar used across all pages.
 * - Reads auth state from useAuth()
 * - Shows user name + plan badge when logged in
 * - Logout button calls /api/auth/logout
 * - Mobile hamburger menu
 */

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";

const PLAN_COLORS: Record<string, string> = {
  FREE:     "bg-slate-700 text-slate-300",
  "30d":    "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  "90d":    "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  "180d":   "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  "360d":   "bg-amber-500/20 text-amber-300 border border-amber-500/30",
};

const PLAN_LABELS: Record<string, string> = {
  FREE:  "Free",
  "30d": "30 Days",
  "90d": "90 Days",
  "180d":"180 Days",
  "360d":"360 Days",
};

const NAV_LINKS = [
  { href: "/",            label: "Home"          },
  { href: "/qbank",       label: "QBank"         },
  { href: "/ai-generator",label: "AI Generator"  },
  { href: "/pricing",     label: "Pricing"       },
  { href: "/dashboard",   label: "Dashboard"     },
];

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar px-4 sm:px-6">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 flex-shrink-0 group"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center
                          text-white shadow-lg shadow-blue-600/30
                          group-hover:bg-blue-500 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2.2">
              <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
            </svg>
          </div>
          <span className="font-extrabold text-white text-base tracking-tight">
            EMLE <span className="text-blue-400">QBank</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-blue-600/15 text-blue-400 border border-blue-600/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right side: auth buttons */}
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-slate-700 animate-pulse" />
          ) : user ? (
            <>
              {/* Plan badge */}
              <span className={`hidden sm:flex text-xs px-2.5 py-1 rounded-full font-semibold ${
                PLAN_COLORS[user.plan] ?? PLAN_COLORS.FREE
              }`}>
                {PLAN_LABELS[user.plan] ?? user.plan}
              </span>

              {/* Avatar */}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg
                           hover:bg-slate-800 transition-colors group"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center
                                text-white text-xs font-bold flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium text-slate-300
                                 group-hover:text-white transition-colors">
                  {user.name.split(" ")[0]}
                </span>
              </Link>

              {/* Logout */}
              <button
                onClick={logout}
                className="hidden sm:flex btn-danger text-xs px-3 py-1.5"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-400 hover:text-white text-sm font-medium
                           px-3 py-2 rounded-lg hover:bg-slate-800 transition-all hidden sm:block"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="btn-primary text-sm px-4 py-2"
              >
                Start Free Trial
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white
                       hover:bg-slate-800 transition-all"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#0F172A]/95
                        backdrop-blur-xl border-b border-slate-800 py-3 px-4
                        flex flex-col gap-1 animate-fade-in z-50">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-medium text-slate-300
                         hover:text-white hover:bg-slate-800 transition-all"
            >
              {label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => { setMenuOpen(false); logout(); }}
              className="btn-danger text-sm mt-1"
            >
              Sign Out
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2 mt-1">
              <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-ghost text-sm">
                Sign In
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-sm">
                Start Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
