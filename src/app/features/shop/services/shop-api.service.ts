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
 * Product entity - Sections 9-11 of API Contract
 * Used for SHOP role CRUD operations
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
 * Product create/update payload
 * POST /api/products, PUT /api/products/:id
 * Section 9 of API Contract
 */
export interface ProductPayload {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  isAvailable?: ProductStatus;
}

/**
 * Product status update payload
 * PATCH /api/products/:id/status
 * Section 11 of API Contract
 */
export interface ProductStatusPayload {
  isAvailable: ProductStatus;
}

/**
 * Shop API Service
 * Handles all SHOP role API calls.
 * Aligned with API Contract v1.4
 * 
 * Endpoints used by SHOP role:
 * - GET /api/categories (Section 7)
 * - GET /api/products/my (Section 9) - Shop's own products
 * - POST /api/products (Section 9) - Create product
 * - PUT /api/products/:id (Section 9) - Update product
 * - PATCH /api/products/:id/status (Section 11) - Update product status
 * - DELETE /api/products/:id (Section 9) - Soft delete product
 */
@Injectable({
  providedIn: 'root',
})
export class ShopApiService extends ApiService {
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
  // Products - SHOP CRUD Operations (Sections 9-11)
  // =========================================================================

  /**
   * Get shop's own products with pagination
   * Endpoint: GET /api/products/my
   * Access: SHOP only
   * Query params: page, limit, sortBy, order
   */
  getMyProducts(params?: SearchParams): Observable<PaginatedResponse<Product>> {
    return this.getList<Product>(this.api.products.my, params);
  }

  /**
   * Get a single product by ID
   * Endpoint: GET /api/products/:id
   */
  getProductById(id: string): Observable<Product> {
    return this.get<Product>(`${this.api.products.base}/${id}`);
  }

  /**
   * Create a new product
   * Endpoint: POST /api/products
   * Access: SHOP only
   * Note: shopId is automatically set from authenticated user
   */
  createProduct(product: ProductPayload): Observable<Product> {
    return this.post<Product>(this.api.products.base, product);
  }

  /**
   * Update an existing product
   * Endpoint: PUT /api/products/:id
   * Access: SHOP only (owner)
   */
  updateProduct(id: string, product: ProductPayload): Observable<Product> {
    return this.put<Product>(`${this.api.products.base}/${id}`, product);
  }

  /**
   * Update product status (DRAFT, PUBLISHED, INACTIVE)
   * Endpoint: PATCH /api/products/:id/status
   * Access: SHOP only (owner)
   * Section 11 of API Contract
   */
  updateProductStatus(id: string, status: ProductStatus): Observable<Product> {
    const payload: ProductStatusPayload = { isAvailable: status };
    return this.patch<Product>(`${this.api.products.status}`.replace(':id', id), payload);
  }

  /**
   * Soft delete a product
   * Endpoint: DELETE /api/products/:id
   * Access: SHOP only (owner)
   * Note: Sets deletedAt timestamp, does not physically delete
   */
  deleteProduct(id: string): Observable<void> {
    return this.delete<void>(`${this.api.products.base}/${id}`);
  }

  // =========================================================================
  // Convenience Methods
  // =========================================================================

  /**
   * Publish a product (set status to PUBLISHED)
   */
  publishProduct(id: string): Observable<Product> {
    return this.updateProductStatus(id, 'PUBLISHED');
  }

  /**
   * Unpublish a product (set status to DRAFT)
   */
  unpublishProduct(id: string): Observable<Product> {
    return this.updateProductStatus(id, 'DRAFT');
  }

  /**
   * Deactivate a product (set status to INACTIVE)
   */
  deactivateProduct(id: string): Observable<Product> {
    return this.updateProductStatus(id, 'INACTIVE');
  }

  // =========================================================================
  // Dashboard Data (Aggregated for UI)
  // =========================================================================

  /**
   * Get shop dashboard statistics
   * This aggregates data for the dashboard view
   * TODO: Replace with actual aggregated API call when available
   */
  getDashboardStats(): Observable<{
    productCount: number;
    publishedCount: number;
    draftCount: number;
  }> {
    return of({
      productCount: 0,
      publishedCount: 0,
      draftCount: 0,
    }).pipe(delay(300));
  }
}

