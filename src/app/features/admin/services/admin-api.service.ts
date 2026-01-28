import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { environment } from 'src/environments/environment';
import { PaginatedResponse, SearchParams, ProductStatus } from 'src/app/core/models';

// ============================================================================
// API Contract v1.4 Aligned Interfaces
// ============================================================================

/**
 * Category entity - GET /api/categories
 * Section 7 of API Contract
 */
export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

/**
 * Shop entity - GET /api/shops
 * Section 8 of API Contract
 */
export interface Shop {
  _id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

/**
 * Product entity - GET /api/products
 * Sections 9-10 of API Contract
 */
export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  shopId: string;
  isAvailable: ProductStatus; // 'DRAFT' | 'PUBLISHED' | 'INACTIVE'
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

/**
 * Product search parameters for ADMIN
 * Section 10 of API Contract
 */
export interface ProductSearchParams extends SearchParams {
  categoryId?: string;
  shopId?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: ProductStatus;
}

/**
 * Admin API Service
 * Handles all ADMIN role API calls.
 * Aligned with API Contract v1.4
 * 
 * Endpoints used by ADMIN role:
 * - GET /api/categories (Section 7)
 * - GET /api/shops (Section 8)
 * - GET /api/products (Section 10)
 */
@Injectable({
  providedIn: 'root',
})
export class AdminApiService extends ApiService {
  private readonly api = environment.api;

  // =========================================================================
  // Categories - GET /api/categories (Section 7)
  // =========================================================================

  /**
   * Get all categories
   * Endpoint: GET /api/categories
   * Access: All authenticated roles
   */
  getCategories(): Observable<Category[]> {
    return this.get<Category[]>(this.api.categories);
  }

  // =========================================================================
  // Shops - GET /api/shops (Section 8)
  // =========================================================================

  /**
   * Get all shops with pagination
   * Endpoint: GET /api/shops
   * Access: ADMIN, USER
   * Query params: page, limit, sortBy, order
   */
  getShops(params?: SearchParams): Observable<PaginatedResponse<Shop>> {
    return this.getList<Shop>(this.api.shops, params);
  }

  /**
   * Get a single shop by ID
   * Endpoint: GET /api/shops/:id
   */
  getShopById(id: string): Observable<Shop> {
    return this.get<Shop>(`${this.api.shops}/${id}`);
  }

  // =========================================================================
  // Products - GET /api/products (Section 10)
  // =========================================================================

  /**
   * Get all products with pagination and filtering
   * Endpoint: GET /api/products
   * Access: ADMIN, USER
   * Query params: page, limit, sortBy, order, categoryId, shopId, minPrice, maxPrice, isAvailable
   * Note: ADMIN can see all products regardless of status
   */
  getProducts(params?: ProductSearchParams): Observable<PaginatedResponse<Product>> {
    return this.getList<Product>(this.api.products.base, params);
  }

  /**
   * Get a single product by ID
   * Endpoint: GET /api/products/:id
   */
  getProductById(id: string): Observable<Product> {
    return this.get<Product>(`${this.api.products.base}/${id}`);
  }

  /**
   * Get products by shop
   * Convenience method
   */
  getProductsByShop(shopId: string, params?: SearchParams): Observable<PaginatedResponse<Product>> {
    return this.getProducts({ ...params, shopId });
  }

  /**
   * Get products by category
   * Convenience method
   */
  getProductsByCategory(categoryId: string, params?: SearchParams): Observable<PaginatedResponse<Product>> {
    return this.getProducts({ ...params, categoryId });
  }

  /**
   * Get products by status
   * Convenience method
   */
  getProductsByStatus(status: ProductStatus, params?: SearchParams): Observable<PaginatedResponse<Product>> {
    return this.getProducts({ ...params, isAvailable: status });
  }

  // =========================================================================
  // Dashboard Data (Aggregated for UI)
  // =========================================================================

  /**
   * Get admin dashboard statistics
   * This aggregates data for the dashboard view
   * TODO: Replace with actual aggregated API call when available
   */
  getDashboardStats(): Observable<{
    totalShops: number;
    totalProducts: number;
    totalCategories: number;
  }> {
    return of({
      totalShops: 0,
      totalProducts: 0,
      totalCategories: 0,
    }).pipe(delay(300));
  }
}

