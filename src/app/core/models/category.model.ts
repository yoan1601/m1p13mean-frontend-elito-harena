/**
 * Category entity - aligned with backend category.model.js
 * Endpoint: /api/category
 */
export interface Category {
  _id: string;
  code: string;
  label: string;
  icon?: string;
  isActive: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payload for creating a category
 * POST /api/category
 */
export interface CategoryCreatePayload {
  code: string;
  label: string;
  icon?: string;
  isActive?: boolean;
}

/**
 * Payload for updating a category
 * PUT /api/category/:id
 */
export interface CategoryUpdatePayload {
  code?: string;
  label?: string;
  icon?: string;
  isActive?: boolean;
}

/**
 * API response wrapper for category operations
 */
export interface CategoryResponse {
  success: boolean;
  message?: string;
  data: Category;
}

/**
 * API response for category list
 */
export interface CategoryListResponse {
  success: boolean;
  data: Category[];
}
