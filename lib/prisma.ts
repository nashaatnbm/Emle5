/**
 * lib/prisma.ts
 * 
 * Prisma Client singleton.
 * Next.js hot-reloading creates new module instances in development,
 * which would exhaust the connection pool. We store the client on
 * globalThis to reuse it across hot reloads.
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
