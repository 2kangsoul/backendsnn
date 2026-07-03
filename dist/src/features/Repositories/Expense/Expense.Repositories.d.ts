export declare class ExpenseRepository {
    getExpensesByMonth(): Promise<(import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ExpenseGroupByOutputType, "createdAt"[]> & {
        _sum: {
            amount: number | null;
        };
    })[]>;
    createExpense(data: {
        amount: number;
        description?: string;
        userId: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        description: string | null;
        amount: number;
    }>;
}
//# sourceMappingURL=Expense.Repositories.d.ts.map