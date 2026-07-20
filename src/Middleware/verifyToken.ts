import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  // ponytail: baca cookie httpOnly dulu (frontend web), fallback Bearer (Postman/script).
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Token tidak tersedia!" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET!) as any;
    // ponytail: token disign dengan { sub: userId } (auth.services), tapi
    // handler like/checkUserLike baca req.user.id. Normalisasi di sini sekali
    // supaya SEMUA caller yang pakai req.user.id jalan, bukan tambal per-handler.
    (req as any).user = { ...verified, id: verified.id ?? verified.sub };
    next();
  } catch (error) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Token tidak valid!" });
  }
};
