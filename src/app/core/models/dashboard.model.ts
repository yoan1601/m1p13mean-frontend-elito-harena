/**
 * Dashboard Models - Strongly typed interfaces for dashboard API responses
 * Aligned with backend dashboard.service.js
 */

// ============================================================================
// User (Customer) Dashboard Models
// Endpoint: GET /dashboard/customer
// ============================================================================

/**
 * User dashboard statistics from /dashboard/customer
 */
export interface UserDashboardStats {
  activeOrders: number;
  favoriteShops: number;
  viewedProducts: number;
}

/**
 * API response wrapper for user dashboard
 */
export interface UserDashboardResponse {
  success: boolean;
  data: UserDashboardStats;
  message?: string;
}

// ============================================================================
// Shop (Merchant) Dashboard Models
// Endpoint: GET /dashboard/merchant
// ============================================================================

/**
 * Stat value with change indicator
 */
export interface StatWithChange<T = number> {
  count?: T;
  total?: T;
  change: number | string;
}

/**
 * Shop dashboard statistics from /dashboard/merchant
 */
export interface ShopDashboardStats {
  dailyOrders: {
    count: number;
    change: number;
  };
  revenue: {
    total: number;
    change: string;
  };
  products: {
    total: number;
    change: number;
  };
  lowStock: {
    count: number;
    change: number;
  };
  recentOrders?: any[];
  quickActions?: any[];
}

/**
 * API response wrapper for shop dashboard
 */
export interface ShopDashboardResponse {
  success: boolean;
  data: ShopDashboardStats;
  message?: string;
}

// ============================================================================
// Admin Dashboard Models
// Endpoint: GET /dashboard/admin
// ============================================================================

/**
 * Admin stat card structure from backend
 */
export interface AdminStatItem {
  value: number;
  label: string;
  icon: string;
  color: string;
  format?: 'currency' | 'number';
  unit?: '%';
}

/**
 * Admin dashboard statistics from /dashboard/admin
 */
export interface AdminDashboardStats {
  totalShops: AdminStatItem;
  totalCustomers: AdminStatItem;
  monthlyRevenue: AdminStatItem;
  monthlyOrders: AdminStatItem;
  avgConversion: AdminStatItem;
  outOfStock: AdminStatItem;
  occupancyRate: AdminStatItem;
  newMerchants: AdminStatItem;
}

/**
 * API response wrapper for admin dashboard
 */
export interface AdminDashboardResponse {
  success: boolean;
  data: AdminDashboardStats;
  message?: string;
}

// ============================================================================
// Shared Dashboard Types
// ============================================================================

/**
 * Generic dashboard loading state
 */
export interface DashboardState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Stat card display configuration (frontend)
 */
export interface StatCard {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  color?: string;
}

/**
 * Quick stat display (user dashboard)
 */
export interface QuickStat {
  label: string;
  value: string | number;
  icon: string;
}
