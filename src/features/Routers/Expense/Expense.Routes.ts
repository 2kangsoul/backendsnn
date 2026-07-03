import { Router } from "express";
import { ExpenseController } from "../../Controller/Expense/Expense.Controller";

const router = Router();
const expenseController = new ExpenseController();

router.get("/chart", expenseController.getChartData);
router.post("/", expenseController.createExpense);

export default router;