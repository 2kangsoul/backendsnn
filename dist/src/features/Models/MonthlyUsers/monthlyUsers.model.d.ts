/**
 * Raw monthly aggregation row returned from the repository
 */
export interface MonthlyUserRow {
    month: number;
    year: number;
    totalUsers: number;
}
/**
 * Formatted monthly chart data for the frontend
 */
export interface MonthlyUserData {
    month: string;
    year: number;
    totalUsers: number;
}
/**
 * Summary card — top-level KPIs
 */
export interface MonthlyUsersSummary {
    totalUsers: number;
    newUsersThisMonth: number;
    newUsersLastMonth: number;
    growthPercentage: number;
    activeUsers: number;
}
/**
 * Device breakdown (sourced from User.device field and SiteAnalytic.deviceType)
 */
export interface UsersByDevice {
    deviceType: string;
    count: number;
    percentage: number;
}
/**
 * Country breakdown (sourced from User.country field)
 */
export interface UsersByCountry {
    country: string;
    count: number;
    percentage: number;
}
/**
 * Full realtime overview payload (matches the dashboard "Reports overview" card)
 */
export interface RealtimeOverview {
    totalUsers: number;
    byDevice: UsersByDevice[];
    byCountry: UsersByCountry[];
    lastUpdated: string;
}
/**
 * Prisma-shaped User select for monthly aggregation
 */
export interface UserCreatedAt {
    createdAt: Date;
}
/**
 * Prisma-shaped User select for device grouping
 */
export interface UserDevice {
    device: string | null;
}
/**
 * Prisma-shaped User select for country grouping
 */
export interface UserCountry {
    country: string | null;
}
//# sourceMappingURL=monthlyUsers.model.d.ts.map