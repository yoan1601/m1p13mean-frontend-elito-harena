import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * HTTP Interceptor for global error handling.
 * Transforms HTTP errors into user-friendly messages in French.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Une erreur inattendue est survenue';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = error.error.message;
      } else {
        // Server-side error - use backend message if available
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else {
          switch (error.status) {
            case 400:
              errorMessage = 'Requête invalide';
              break;
            case 401:
              errorMessage = 'Non autorisé. Veuillez vous reconnecter.';
              break;
            case 403:
              errorMessage = 'Accès refusé. Permissions insuffisantes.';
              break;
            case 404:
              errorMessage = 'Ressource non trouvée';
              break;
            case 422:
              errorMessage = 'Erreur de validation';
              break;
            case 500:
              errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
              break;
            case 0:
              errorMessage = 'Impossible de se connecter au serveur';
              break;
            default:
              errorMessage = `Erreur: ${error.status}`;
          }
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
