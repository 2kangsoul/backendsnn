import { Router } from "express";
import { MonthlyUsersController } from "../../Controller/MonthlyUsers/monthlyUsers.controller";

const router = Router();
const controller = new MonthlyUsersController();

router.get("/", (req, res) => controller.getMonthlyUsers(req, res));
router.get("/summary", (req, res) => controller.getMonthlySummary(req, res));
router.get("/by-country", (req, res) => controller.getUsersByCountry(req, res));
router.get("/realtime", (req, res) => controller.getRealtimeOverview(req, res));

export default router;
