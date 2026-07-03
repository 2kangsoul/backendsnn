export declare class ExpenseService {
    private expenseRepository;
    getChartData(): Promise<{
        month: string;
        revenue: number;
        expenses: number;
    }[]>;
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
//# sourceMappingURL=Expense.Services.d.ts.map