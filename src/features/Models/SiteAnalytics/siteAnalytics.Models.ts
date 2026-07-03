import { SiteAnalytic } from "@prisma/client";

// Ini hanya sekadar alias/referensi dari Model asli bawaan Prisma
// Jika sewaktu-waktu kamu butuh memodifikasi bentuk tipe datanya untuk dikirim ke frontend
export type SiteAnalyticModel = SiteAnalytic;

// Nanti kamu bisa menambahkan validasi Zod di sini jika ada endpoint POST