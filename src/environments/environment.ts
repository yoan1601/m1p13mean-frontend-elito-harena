/**
 * Development environment configuration
 * Aligned with API Contract v1.4
 */
export const environment = {
  production: false,
  apiBaseUrl: 'https://m1p13mean-backend-elito-harena-production.up.railway.app/api',

  /**
   * API endpoints configuration
   * @see API Contract - Sections 7-11 for endpoint definitions
   */
  api: {
    // Authentication endpoints (assumed, not in contract)
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      profile: '/auth/profile',
    },

    // Categories endpoint - Section 7
    // GET /api/categories - Access: ADMIN, SHOP, USER
    categories: '/categories',

    // Shops endpoint - Section 8
    // GET /api/shops - Access: ADMIN, USER (paginated)
    shops: '/shops',

    // Products endpoints - Sections 9-11
    products: {
      base: '/products',           // GET (USER, ADMIN), POST (SHOP)
      my: '/products/my',          // GET /api/products/my - SHOP's own products
      status: '/products',         // PATCH /products/:id/status - SHOP
    },
  },

  // JWT configuration
  jwt: {
    tokenKey: 'access_token',
    refreshTokenKey: 'refresh_token',
    tokenExpiryKey: 'token_expiry',
  },

  // Default pagination settings per API contract
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
  },
};
