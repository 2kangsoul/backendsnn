export declare class OrderRepository {
    getTotalFinancials(): Promise<import(".prisma/client").Prisma.GetOrderAggregateType<{
        _sum: {
            totalAmount: true;
            profitAmount: true;
        };
        where: {
            deletedAt: null;
        };
    }>>;
    getFinancialsByDateRange(startDate: Date, endDate: Date): Promise<import(".prisma/client").Prisma.GetOrderAggregateType<{
        _sum: {
            totalAmount: true;
            profitAmount: true;
        };
        where: {
            deletedAt: null;
            createdAt: {
                gte: Date;
                lte: Date;
            };
        };
    }>>;
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
//# sourceMappingURL=Order.Repositories.d.ts.map