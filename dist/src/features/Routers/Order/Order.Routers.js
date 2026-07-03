"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Order_Controller_1 = require("../../Controller/Order/Order.Controller");
const router = (0, express_1.Router)();
const orderController = new Order_Controller_1.OrderController();
router.get("/financials", orderController.getFinancials);
// ✅ Tambahan baru
router.get("/recent", orderController.getRecentOrders);
// ✅ Tambahan baru
router.post("/", orderController.createOrder);
exports.default = router;
//# sourceMappingURL=Order.Routers.js.map