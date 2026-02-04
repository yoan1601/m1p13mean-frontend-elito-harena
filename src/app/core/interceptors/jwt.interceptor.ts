import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

/**
 * HTTP Interceptor that attaches JWT token to outgoing API requests.
 * Handles 401 errors by logging out the user.
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Only attach token for API requests (not external URLs)
  const isApiRequest = req.url.startsWith(environment.apiBaseUrl);
  
  // Skip token for public auth endpoints
  const isPublicEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/register');

  // Clone request and add authorization header if token exists and it's an API request
  if (token && isApiRequest && !isPublicEndpoint) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized - token expired or invalid
      // Only logout if it's not a login/register request
      if (error.status === 401 && !isPublicEndpoint) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
