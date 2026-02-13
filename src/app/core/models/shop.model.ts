/**
 * Shop location - floor and zone in the mall
 */
export interface ShopLocation {
  floor: number;
  zone: string;
}

/**
 * Shop owner info (populated from User)
 */
export interface ShopOwner {
  _id: string;
  email: string;
  role: string;
}

/**
 * Shop entity - aligned with backend shop.model.js
 * Endpoint: /api/shops
 */
export interface Shop {
  _id: string;
  id?: string; // Virtual field
  name: string;
  description?: string;
  location: ShopLocation;
  ownerId: string;
  owner?: ShopOwner;
  categories: string[];
  isOpen: boolean;
  imagePath: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payload for creating a shop
 * POST /api/shops (FormData)
 */
export interface ShopCreatePayload {
  name: string;
  description?: string;
  location: ShopLocation;
  ownerId: string;
  categories?: string[];
  isOpen?: boolean;
  image?: File;
}

/**
 * Payload for updating a shop
 * PUT /api/shops/:id
 */
export interface ShopUpdatePayload {
  name?: string;
  description?: string;
  location?: ShopLocation;
  ownerId?: string;
  categories?: string[];
  isOpen?: boolean;
  image?: File;
}

/**
 * Shop filter parameters for paginated queries
 */
export interface ShopFilterParams {
  page?: number;
  limit?: number;
  isOpen?: boolean;
  floor?: number;
  zone?: string;
  category?: string;
  search?: string;
  ownerId?: string;
}

/**
 * API response wrapper for shop operations
 */
export interface ShopResponse {
  success: boolean;
  message?: string;
  data: Shop;
}

/**
 * API response for shop list with pagination
 */
export interface ShopListResponse {
  success: boolean;
  data: Shop[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
