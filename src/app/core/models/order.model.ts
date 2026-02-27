/**
 * Order Models - Aligned with backend order.model.js
 * Endpoint: /api/orders
 */

import { Shop } from './shop.model';
import { PaginationMeta } from './api.model';

/**
 * Order status enum - matches backend order statuses
 */
export enum OrderStatus {
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERED = 'DELIVERED'
}

/**
 * Order status labels in French
 */
export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.CONFIRMED]: 'Confirmée',
  [OrderStatus.PREPARING]: 'En préparation',
  [OrderStatus.READY]: 'Prête',
  [OrderStatus.DELIVERED]: 'Livrée'
};

/**
 * Order status colors for UI
 */
export const OrderStatusColors: Record<OrderStatus, string> = {
  [OrderStatus.CONFIRMED]: 'primary',
  [OrderStatus.PREPARING]: 'accent',
  [OrderStatus.READY]: 'warn',
  [OrderStatus.DELIVERED]: 'primary'
};

/**
 * Valid status transitions for SHOP
 */
export const ValidStatusTransitions: Record<OrderStatus, OrderStatus | null> = {
  [OrderStatus.CONFIRMED]: OrderStatus.PREPARING,
  [OrderStatus.PREPARING]: OrderStatus.READY,
  [OrderStatus.READY]: OrderStatus.DELIVERED,
  [OrderStatus.DELIVERED]: null
};

/**
 * Order item from order
 */
export interface OrderItem {
  productId: string;
  nameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
}

/**
 * Order entity - aligned with backend order.model.js
 */
export interface Order {
  _id: string;
  userId: string;
  shopId: string;
  shop?: Partial<Shop>;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Single order response
 */
export interface OrderResponse {
  success: boolean;
  data: Order;
  message?: string;
}

/**
 * Paginated orders response
 */
export interface OrderListResponse {
  success: boolean;
  data: Order[];
  pagination: PaginationMeta;
}

/**
 * Order filter parameters
 */
export interface OrderFilterParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

/**
 * Status update payload
 * PATCH /api/orders/:id/status
 */
export interface OrderStatusUpdatePayload {
  status: OrderStatus;
}
