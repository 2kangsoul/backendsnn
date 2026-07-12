import type { CookieOptions } from "express";

// Dipakai bareng di login (res.cookie) dan logout (res.clearCookie).
// PENTING: opsi di clearCookie harus PERSIS SAMA (kecuali maxAge/expires),
// kalau tidak browser tidak akan menganggapnya cookie yang sama dan tidak akan terhapus.
export const AUTH_COOKIE_NAME = "token";

export const authCookieOptions: CookieOptions = {
  httpOnly: true, // JS di browser tidak bisa baca/tulis cookie ini (mitigasi XSS)
  secure: process.env.NODE_ENV === "production", // wajib true kalau sudah pakai HTTPS
  sameSite: "lax", // cukup untuk localhost:3000 <-> localhost:8000; tinjau ulang kalau nanti beda domain asli
  path: "/",
  maxAge: 24 * 60 * 60 * 1000, // 1 hari, samakan dengan expiresIn JWT di auth.controller.ts
};
