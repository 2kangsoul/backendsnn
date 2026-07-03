import { PrismaClient } from "@prisma/client";

// Singleton Prisma — satu koneksi dipakai seluruh aplikasi
// Mencegah connection pool exhaustion di production
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable wajib di-set!");
}

const prisma = globalThis.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

export default prisma;
