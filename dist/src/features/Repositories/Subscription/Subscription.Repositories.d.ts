export declare class SubscriptionRepository {
    countActiveSubscriptions(): Promise<number>;
    countActiveSubscriptionsByDateRange(startDate: Date, endDate: Date): Promise<number>;
    createSubscription(data: {
        plan: string;
        status: string;
        userId: string;
        expiredAt?: Date | null;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: string;
        plan: string;
        expiredAt: Date | null;
    }>;
}
//# sourceMappingURL=Subscription.Repositories.d.ts.map