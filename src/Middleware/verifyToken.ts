import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { AUTH_COOKIE_NAME } from "../config/cookieOptions";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  // Prioritas 1: cookie httpOnly (dipakai browser/frontend web).
  // Prioritas 2 (fallback): header Authorization Bearer (dipakai klien non-browser, Postman, dsb).
  const token =
    (req as any).cookies?.[AUTH_COOKIE_NAME] ||
    req.headers.authorization?.split(" ")[1];

  if (!token)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Token tidak tersedia!" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = verified;
    next();
  } catch (error) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Token tidak valid!" });
  }
};
