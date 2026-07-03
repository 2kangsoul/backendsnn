"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseController = void 0;
const Expense_Services_1 = require("../../Services/Expense/Expense.Services");
class ExpenseController {
    constructor() {
        this.expenseService = new Expense_Services_1.ExpenseService();
        this.getChartData = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.expenseService.getChartData();
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error getChartData:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        this.createExpense = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { amount, description, userId } = req.body;
                const data = yield this.expenseService.createExpense({
                    amount: parseFloat(amount),
                    description,
                    userId,
                });
                res.status(201).json({ success: true, data });
            }
            catch (error) {
                console.error("Error createExpense:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
}
exports.ExpenseController = ExpenseController;
//# sourceMappingURL=Expense.Controller.js.map