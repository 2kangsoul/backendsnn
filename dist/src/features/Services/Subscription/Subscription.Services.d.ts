export declare class SubscriptionService {
    private subscriptionRepository;
    getSubscriptionDashboardData(): Promise<{
        total: number;
        trend: string;
        isPositive: boolean;
    }>;
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
//# sourceMappingURL=Subscription.Services.d.ts.map