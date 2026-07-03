import { Router } from "express";
import { OrderController } from "../../Controller/Order/Order.Controller";

const router = Router();
const orderController = new OrderController();

router.get("/financials", orderController.getFinancials);

// ✅ Tambahan baru
router.get("/recent", orderController.getRecentOrders);

// ✅ Tambahan baru
router.post("/", orderController.createOrder);

export default router;