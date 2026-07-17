import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  const token = req.headers.authorization?.split(" ")[1];
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
