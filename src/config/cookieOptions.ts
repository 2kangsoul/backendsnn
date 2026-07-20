import type { CookieOptions } from "express";
export const AUTH_COOKIE_NAME = "token";

export const authCookieOptions: CookieOptions = {
  httpOnly: true, 
  secure: process.env.NODE_ENV === "production", 
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000,
};
