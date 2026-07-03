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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
const prisma_1 = __importDefault(require("../../../prisma"));
const Expense_Repositories_1 = require("./../../Repositories/Expense/Expense.Repositories");
class ExpenseService {
    constructor() {
        this.expenseRepository = new Expense_Repositories_1.ExpenseRepository();
    }
    getChartData() {
        return __awaiter(this, void 0, void 0, function* () {
            const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const now = new Date();
            const year = now.getFullYear();
            // Gunakan raw query dengan date_trunc untuk aggregate per bulan (bukan per timestamp)
            const revenueRaw = yield prisma_1.default.$queryRaw `
        SELECT
          EXTRACT(MONTH FROM "createdAt")::int AS month,
          COALESCE(SUM("totalAmount"), 0)      AS total
        FROM orders
        WHERE "deletedAt" IS NULL
          AND EXTRACT(YEAR FROM "createdAt") = ${year}
        GROUP BY month
        ORDER BY month ASC
      `;
            const expenseRaw = yield prisma_1.default.$queryRaw `
        SELECT
          EXTRACT(MONTH FROM "createdAt")::int AS month,
          COALESCE(SUM("amount"), 0)           AS total
        FROM expenses
        WHERE EXTRACT(YEAR FROM "createdAt") = ${year}
        GROUP BY month
        ORDER BY month ASC
      `;
            const revenueByMonth = Array(12).fill(0);
            const expenseByMonth = Array(12).fill(0);
            revenueRaw.forEach((r) => {
                revenueByMonth[r.month - 1] = Number(r.total);
            });
            expenseRaw.forEach((r) => {
                expenseByMonth[r.month - 1] = Number(r.total);
            });
            return MONTH_NAMES.map((month, i) => ({
                month,
                revenue: Math.round(revenueByMonth[i]),
                expenses: Math.round(expenseByMonth[i]),
            }));
        });
    }
    createExpense(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.expenseRepository.createExpense(data);
        });
    }
}
exports.ExpenseService = ExpenseService;
//# sourceMappingURL=Expense.Services.js.map