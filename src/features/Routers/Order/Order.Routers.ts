import { Router } from "express";
import { OrderController } from "../../Controller/Order/Order.Controller";

const router = Router();
const orderController = new OrderController();

router.get("/financials", orderController.getFinancials);
router.get("/recent", orderController.getRecentOrders);
router.get("/monthly-revenue", orderController.getMonthlyRevenue);
router.post("/", orderController.createOrder);

export default router;
