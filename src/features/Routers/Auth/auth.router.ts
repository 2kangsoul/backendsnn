import { Router } from "express";
import {
  register,
  login,
  getMe,
  logout,
} from "../../Controller/Auth/auth.controller";
import { verifyToken } from "../../../Middleware/verifyToken"; // Ganti dari authenticateToken ke verifyToken

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", verifyToken, getMe);

export { authRouter };
