export declare class OrderService {
    private orderRepository;
    getFinancialDashboardData(): Promise<{
        totalRevenue: number;
        totalProfit: number;
        profitTrend: string;
        isProfitPositive: boolean;
    }>;
    getRecentOrders(): Promise<{
        createdAt: Date;
        orderNumber: string;
        totalAmount: number;
        status: string;
    }[]>;
    createOrder(data: {
        orderNumber: string;
        totalAmount: number;
        profitAmount: number;
        status: string;
        userId: string;
        note?: string;
        items: {
            productId: string;
            quantity: number;
            price: number;
        }[];
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        orderNumber: string;
        totalAmount: number;
        profitAmount: number;
        status: string;
        note: string | null;
    }>;
}
//# sourceMappingURL=Order.Services.d.ts.map