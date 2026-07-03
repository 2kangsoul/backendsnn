"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../../Controller/Auth/auth.controller");
const verifyToken_1 = require("../../../Middleware/verifyToken"); // Ganti dari authenticateToken ke verifyToken
const authRouter = (0, express_1.Router)();
exports.authRouter = authRouter;
authRouter.post("/register", auth_controller_1.register);
authRouter.post("/login", auth_controller_1.login);
authRouter.get("/me", verifyToken_1.verifyToken, auth_controller_1.getMe);
//# sourceMappingURL=auth.router.js.map