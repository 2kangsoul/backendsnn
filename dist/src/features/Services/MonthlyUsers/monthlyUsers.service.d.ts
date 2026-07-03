import { MonthlyUserData, MonthlyUsersSummary, UsersByDevice, UsersByCountry, RealtimeOverview } from "../../Models/MonthlyUsers/monthlyUsers.model";
export declare class MonthlyUsersService {
    private repo;
    constructor();
    /**
     * Returns a 12-month array with user registration counts.
     * Months with zero registrations are filled with 0.
     */
    getMonthlyUsers(year: number): Promise<MonthlyUserData[]>;
    /**
     * Summary KPIs for the dashboard header cards.
     */
    getMonthlySummary(): Promise<MonthlyUsersSummary>;
    /**
     * Device breakdown with percentages — matches the dashboard donut chart data.
     */
    getUsersByDevice(): Promise<UsersByDevice[]>;
    /**
     * Country breakdown with percentages — matches the "Users by country" bar chart.
     */
    getUsersByCountry(limit?: number): Promise<UsersByCountry[]>;
    /**
     * Single endpoint that returns everything needed for the
     * "Reports overview" dashboard card (total users, device donut, country bars).
     */
    getRealtimeOverview(): Promise<RealtimeOverview>;
}
//# sourceMappingURL=monthlyUsers.service.d.ts.map