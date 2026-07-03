export declare class AnalyticService {
    private analyticRepository;
    getPageviewsDashboardData(): Promise<{
        total: number;
        trend: string;
        isPositive: boolean;
    }>;
    getTotalSessionsData(): Promise<{
        total: number;
        trend: string;
        isPositive: boolean;
        chartData: {
            month: string;
            sessions: number;
        }[];
    }>;
}
//# sourceMappingURL=siteAnalytics.Services.d.ts.map