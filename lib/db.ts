/**
 * lib/db.ts
 *
 * Reusable database query functions used across the app.
 * Centralizing queries here prevents duplication and makes
 * testing easier.
 */

import { prisma } from "./prisma";
import { Subject, Difficulty, SessionMode } from "@prisma/client";

// ─── Types ─────────────────────────────────────────────────────────────────
export type QuestionFilter = {
  subject?: Subject | "all";
  topic?: string;
  difficulty?: Difficulty | "all";
  count?: number;
  excludeIds?: string[];
};

// ─── QUESTIONS ─────────────────────────────────────────────────────────────

/** Fetch questions for a QBank session */
export async function fetchQuestions(filter: QuestionFilter) {
  const where: Record<string, unknown> = { isActive: true };

  if (filter.subject && filter.subject !== "all") {
    where.subject = filter.subject;
  }
  if (filter.topic) {
    where.topic = { contains: filter.topic, mode: "insensitive" };
  }
  if (filter.difficulty && filter.difficulty !== "all") {
    where.difficulty = filter.difficulty;
  }
  if (filter.excludeIds?.length) {
    where.id = { notIn: filter.excludeIds };
  }

  // Fetch more than needed, then shuffle in JS
  const limit = Math.min((filter.count ?? 10) * 3, 150);
  const questions = await prisma.question.findMany({
    where,
    take: limit,
    select: {
      id: true,
      stem: true,
      question: true,
      options: true,
      correct: true,
      explanation: true,
      highYield: true,
      subject: true,
      topic: true,
      subtopic: true,
      difficulty: true,
      imageUrl: true,
    },
  });

  // Shuffle and take requested count
  return questions
    .sort(() => Math.random() - 0.5)
    .slice(0, filter.count ?? 10);
}

/** Get total question count per subject */
export async function getQuestionStats() {
  const stats = await prisma.question.groupBy({
    by: ["subject"],
    where: { isActive: true },
    _count: { id: true },
  });
  return stats.map(s => ({ subject: s.subject, count: s._count.id }));
}

// ─── USER ANSWERS ──────────────────────────────────────────────────────────

/** Save a user's answer */
export async function saveAnswer(params: {
  userId: string;
  questionId: string;
  sessionId?: string;
  selected: number;
  isCorrect: boolean;
  timeTaken?: number;
}) {
  return prisma.userAnswer.upsert({
    where: {
      userId_questionId_sessionId: {
        userId: params.userId,
        questionId: params.questionId,
        sessionId: params.sessionId ?? "",
      },
    },
    update: {
      selected: params.selected,
      isCorrect: params.isCorrect,
      timeTaken: params.timeTaken,
    },
    create: {
      userId: params.userId,
      questionId: params.questionId,
      sessionId: params.sessionId,
      selected: params.selected,
      isCorrect: params.isCorrect,
      timeTaken: params.timeTaken,
    },
  });
}

/** Get user's answer history for dashboard analytics */
export async function getUserStats(userId: string) {
  const [totalAnswers, correctAnswers, bySubject, recentSessions] =
    await Promise.all([
      // Total answered
      prisma.userAnswer.count({ where: { userId } }),

      // Total correct
      prisma.userAnswer.count({ where: { userId, isCorrect: true } }),

      // By subject (join with questions)
      prisma.$queryRaw`
        SELECT q.subject, 
               COUNT(*)::int as total,
               SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END)::int as correct
        FROM user_answers ua
        JOIN questions q ON ua.question_id = q.id
        WHERE ua.user_id = ${userId}
        GROUP BY q.subject
      `,

      // Recent sessions
      prisma.examSession.findMany({
        where: { userId, completed: true },
        orderBy: { completedAt: "desc" },
        take: 10,
        select: {
          id: true,
          mode: true,
          subject: true,
          totalQs: true,
          correct: true,
          score: true,
          timeTaken: true,
          completedAt: true,
        },
      }),
    ]);

  const accuracy = totalAnswers > 0
    ? Math.round((correctAnswers / totalAnswers) * 100)
    : 0;

  // Predicted score (weighted recent accuracy)
  const recent = await prisma.userAnswer.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { isCorrect: true },
  });
  const recentAccuracy = recent.length > 0
    ? recent.filter(a => a.isCorrect).length / recent.length
    : 0;
  const predictedScore = Math.min(
    95,
    Math.max(30, Math.round(35 + recentAccuracy * 60))
  );

  return {
    totalAnswered: totalAnswers,
    totalCorrect: correctAnswers,
    accuracy,
    predictedScore,
    bySubject: bySubject as Array<{ subject: string; total: number; correct: number }>,
    recentSessions,
  };
}

// ─── EXAM SESSIONS ─────────────────────────────────────────────────────────

/** Create a new exam session */
export async function createExamSession(params: {
  userId: string;
  mode: SessionMode;
  subject: string;
  questionIds: string[];
}) {
  return prisma.examSession.create({
    data: {
      userId: params.userId,
      mode: params.mode,
      subject: params.subject,
      questionIds: params.questionIds,
      totalQs: params.questionIds.length,
    },
  });
}

/** Complete an exam session */
export async function completeExamSession(params: {
  sessionId: string;
  correct: number;
  timeTaken?: number;
}) {
  const session = await prisma.examSession.findUnique({
    where: { id: params.sessionId },
    select: { totalQs: true },
  });
  if (!session) return;

  return prisma.examSession.update({
    where: { id: params.sessionId },
    data: {
      correct: params.correct,
      score: (params.correct / session.totalQs) * 100,
      timeTaken: params.timeTaken,
      completed: true,
      completedAt: new Date(),
    },
  });
}
