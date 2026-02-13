import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Product,
  ProductCreatePayload,
  ProductUpdatePayload,
  ProductFilterParams,
  ProductResponse,
  ProductListResponse,
} from 'src/app/core/models';

/**
 * Product Service
 * Handles CRUD operations for products.
 * Access: SHOP only for CUD, all authenticated users for R
 */
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl = `${environment.apiBaseUrl}${environment.api.product}`;

  constructor(private http: HttpClient) {}

  /**
   * Build query params from filter object
   */
  private buildParams(filters?: ProductFilterParams): HttpParams {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }
    return params;
  }

  /**
   * Get products with pagination and filters
   * GET /api/product
   */
  getAll(filters?: ProductFilterParams): Observable<ProductListResponse> {
    return this.http.get<ProductListResponse>(this.baseUrl, {
      params: this.buildParams(filters)
    });
  }

  /**
   * Get product by ID
   * GET /api/product/:id
   */
  getById(id: string): Observable<Product> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Create a new product
   * POST /api/product (FormData)
   * Access: SHOP only
   */
  create(payload: ProductCreatePayload): Observable<Product> {
    const formData = this.buildFormData(payload);
    return this.http.post<ProductResponse>(this.baseUrl, formData).pipe(
      map(response => response.data)
    );
  }

  /**
   * Update an existing product
   * PUT /api/product/:id (FormData)
   * Access: SHOP only (owner)
   */
  update(id: string, payload: ProductUpdatePayload): Observable<Product> {
    const formData = this.buildFormData(payload);
    return this.http.put<ProductResponse>(`${this.baseUrl}/${id}`, formData).pipe(
      map(response => response.data)
    );
  }

  /**
   * Soft delete a product
   * DELETE /api/product/:id
   * Access: SHOP only (owner)
   */
  delete(id: string): Observable<Product> {
    return this.http.delete<ProductResponse>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Build FormData from payload
   */
  private buildFormData(payload: ProductCreatePayload | ProductUpdatePayload): FormData {
    const formData = new FormData();

    if ('shopId' in payload && payload.shopId) {
      formData.append('shopId', payload.shopId);
    }
    if (payload.name) {
      formData.append('name', payload.name);
    }
    if (payload.description) {
      formData.append('description', payload.description);
    }
    if (payload.price !== undefined) {
      formData.append('price', payload.price.toString());
    }
    if (payload.currency) {
      formData.append('currency', payload.currency);
    }
    if (payload.stock !== undefined) {
      formData.append('stock', payload.stock.toString());
    }
    if (payload.status) {
      formData.append('status', payload.status);
    }
    if (payload.categories && payload.categories.length > 0) {
      payload.categories.forEach(cat => {
        formData.append('categories', cat);
      });
    }
    if (payload.images && payload.images.length > 0) {
      payload.images.forEach(file => {
        formData.append('images', file);
      });
    }

    return formData;
  }
}
