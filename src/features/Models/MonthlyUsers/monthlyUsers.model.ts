// =========================================================================
// Monthly Users - Models / Types / Interfaces
// Mirrors the Prisma schema: User, SiteAnalytic
// =========================================================================

/**
 * Raw monthly aggregation row returned from the repository
 */

export interface MonthlyUserRow {
  month: number;        // 1–12
  year: number;
  totalUsers: number;   // new registrations in that month
}

/**
 * Formatted monthly chart data for the frontend
 */
export interface MonthlyUserData {
  month: string;        // e.g. "Jan", "Feb", ...
  year: number;
  totalUsers: number;
}

/**
 * Summary card — top-level KPIs
 */
export interface MonthlyUsersSummary {
  totalUsers: number;           // all-time registered users
  newUsersThisMonth: number;    // registrations in current month
  newUsersLastMonth: number;    // registrations in previous month
  growthPercentage: number;     // % change MoM (positive = growth)
  activeUsers: number;          // non-deleted users
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
 * Prisma-shaped User select for country grouping
 */
export interface UserCountry {
  country: string | null;
}
