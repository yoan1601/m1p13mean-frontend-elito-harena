import { Shop } from './shop.model';

// Note: ProductStatus is imported from api.model.ts to avoid duplicate exports
import { ProductStatus } from './api.model';
export { ProductStatus };

/**
 * Currency types supported
 */
export type Currency = 'MGA' | 'USD' | 'EUR';

/**
 * Product entity - aligned with backend product.model.js
 * Endpoint: /api/product
 */
export interface Product {
  _id: string;
  id?: string; // Virtual field
  shopId: string;
  shop?: Partial<Shop>;
  name: string;
  description?: string;
  categories: string[];
  price: number;
  currency: Currency;
  stock: number;
  imagePaths: string[];
  status: ProductStatus;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payload for creating a product
 * POST /api/product (FormData)
 */
export interface ProductCreatePayload {
  shopId: string;
  name: string;
  description?: string;
  categories?: string[];
  price: number;
  currency?: Currency;
  stock?: number;
  status?: ProductStatus;
  images?: File[];
}

/**
 * Payload for updating a product
 * PUT /api/product/:id (FormData)
 */
export interface ProductUpdatePayload {
  name?: string;
  description?: string;
  categories?: string[];
  price?: number;
  currency?: Currency;
  stock?: number;
  status?: ProductStatus;
  images?: File[];
}

/**
 * Product filter parameters for paginated queries
 */
export interface ProductFilterParams {
  page?: number;
  limit?: number;
  shopId?: string;
  status?: ProductStatus;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  sortBy?: string;
}

/**
 * API response wrapper for product operations
 */
export interface ProductResponse {
  success: boolean;
  message?: string;
  data: Product;
}

/**
 * API response for product list with pagination
 */
export interface ProductListResponse {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
