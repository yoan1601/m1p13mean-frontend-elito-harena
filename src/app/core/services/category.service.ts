import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Category,
  CategoryCreatePayload,
  CategoryUpdatePayload,
  CategoryResponse,
  CategoryListResponse,
} from 'src/app/core/models';

/**
 * Category Service
 * Handles CRUD operations for categories.
 * Access: ADMIN only for CUD, all authenticated users for R
 */
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly baseUrl = `${environment.apiBaseUrl}${environment.api.category}`;

  constructor(private http: HttpClient) {}

  /**
   * Get all categories
   * GET /api/category
   */
  getAll(): Observable<Category[]> {
    return this.http.get<CategoryListResponse>(this.baseUrl).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get category by ID
   * GET /api/category/:id
   */
  getById(id: string): Observable<Category> {
    return this.http.get<CategoryResponse>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Create a new category
   * POST /api/category
   * Access: ADMIN only
   */
  create(payload: CategoryCreatePayload): Observable<Category> {
    return this.http.post<CategoryResponse>(this.baseUrl, payload).pipe(
      map(response => response.data)
    );
  }

  /**
   * Update an existing category
   * PUT /api/category/:id
   * Access: ADMIN only
   */
  update(id: string, payload: CategoryUpdatePayload): Observable<Category> {
    return this.http.put<CategoryResponse>(`${this.baseUrl}/${id}`, payload).pipe(
      map(response => response.data)
    );
  }

  /**
   * Soft delete a category
   * DELETE /api/category/:id
   * Access: ADMIN only
   */
  delete(id: string): Observable<Category> {
    return this.http.delete<CategoryResponse>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }
}
