import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models';

/**
 * Factory function to create a role guard for specific roles.
 * Usage in routes: canActivate: [roleGuard([UserRole.ADMIN, UserRole.SHOP])]
 * 
 * Aligned with API Contract Section 3: Rôles et autorisations
 * - ADMIN: Administrateur
 * - SHOP: Boutique (agent unique)
 * - USER: Acheteur
 */
export function roleGuard(allowedRoles: UserRole[]): CanActivateFn {
  return (route: ActivatedRouteSnapshot, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Check both authentication state and valid token
    const isAuthenticated = authService.isAuthenticated();
    const hasToken = !!authService.getToken();

    if (!isAuthenticated || !hasToken) {
      router.navigate(['/authentication/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    // Check if user has required role
    if (authService.hasAnyRole(allowedRoles)) {
      return true;
    }

    // User is authenticated but doesn't have required role
    // Redirect to their appropriate dashboard
    authService.navigateToRoleDashboard();
    return false;
  };
}

/**
 * Guard that only allows Admin role
 * Access level: ADMIN
 */
export const adminGuard: CanActivateFn = roleGuard([UserRole.ADMIN]);

/**
 * Guard that only allows Shop role
 * Access level: SHOP
 */
export const shopGuard: CanActivateFn = roleGuard([UserRole.SHOP]);

/**
 * Guard that only allows User (buyer) role
 * Access level: USER (formerly CUSTOMER)
 */
export const userGuard: CanActivateFn = roleGuard([UserRole.USER]);

/**
 * Guard that allows Admin and Shop roles
 * Access level: ADMIN, SHOP
 */
export const adminOrShopGuard: CanActivateFn = roleGuard([UserRole.ADMIN, UserRole.SHOP]);

/**
 * Guard that allows Admin and User roles
 * Access level: ADMIN, USER (e.g., for viewing shops/products)
 */
export const adminOrUserGuard: CanActivateFn = roleGuard([UserRole.ADMIN, UserRole.USER]);
