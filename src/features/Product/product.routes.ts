import { Router } from "express";
import ProductsController from "./product.controllers";
import upload from "../../Middleware/uploadMiddleware";
import { AuthMiddleware } from "../../Middleware/authMiddleware";
export const productsRoute = Router();
productsRoute.post(
  "/create",
  AuthMiddleware.authenticated,
  AuthMiddleware.authorized(["ADMIN", "SUPER_ADMIN"]),
  upload.single("image"),
  ProductsController.createProducts,
);
productsRoute.patch(
  "/update/:id",
  AuthMiddleware.authenticated,
  AuthMiddleware.authorized(["ADMIN", "SUPER_ADMIN"]),
  upload.single("image"),
  ProductsController.updateProducts,
);
productsRoute.get("/get", ProductsController.getProducts); // browse tetap publik
productsRoute.get("/get/:id", ProductsController.getProductById);
productsRoute.delete(
  "/delete/:id",
  AuthMiddleware.authenticated,
  AuthMiddleware.authorized(["ADMIN", "SUPER_ADMIN"]),
  ProductsController.deleteProducts,
);
