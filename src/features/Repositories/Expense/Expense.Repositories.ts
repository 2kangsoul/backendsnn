import prisma from "../../../prisma";


export class ExpenseRepository {
  async getExpensesByMonth() {
    return await prisma.expense.groupBy({
      by: ["createdAt"],
      _sum: { amount: true },
      orderBy: { createdAt: "asc" },
    });
  }

  async createExpense(data: {
    amount: number;
    description?: string;
    userId: string;
  }) {
    return await prisma.expense.create({
      data: {
        amount: data.amount,
        description: data.description ?? null,
        userId: data.userId,
      },
    });
  }
}