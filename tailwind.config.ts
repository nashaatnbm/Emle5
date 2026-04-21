/**
 * tailwind.config.ts — MODIFIED in Phase 2
 *
 * Extended with:
 * - Custom color palette (matches our CSS variables)
 * - Custom font families
 * - Custom animations
 * - darkMode: "class" (toggled via .dark on <html>)
 */

import type { Config } from "tailwindcss";

const config: Config = {
  // Dark mode via class strategy (we set 'dark' on <html> in layout.tsx)
  darkMode: "class",

  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      // ── Fonts ────────────────────────────────────────────────────────────
      fontFamily: {
        sans:    ["var(--font-jakarta)", "var(--font-inter)", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "Fira Code", "monospace"],
        jakarta: ["var(--font-jakarta)", "sans-serif"],
        inter:   ["var(--font-inter)", "sans-serif"],
      },

      // ── Colors ───────────────────────────────────────────────────────────
      colors: {
        // Override slate to match our design
        background: {
          DEFAULT: "#0A0F1E",
          card:    "#1E293B",
          sidebar: "#0F172A",
          input:   "#1E293B",
          elevated:"#263148",
        },
        brand: {
          DEFAULT: "#2563EB",
          light:   "#3B82F6",
          lighter: "#60A5FA",
          dark:    "#1D4ED8",
          glow:    "rgba(37,99,235,0.2)",
          subtle:  "rgba(37,99,235,0.08)",
        },
        // Subject colors for QBank
        subject: {
          im:    "#EF4444",
          surg:  "#3B82F6",
          peds:  "#10B981",
          obg:   "#A855F7",
          em:    "#F59E0B",
          psych: "#6366F1",
          ph:    "#14B8A6",
          basic: "#64748B",
        },
      },

      // ── Background images ─────────────────────────────────────────────────
      backgroundImage: {
        "gradient-radial":  "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":   "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-gradient":    "linear-gradient(135deg, #0A0F1E 0%, #0F1A2E 50%, #0A0F1E 100%)",
        "card-gradient":    "linear-gradient(145deg, #1E293B, #161F30)",
        "blue-gradient":    "linear-gradient(135deg, #2563EB, #1D4ED8)",
        "success-gradient": "linear-gradient(135deg, #059669, #10B981)",
      },

      // ── Animations ───────────────────────────────────────────────────────
      animation: {
        "fade-in-up":   "fadeInUp 0.4s ease-out both",
        "fade-in":      "fadeIn 0.3s ease-out both",
        "slide-right":  "slideInRight 0.35s ease-out both",
        "pulse-soft":   "pulse-soft 2s ease-in-out infinite",
        "spin-slow":    "spin 2s linear infinite",
        "bounce-light": "bounce 1s ease-in-out 3",
      },

      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(20px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.5" },
        },
      },

      // ── Box shadows ───────────────────────────────────────────────────────
      boxShadow: {
        "blue-glow":  "0 0 30px rgba(37,99,235,0.3)",
        "card":       "0 4px 16px rgba(0,0,0,0.4)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.5)",
        "auth":       "0 25px 60px rgba(0,0,0,0.5)",
        "button":     "0 4px 12px rgba(37,99,235,0.35)",
        "correct":    "0 0 16px rgba(16,185,129,0.25)",
        "wrong":      "0 0 16px rgba(239,68,68,0.25)",
      },

      // ── Border radius ─────────────────────────────────────────────────────
      borderRadius: {
        "4xl": "2rem",
      },

      // ── Screen sizes ──────────────────────────────────────────────────────
      screens: {
        "xs": "400px",
      },
    },
  },

  plugins: [],
};

export default config;
