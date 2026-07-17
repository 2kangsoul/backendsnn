import { Router } from "express";
import { OrderController } from "./order.controllers";
import { AuthMiddleware } from "../../Middleware/authMiddleware";

export const orderRoute = Router();

/*
|--------------------------------------------------------------------------
| Create Order
|--------------------------------------------------------------------------
| USER
| ADMIN
| SUPER_ADMIN
*/

orderRoute.post(
  "/create",
  AuthMiddleware.authenticated,
  OrderController.createOrder,
);

/*
|--------------------------------------------------------------------------
| Get All Orders
|--------------------------------------------------------------------------
| ADMIN
| SUPER_ADMIN
*/

orderRoute.get(
  "/get",
  AuthMiddleware.authenticated,
  AuthMiddleware.authorized(["ADMIN", "SUPER_ADMIN"]),
  OrderController.getOrders,
);

/*
|--------------------------------------------------------------------------
| Update Status Order
|--------------------------------------------------------------------------
| ADMIN
| SUPER_ADMIN
*/

orderRoute.patch(
  "/update/:id",
  AuthMiddleware.authenticated,
  AuthMiddleware.authorized(["ADMIN", "SUPER_ADMIN"]),
  OrderController.updateStatus,
);

/*
|--------------------------------------------------------------------------
| Delete Order
|--------------------------------------------------------------------------
| ADMIN
| SUPER_ADMIN
*/

orderRoute.delete(
  "/delete/:id",
  AuthMiddleware.authenticated,
  AuthMiddleware.authorized(["ADMIN", "SUPER_ADMIN"]),
  OrderController.deleteOrder,
);