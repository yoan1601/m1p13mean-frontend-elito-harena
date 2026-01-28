import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard that prevents access to routes when user is not authenticated.
 * Redirects to login page if user is not logged in.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Store the attempted URL for redirecting after login
  router.navigate(['/authentication/login'], {
    queryParams: { returnUrl: state.url },
  });
  return false;
};

/**
 * Guard that prevents authenticated users from accessing auth pages (login, register).
 * Redirects to their role-specific dashboard.
 */
export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // Redirect authenticated user to their dashboard
  authService.navigateToRoleDashboard();
  return false;
};
