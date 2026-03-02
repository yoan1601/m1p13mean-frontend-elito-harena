/**
 * Cart Models - Aligned with backend carts.model.js
 * Endpoint: /api/carts
 */

import { Product } from './product.model';

/**
 * Cart item as returned by the backend
 */
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  subtotal: number;
}

/**
 * Shop group in cart (items grouped by shop)
 */
export interface CartShop {
  shopId: string;
  shopName: string;
  items: CartItem[];
  shopTotal: number;
}

/**
 * Cart response from GET /api/carts
 */
export interface Cart {
  shops: CartShop[];
  total: number;
}

/**
 * Payload for adding item to cart
 * POST /api/carts/items
 */
export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

/**
 * Payload for updating cart item quantity
 * PATCH /api/carts/items/:productId
 */
export interface UpdateQuantityPayload {
  quantity: number;
}

/**
 * Response wrapper for cart operations
 */
export interface CartResponse {
  shops: CartShop[];
  total: number;
}

/**
 * Order confirmation result
 * POST /api/carts/orders/confirm
 */
export interface OrderConfirmationResult {
  success: boolean;
  orders: any[];
  errors?: string[];
  message?: string;
}
