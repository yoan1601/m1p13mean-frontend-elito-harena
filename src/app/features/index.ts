/**
 * Features Module Barrel Export
 * Aligned with API Contract v1.4 - Roles: ADMIN, SHOP, USER
 * 
 * Note: Models are exported from services directly to avoid conflicts.
 * Import services directly from feature paths for full type access.
 */

// Admin feature exports (routes and nav only)
export { AdminRoutes } from './admin/admin.routes';
export { adminNavItems } from './admin/admin-nav';
export { AdminApiService } from './admin/services/admin-api.service';

// Shop feature exports (routes and nav only)
export { ShopRoutes } from './shop/shop.routes';
export { shopNavItems } from './shop/shop-nav';
export { ShopApiService } from './shop/services/shop-api.service';

// User feature exports (routes and nav only)
export { UserRoutes } from './user/user.routes';
export { userNavItems } from './user/user-nav';
export { UserApiService } from './user/services/user-api.service';
