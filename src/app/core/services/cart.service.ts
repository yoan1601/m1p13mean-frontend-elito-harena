import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Cart,
  CartResponse,
  AddToCartPayload,
  UpdateQuantityPayload,
  OrderConfirmationResult
} from 'src/app/core/models';

/**
 * Cart Service
 * Handles cart operations for USER role.
 * Endpoints: /api/carts
 */
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly baseUrl = `${environment.apiBaseUrl}${environment.api.cart}`;

  // Cart state management
  private cartSubject = new BehaviorSubject<Cart>({ shops: [], total: 0 });
  public cart$ = this.cartSubject.asObservable();

  // Cart item count for badge display
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get current cart
   * GET /api/carts
   */
  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.baseUrl).pipe(
      tap(cart => {
        this.cartSubject.next(cart);
        this.updateCartCount(cart);
      }),
      catchError(error => {
        console.error('Error fetching cart:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Add item to cart
   * POST /api/carts/items
   */
  addItem(payload: AddToCartPayload): Observable<CartResponse> {
    return this.http.post<CartResponse>(`${this.baseUrl}/items`, payload).pipe(
      tap(cart => {
        this.cartSubject.next(cart);
        this.updateCartCount(cart);
      }),
      catchError(error => {
        console.error('Error adding item to cart:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update item quantity
   * PATCH /api/carts/items/:productId
   */
  updateQuantity(productId: string, quantity: number): Observable<CartResponse> {
    const payload: UpdateQuantityPayload = { quantity };
    return this.http.patch<CartResponse>(`${this.baseUrl}/items/${productId}`, payload).pipe(
      tap(cart => {
        this.cartSubject.next(cart);
        this.updateCartCount(cart);
      }),
      catchError(error => {
        console.error('Error updating quantity:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Remove item from cart
   * DELETE /api/carts/items/:productId
   */
  removeItem(productId: string): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.baseUrl}/items/${productId}`).pipe(
      tap(cart => {
        this.cartSubject.next(cart);
        this.updateCartCount(cart);
      }),
      catchError(error => {
        console.error('Error removing item:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Clear entire cart
   * DELETE /api/carts
   */
  clearCart(): Observable<CartResponse> {
    return this.http.delete<CartResponse>(this.baseUrl).pipe(
      tap(cart => {
        this.cartSubject.next(cart);
        this.updateCartCount(cart);
      }),
      catchError(error => {
        console.error('Error clearing cart:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Confirm order (convert cart to orders)
   * POST /api/carts/orders/confirm
   */
  confirmOrder(): Observable<OrderConfirmationResult> {
    return this.http.post<OrderConfirmationResult>(`${this.baseUrl}/orders/confirm`, {}).pipe(
      tap(() => {
        // Reset cart after successful order
        this.cartSubject.next({ shops: [], total: 0 });
        this.cartCountSubject.next(0);
      }),
      catchError(error => {
        console.error('Error confirming order:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get current cart value (snapshot)
   */
  getCurrentCart(): Cart {
    return this.cartSubject.getValue();
  }

  /**
   * Check if cart is empty
   */
  isCartEmpty(): boolean {
    const cart = this.getCurrentCart();
    return !cart.shops || cart.shops.length === 0;
  }

  /**
   * Update cart item count for badge
   */
  private updateCartCount(cart: Cart): void {
    const count = cart.shops?.reduce((total, shop) => 
      total + shop.items.reduce((shopTotal, item) => shopTotal + item.quantity, 0), 0
    ) || 0;
    this.cartCountSubject.next(count);
  }

  /**
   * Reset cart state (for logout)
   */
  resetCart(): void {
    this.cartSubject.next({ shops: [], total: 0 });
    this.cartCountSubject.next(0);
  }
}
