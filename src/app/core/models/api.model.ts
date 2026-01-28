/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

/**
 * Pagination metadata - Aligned with API contract format
 * @see API Contract Section 6: Pagination, tri et limitation
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Paginated response wrapper - Aligned with API contract format
 * Response format: { data: [...], pagination: { page, limit, totalItems, totalPages } }
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * Pagination request parameters - Aligned with API contract query params
 * @param page - Page number (default = 1)
 * @param limit - Number of items per page (default = 10)
 * @param sortBy - Field to sort by
 * @param order - Sort order: 'asc' or 'desc'
 */
export interface PaginationParams {
  page?: number;
  limit?: number;        // API uses 'limit' not 'pageSize'
  sortBy?: string;
  order?: 'asc' | 'desc'; // API uses 'order' not 'sortOrder'
}

/**
 * Generic search/filter parameters extending pagination
 */
export interface SearchParams extends PaginationParams {
  query?: string;
  filters?: Record<string, any>;
}

/**
 * Product availability status - Aligned with API contract
 * @see API Contract Section 4.1: États métier (produits)
 */
export type ProductStatus = 'DRAFT' | 'PUBLISHED' | 'INACTIVE';

/**
 * Status update payload for PATCH /api/products/:id/status
 */
export interface ProductStatusUpdate {
  isAvailable: ProductStatus;
}
