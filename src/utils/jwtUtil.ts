import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { JWT_EXPIRES,JWT_SECRET } from "../config/env.config";
export class jwtUtil {
  static signToken(payload: any) {
    return jwt.sign(payload, JWT_SECRET!, {
      expiresIn: JWT_EXPIRES! as StringValue,
    });
  }
  static verifyToken(token:string) {
    return jwt.verify(token,JWT_SECRET!)
  }
}
