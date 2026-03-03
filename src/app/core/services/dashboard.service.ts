import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  UserDashboardResponse,
  ShopDashboardResponse,
  AdminDashboardResponse,
} from '../models';

/**
 * Dashboard Service
 * Handles API calls for role-specific dashboard data.
 * 
 * Endpoints:
 * - GET /dashboard/customer - User dashboard stats
 * - GET /dashboard/merchant - Shop dashboard stats
 * - GET /dashboard/admin - Admin dashboard stats (role protected)
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly dashboardEndpoint = environment.api.dashboard;

  constructor(private http: HttpClient) {}

  /**
   * Get user (customer) dashboard statistics
   * Endpoint: GET /dashboard/customer
   * Access: USER role
   * 
   * @returns Observable<UserDashboardResponse>
   */
  getUserDashboard(): Observable<UserDashboardResponse> {
    return this.http
      .get<UserDashboardResponse>(`${this.baseUrl}${this.dashboardEndpoint}/customer`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get shop (merchant) dashboard statistics
   * Endpoint: GET /dashboard/merchant
   * Access: SHOP role
   * 
   * @returns Observable<ShopDashboardResponse>
   */
  getShopDashboard(): Observable<ShopDashboardResponse> {
    return this.http
      .get<ShopDashboardResponse>(`${this.baseUrl}${this.dashboardEndpoint}/merchant`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get admin dashboard statistics
   * Endpoint: GET /dashboard/admin
   * Access: ADMIN role only
   * 
   * @returns Observable<AdminDashboardResponse>
   */
  getAdminDashboard(): Observable<AdminDashboardResponse> {
    return this.http
      .get<AdminDashboardResponse>(`${this.baseUrl}${this.dashboardEndpoint}/admin`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Handle HTTP errors consistently
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.status === 401) {
      errorMessage = 'Session expirée. Veuillez vous reconnecter.';
    } else if (error.status === 403) {
      errorMessage = 'Accès non autorisé à cette ressource.';
    } else if (error.status === 500) {
      errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      originalError: error,
    }));
  }
}
