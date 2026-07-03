import { MonthlyUserRow } from "../../Models/MonthlyUsers/monthlyUsers.model";
export declare class MonthlyUsersRepository {
    /**
     * Aggregates new user registrations per month for a given year.
     */
    getMonthlyRegistrations(year: number): Promise<MonthlyUserRow[]>;
    /**
     * Total active (non-deleted) user count.
     */
    getTotalActiveUsers(): Promise<number>;
    /**
     * Count of users registered in a specific month/year.
     */
    getUsersInMonth(year: number, month: number): Promise<number>;
    /**
     * Users grouped by device — uses $queryRaw to avoid Prisma groupBy
     * type issues with nullable fields (ts2345).
     * Primary source: User.device
     * Fallback: SiteAnalytic.deviceType (if User.device is all null)
     */
    getUsersByDevice(): Promise<Array<{
        deviceType: string;
        count: number;
    }>>;
    /**
     * Users grouped by country — $queryRaw to avoid nullable groupBy issues.
     */
    getUsersByCountry(limit?: number): Promise<Array<{
        country: string;
        count: number;
    }>>;
    /**
     * Total user count including deleted.
     */
    getTotalAllTimeUsers(): Promise<number>;
}
//# sourceMappingURL=monthlyUsers.repository.d.ts.map