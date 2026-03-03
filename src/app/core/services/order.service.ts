import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Order,
  OrderResponse,
  OrderListResponse,
  OrderFilterParams,
  OrderStatusUpdatePayload,
  OrderStatus
} from 'src/app/core/models';

/**
 * Order Service
 * Handles order operations for USER and SHOP roles.
 * Endpoints: /api/orders
 */
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly baseUrl = `${environment.apiBaseUrl}${environment.api.orders}`;
  private readonly shopsUrl = `${environment.apiBaseUrl}${environment.api.shops}`;

  constructor(private http: HttpClient) {}

  /**
   * Build query params from filter object
   */
  private buildParams(filters?: OrderFilterParams): HttpParams {
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
   * Get user orders (for USER role)
   * GET /api/orders
   */
  getUserOrders(filters?: OrderFilterParams): Observable<OrderListResponse> {
    return this.http.get<OrderListResponse>(this.baseUrl, {
      params: this.buildParams(filters)
    }).pipe(
      catchError(error => {
        console.error('Error fetching user orders:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get shop orders (for SHOP role)
   * GET /api/v2/shops/orders (backend filters by shopId from token)
   */
  getShopOrders(filters?: OrderFilterParams): Observable<OrderListResponse> {
    return this.http.get<OrderListResponse>(`${this.shopsUrl}/orders`, {
      params: this.buildParams(filters)
    }).pipe(
      catchError(error => {
        console.error('Error fetching shop orders:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get order by ID
   * GET /api/orders/:id
   */
  getById(id: string): Observable<Order> {
    return this.http.get<OrderResponse>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching order:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update order status (for SHOP role)
   * PATCH /api/orders/:id/status
   * Valid transitions: CONFIRMED → PREPARING → READY → DELIVERED
   */
  updateStatus(orderId: string, status: OrderStatus): Observable<OrderResponse> {
    const payload: OrderStatusUpdatePayload = { status };
    return this.http.patch<OrderResponse>(`${this.baseUrl}/${orderId}/status`, payload).pipe(
      catchError(error => {
        console.error('Error updating order status:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Soft delete order (for ADMIN role)
   * DELETE /api/orders/:id
   */
  softDelete(orderId: string): Observable<OrderResponse> {
    return this.http.delete<OrderResponse>(`${this.baseUrl}/${orderId}`).pipe(
      catchError(error => {
        console.error('Error deleting order:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Restore soft-deleted order (for ADMIN role)
   * POST /api/orders/:id/restore
   */
  restore(orderId: string): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.baseUrl}/${orderId}/restore`, {}).pipe(
      catchError(error => {
        console.error('Error restoring order:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get next valid status for an order
   * Used for SHOP status updates
   */
  getNextStatus(currentStatus: OrderStatus): OrderStatus | null {
    const transitions: Record<OrderStatus, OrderStatus | null> = {
      [OrderStatus.CONFIRMED]: OrderStatus.PREPARING,
      [OrderStatus.PREPARING]: OrderStatus.READY,
      [OrderStatus.READY]: OrderStatus.DELIVERED,
      [OrderStatus.DELIVERED]: null
    };
    return transitions[currentStatus];
  }

  /**
   * Check if status can be updated
   */
  canUpdateStatus(currentStatus: OrderStatus): boolean {
    return currentStatus !== OrderStatus.DELIVERED;
  }

  /**
   * Get status label in French
   */
  getStatusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
      [OrderStatus.CONFIRMED]: 'Confirmée',
      [OrderStatus.PREPARING]: 'En préparation',
      [OrderStatus.READY]: 'Prête',
      [OrderStatus.DELIVERED]: 'Livrée'
    };
    return labels[status] || status;
  }

  /**
   * Get status color class
   */
  getStatusColor(status: OrderStatus): string {
    const colors: Record<OrderStatus, string> = {
      [OrderStatus.CONFIRMED]: 'status-confirmed',
      [OrderStatus.PREPARING]: 'status-preparing',
      [OrderStatus.READY]: 'status-ready',
      [OrderStatus.DELIVERED]: 'status-delivered'
    };
    return colors[status] || '';
  }
}
