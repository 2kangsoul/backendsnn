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
 * Device breakdown (sourced from User.device field and SiteAnalytic.deviceType)
 */
export interface UsersByDevice {
  deviceType: string;   // e.g. "Desktop", "Phone app", "Laptop"
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
  lastUpdated: string;  // ISO timestamp
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
