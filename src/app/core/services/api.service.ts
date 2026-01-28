import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse, SearchParams } from '../models';

/**
 * Base API service providing common HTTP operations.
 * Aligned with API Contract v1.4 conventions.
 * Extend this service for feature-specific API services.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  protected readonly baseUrl = environment.apiBaseUrl;

  constructor(protected http: HttpClient) {}

  /**
   * Build HTTP params from search parameters
   * Aligned with API Contract Section 6: Pagination, tri et limitation
   * Query params: page, limit, sortBy, order
   */
  protected buildParams(params?: SearchParams): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      // Pagination params per API contract
      if (params.page !== undefined) {
        httpParams = httpParams.set('page', params.page.toString());
      }
      // API uses 'limit' not 'pageSize'
      if (params.limit !== undefined) {
        httpParams = httpParams.set('limit', params.limit.toString());
      }
      if (params.sortBy) {
        httpParams = httpParams.set('sortBy', params.sortBy);
      }
      // API uses 'order' not 'sortOrder'
      if (params.order) {
        httpParams = httpParams.set('order', params.order);
      }
      // Generic query param (if supported)
      if (params.query) {
        httpParams = httpParams.set('query', params.query);
      }
      // Additional filters (e.g., categories=SPORT,OUTDOOR)
      if (params.filters) {
        Object.keys(params.filters).forEach((key) => {
          const value = params.filters![key];
          if (value !== undefined && value !== null) {
            // Handle array filters (e.g., categories)
            if (Array.isArray(value)) {
              httpParams = httpParams.set(key, value.join(','));
            } else {
              httpParams = httpParams.set(key, value.toString());
            }
          }
        });
      }
    }

    return httpParams;
  }

  /**
   * GET request
   */
  protected get<T>(endpoint: string, params?: SearchParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, {
      params: this.buildParams(params),
    });
  }

  /**
   * POST request
   */
  protected post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body);
  }

  /**
   * PUT request
   */
  protected put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body);
  }

  /**
   * PATCH request
   */
  protected patch<T>(endpoint: string, body: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, body);
  }

  /**
   * DELETE request
   */
  protected delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }

  /**
   * GET paginated list
   */
  protected getList<T>(
    endpoint: string,
    params?: SearchParams
  ): Observable<PaginatedResponse<T>> {
    return this.http.get<PaginatedResponse<T>>(`${this.baseUrl}${endpoint}`, {
      params: this.buildParams(params),
    });
  }

  /**
   * GET single item by ID
   */
  protected getById<T>(endpoint: string, id: string): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${endpoint}/${id}`);
  }

  /**
   * CREATE new item
   */
  protected create<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body);
  }

  /**
   * UPDATE existing item
   */
  protected update<T>(
    endpoint: string,
    id: string,
    body: any
  ): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${endpoint}/${id}`, body);
  }

  /**
   * DELETE item by ID
   */
  protected deleteById<T>(endpoint: string, id: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${endpoint}/${id}`);
  }
}
