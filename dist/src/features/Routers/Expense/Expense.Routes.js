"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Expense_Controller_1 = require("../../Controller/Expense/Expense.Controller");
const router = (0, express_1.Router)();
const expenseController = new Expense_Controller_1.ExpenseController();
router.get("/chart", expenseController.getChartData);
router.post("/", expenseController.createExpense);
exports.default = router;
//# sourceMappingURL=Expense.Routes.js.map