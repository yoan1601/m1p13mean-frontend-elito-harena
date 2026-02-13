import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Shop,
  ShopCreatePayload,
  ShopUpdatePayload,
  ShopFilterParams,
  ShopResponse,
  ShopListResponse,
} from 'src/app/core/models';

/**
 * Shop Service
 * Handles CRUD operations for shops.
 * Access: ADMIN only for CUD, all authenticated users for R
 */
@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private readonly baseUrl = `${environment.apiBaseUrl}${environment.api.shops}`;

  constructor(private http: HttpClient) {}

  /**
   * Build query params from filter object
   */
  private buildParams(filters?: ShopFilterParams): HttpParams {
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
   * Get shops with pagination and filters
   * GET /api/shops
   */
  getAll(filters?: ShopFilterParams): Observable<ShopListResponse> {
    return this.http.get<ShopListResponse>(this.baseUrl, {
      params: this.buildParams(filters)
    });
  }

  /**
   * Get all shops without pagination
   * GET /api/shops/all
   */
  getAllNoPagination(): Observable<Shop[]> {
    return this.http.get<{ success: boolean; data: Shop[] }>(`${this.baseUrl}/all`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get shop by ID
   * GET /api/shops/:id
   */
  getById(id: string): Observable<Shop> {
    return this.http.get<ShopResponse>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Create a new shop
   * POST /api/shops (FormData)
   * Access: ADMIN only
   */
  create(payload: ShopCreatePayload): Observable<Shop> {
    const formData = this.buildFormData(payload);
    return this.http.post<ShopResponse>(this.baseUrl, formData).pipe(
      map(response => response.data)
    );
  }

  /**
   * Update an existing shop
   * PUT /api/shops/:id (FormData or JSON)
   * Access: ADMIN only
   */
  update(id: string, payload: ShopUpdatePayload): Observable<Shop> {
    // If there's an image, use FormData, otherwise use JSON
    if (payload.image) {
      const formData = this.buildFormData(payload);
      return this.http.put<ShopResponse>(`${this.baseUrl}/${id}`, formData).pipe(
        map(response => response.data)
      );
    }
    // Remove image field if not present
    const { image, ...jsonPayload } = payload;
    return this.http.put<ShopResponse>(`${this.baseUrl}/${id}`, jsonPayload).pipe(
      map(response => response.data)
    );
  }

  /**
   * Soft delete a shop
   * DELETE /api/shops/:id
   * Access: ADMIN only
   */
  delete(id: string): Observable<Shop> {
    return this.http.delete<ShopResponse>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Build FormData from payload
   */
  private buildFormData(payload: ShopCreatePayload | ShopUpdatePayload): FormData {
    const formData = new FormData();

    if (payload.name) {
      formData.append('name', payload.name);
    }
    if (payload.description) {
      formData.append('description', payload.description);
    }
    if (payload.location) {
      formData.append('location[floor]', payload.location.floor.toString());
      formData.append('location[zone]', payload.location.zone);
    }
    if ('ownerId' in payload && payload.ownerId) {
      formData.append('ownerId', payload.ownerId);
    }
    if (payload.categories && payload.categories.length > 0) {
      payload.categories.forEach(cat => {
        formData.append('categories[]', cat);
      });
    }
    if (payload.isOpen !== undefined) {
      formData.append('isOpen', payload.isOpen.toString());
    }
    if (payload.image) {
      formData.append('image', payload.image);
    }

    return formData;
  }
}
