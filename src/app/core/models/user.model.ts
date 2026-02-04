/**
 * User roles enumeration for the shopping mall system
 * Aligned with API contract: ADMIN, SHOP, USER
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  SHOP = 'SHOP',
  USER = 'USER',  // Buyer/Customer role per API contract
}

/**
 * User profile from backend
 */
export interface UserProfile {
  name?: string;
  phone?: string;
}

/**
 * User model interface - aligned with backend user.model.js
 */
export interface User {
  id: string;
  email: string;
  role: UserRole;
  profile?: UserProfile;
  shopId?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Register request payload - aligned with backend
 */
export interface RegisterRequest {
  email: string;
  password: string;
  role?: UserRole;
  profile?: {
    name?: string;
    phone?: string;
  };
}

/**
 * Backend login response structure
 */
export interface LoginResponse {
  user: {
    id: string;
    role: UserRole;
  };
  token: string;
}

/**
 * Backend register response structure
 */
export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

/**
 * Token payload decoded from JWT - aligned with backend jwt.js
 */
export interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
