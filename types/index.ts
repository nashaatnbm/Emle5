/**
 * types/index.ts
 *
 * Shared TypeScript types. Separate from Prisma-generated types
 * so they can be used in Client Components without importing Prisma.
 */

// ─── Question ─────────────────────────────────────────────────────────────
export type QuestionOption = string; // e.g. "Start IV heparin immediately"

export type ClientQuestion = {
  id: string;
  stem: string;           // Clinical vignette
  question: string;       // "What is the BEST management?"
  options: QuestionOption[]; // Array of 5 options
  correct: number;        // 0-4 index
  explanation: string;
  highYield?: string;
  subject: string;        // "im" | "surg" | "peds" | "obg" | "em"
  topic: string;
  subtopic?: string;
  difficulty: string;
  imageUrl?: string;
};

// ─── Session ──────────────────────────────────────────────────────────────
export type SessionMode = "tutor" | "timed";

export type ExamConfig = {
  subject: string;
  topic?: string;
  difficulty?: string;
  count: number;
  mode: SessionMode;
};

export type AnswerRecord = {
  selected: number;       // Which option user picked
  correct: boolean;
  timeTaken?: number;     // Seconds
};

// ─── User ─────────────────────────────────────────────────────────────────
export type ClientUser = {
  id: string;
  email: string;
  name: string;
  plan: string;
  aiCredits: number;
  planExpiresAt?: string;
  school?: string;
};

// ─── Dashboard ────────────────────────────────────────────────────────────
export type SubjectStat = {
  subject: string;
  total: number;
  correct: number;
  accuracy: number;
};

export type DashboardData = {
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number;
  predictedScore: number;
  bySubject: SubjectStat[];
  recentSessions: RecentSession[];
};

export type RecentSession = {
  id: string;
  mode: string;
  subject: string;
  totalQs: number;
  correct: number;
  score?: number;
  timeTaken?: number;
  completedAt?: string;
};

// ─── Subjects ─────────────────────────────────────────────────────────────
export const SUBJECTS: Record<string, { label: string; color: string; icon: string }> = {
  im:    { label: "Internal Medicine",       color: "#EF4444", icon: "❤️" },
  surg:  { label: "General Surgery",         color: "#3B82F6", icon: "🔬" },
  peds:  { label: "Pediatrics",              color: "#10B981", icon: "👶" },
  obg:   { label: "Obstetrics & Gynecology", color: "#A855F7", icon: "🤰" },
  em:    { label: "Emergency Medicine",      color: "#F59E0B", icon: "🚑" },
  psych: { label: "Psychiatry",              color: "#6366F1", icon: "🧠" },
  ph:    { label: "Public Health",           color: "#14B8A6", icon: "🏥" },
  basic: { label: "Basic Sciences",          color: "#64748B", icon: "🔭" },
};

// ─── Plans ────────────────────────────────────────────────────────────────
export const PLANS = [
  { id: "30d",  label: "30 Days",  priceEGP: 499,  days: 30,  aiCredits: 50,   popular: false },
  { id: "90d",  label: "90 Days",  priceEGP: 999,  days: 90,  aiCredits: 150,  popular: true  },
  { id: "180d", label: "180 Days", priceEGP: 1499, days: 180, aiCredits: 300,  popular: false },
  { id: "360d", label: "360 Days", priceEGP: 2299, days: 360, aiCredits: 9999, popular: false },
] as const;

// ─── API Response helpers ──────────────────────────────────────────────────
export type ApiSuccess<T> = { success: true; data: T };
export type ApiError      = { success: false; error: string };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;
