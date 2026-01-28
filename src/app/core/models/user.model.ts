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
 * User model interface
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
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
 * Register request payload
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
}

/**
 * Authentication response from API
 */
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Token payload decoded from JWT
 */
export interface TokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
