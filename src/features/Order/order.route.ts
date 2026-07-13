import { Router } from "express";
import { OrderController } from "./order.controller";
import { verifyToken } from "../../Middleware/verifyToken";

export const orderRoute = Router()
orderRoute.post(
  "/create",
  verifyToken,
  OrderController.createOrder
);