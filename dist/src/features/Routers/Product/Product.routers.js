"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
// routers/Product.routers.ts
const express_1 = require("express");
const Product_Controller_1 = require("../../Controller/Product/Product.Controller");
exports.productRouter = (0, express_1.Router)();
// ENDPOINT: /api/products
exports.productRouter.post("/", Product_Controller_1.createProduct);
exports.productRouter.get("/", Product_Controller_1.getProducts);
exports.productRouter.get("/:id", Product_Controller_1.getProductById);
exports.productRouter.put("/:id", Product_Controller_1.updateProduct);
exports.productRouter.delete("/:id", Product_Controller_1.deleteProduct);
//# sourceMappingURL=Product.routers.js.map