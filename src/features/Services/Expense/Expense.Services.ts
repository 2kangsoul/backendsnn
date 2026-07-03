import prisma from "../../../prisma";
import { ExpenseRepository } from "./../../Repositories/Expense/Expense.Repositories";


export class ExpenseService {
  private expenseRepository = new ExpenseRepository();

  async getChartData() {
    const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const now = new Date();
    const year = now.getFullYear();

    // Gunakan raw query dengan date_trunc untuk aggregate per bulan (bukan per timestamp)
    const revenueRaw: Array<{ month: number; total: bigint | number }> =
      await prisma.$queryRaw`
        SELECT
          EXTRACT(MONTH FROM "createdAt")::int AS month,
          COALESCE(SUM("totalAmount"), 0)      AS total
        FROM orders
        WHERE "deletedAt" IS NULL
          AND EXTRACT(YEAR FROM "createdAt") = ${year}
        GROUP BY month
        ORDER BY month ASC
      `;

    const expenseRaw: Array<{ month: number; total: bigint | number }> =
      await prisma.$queryRaw`
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
  }

  async createExpense(data: {
    amount: number;
    description?: string;
    userId: string;
  }) {
    return await this.expenseRepository.createExpense(data);
  }
}