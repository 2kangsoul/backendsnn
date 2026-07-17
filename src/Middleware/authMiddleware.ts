import { Request, Response, NextFunction } from "express";
import { jwtUtil } from "../utils/jwtUtil";
import { UnAuthorizedError } from "../error/unauthorized";
import { Forbidden } from "../error/forbidden";

export class AuthMiddleware {
  static authenticated(req: Request, res: Response, next: NextFunction) {
    const {token} = req.cookies;
    if (!token) throw new UnAuthorizedError("Token is required");
    const verifyToken = jwtUtil.verifyToken(token);
    res.locals.payload = verifyToken;
    next();
  }
  static authorized(accessRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { payload } = res.locals;
      if (!accessRoles.includes(payload.role))
        throw new Forbidden("Access denied");
      next();
    };
  }
}
