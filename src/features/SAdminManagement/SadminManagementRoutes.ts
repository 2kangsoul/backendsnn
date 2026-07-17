import { Router } from "express";
import { AdminController } from "./SadminManagementControllers";
import { Role } from "@prisma/client";
import { AuthMiddleware } from "../../Middleware/authMiddleware";
export const routerAdmin = Router();
routerAdmin.post("/promote/:userId",AuthMiddleware.authenticated , AuthMiddleware.authorized([Role.SUPER_ADMIN]), AdminController.promote);
routerAdmin.post("/demote/:userId", AuthMiddleware.authenticated , AuthMiddleware.authorized([Role.SUPER_ADMIN]), AdminController.demote);
routerAdmin.get('/', AuthMiddleware.authenticated , AuthMiddleware.authorized([Role.SUPER_ADMIN]),AdminController.list)