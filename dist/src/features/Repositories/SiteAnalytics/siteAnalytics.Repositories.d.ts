export declare class AnalyticRepository {
    countPageviews(): Promise<number>;
    countPageviewsByDateRange(startDate: Date, endDate: Date): Promise<number>;
    countTotalSessions(): Promise<number>;
    countSessionsByDateRange(startDate: Date, endDate: Date): Promise<number>;
    getSessionsPerMonth(): Promise<{
        month: string;
        sessions: number;
    }[]>;
}
//# sourceMappingURL=siteAnalytics.Repositories.d.ts.map