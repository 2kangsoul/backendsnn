import { Router } from "express";
import { OrderController } from "./order.controllers";
import { AuthMiddleware } from "../../Middleware/authMiddleware";

export const orderRoute = Router();
orderRoute.post(
  "/create",
  AuthMiddleware.authenticated,
  OrderController.createOrder,
);
orderRoute.get(
  "/get",
  AuthMiddleware.authenticated,
  AuthMiddleware.authorized(["ADMIN", "SUPER_ADMIN"]),
  OrderController.getOrders,
);
orderRoute.patch(
  "/update/:id",
  AuthMiddleware.authenticated,
  AuthMiddleware.authorized(["ADMIN", "SUPER_ADMIN"]),
  OrderController.updateStatus,
);
orderRoute.delete(
  "/delete/:id",
  AuthMiddleware.authenticated,
  AuthMiddleware.authorized(["ADMIN", "SUPER_ADMIN"]),
  OrderController.deleteOrder,
);