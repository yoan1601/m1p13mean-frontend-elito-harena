import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * HTTP Interceptor for global error handling.
 * Transforms HTTP errors into user-friendly messages.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = error.error.message;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Bad request';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please login again.';
            break;
          case 403:
            errorMessage = 'Access forbidden. Insufficient permissions.';
            break;
          case 404:
            errorMessage = 'Resource not found';
            break;
          case 422:
            errorMessage = error.error?.message || 'Validation error';
            break;
          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            break;
          default:
            errorMessage = error.error?.message || `Error: ${error.status}`;
        }
      }

      console.error('HTTP Error:', errorMessage, error);

      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        originalError: error,
      }));
    })
  );
};
