/**
 * app/layout.tsx  ← MODIFIED in Phase 2
 *
 * Changes from original:
 * 1. Added AuthProvider wrapping the entire app
 * 2. Added Inter + Plus Jakarta Sans fonts (UWorld-like professional look)
 * 3. Added dark class on <html> by default (matches EMLE-3 dark design)
 * 4. Added metadata improvements
 * 5. Added global error boundary
 */

import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

// ─── Fonts ─────────────────────────────────────────────────────────────────
const inter = Inter({
  subsets:  ["latin"],
  variable: "--font-inter",
  display:  "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets:  ["latin"],
  variable: "--font-jakarta",
  weight:   ["400", "500", "600", "700", "800"],
  display:  "swap",
});

// ─── Metadata ──────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default:  "EMLE QBank — Egypt's #1 Medical Licensing Exam Prep",
    template: "%s | EMLE QBank",
  },
  description:
    "4,000+ EMLE-level clinical vignette questions, real-time AI generation, " +
    "spaced-repetition flashcards, and analytics to help Egyptian doctors pass " +
    "the Medical Licensing Exam on the first attempt.",
  keywords: [
    "EMLE", "Egyptian Medical Licensing Exam", "QBank", "USMLE Egypt",
    "medical exam prep", "Egypt doctor", "طب مصر", "امتحان الترخيص",
  ],
  authors:  [{ name: "EMLE QBank" }],
  robots:   "index, follow",
  openGraph: {
    type:        "website",
    locale:      "en_US",
    siteName:    "EMLE QBank",
    title:       "EMLE QBank — Egypt's #1 Medical Licensing Exam Prep",
    description: "4,000+ EMLE-level questions with AI generation and analytics.",
  },
};

export const viewport: Viewport = {
  width:        "device-width",
  initialScale: 1,
  themeColor:   "#0A0F1E",
};

// ─── Root Layout ───────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // "dark" class enables Tailwind dark mode globally
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`
          ${inter.variable} ${jakarta.variable}
          font-sans antialiased
          bg-[#0A0F1E] text-slate-100
          min-h-screen
        `}
      >
        {/*
          AuthProvider wraps everything so any Client Component
          can call useAuth() to get the current user.
        */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
