import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  User,
  UserRole,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
  TokenPayload,
} from '../models';

/**
 * Authentication service handling login, logout, and token management.
 * Connected to backend API for real authentication.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = environment.jwt.tokenKey;
  private readonly USER_KEY = 'current_user';

  // Reactive state using signals
  private currentUserSignal = signal<User | null>(this.loadUserFromStorage());
  private isLoadingSignal = signal<boolean>(false);

  // Public computed signals
  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  readonly userRole = computed(() => this.currentUserSignal()?.role ?? null);
  readonly isLoading = computed(() => this.isLoadingSignal());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkTokenValidity();
  }

  /**
   * Authenticate user with credentials
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.isLoadingSignal.set(true);

    return this.http.post<LoginResponse>(
      `${environment.apiBaseUrl}${environment.api.auth.login}`,
      credentials
    ).pipe(
      tap((response) => {
        this.handleLoginResponse(response);
        this.isLoadingSignal.set(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.isLoadingSignal.set(false);
        return throwError(() => this.handleAuthError(error));
      })
    );
  }

  /**
   * Register new user
   */
  register(data: RegisterRequest): Observable<RegisterResponse> {
    this.isLoadingSignal.set(true);

    return this.http.post<RegisterResponse>(
      `${environment.apiBaseUrl}${environment.api.auth.register}`,
      data
    ).pipe(
      tap((response) => {
        if (response.success) {
          this.handleRegisterResponse(response);
        }
        this.isLoadingSignal.set(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.isLoadingSignal.set(false);
        return throwError(() => this.handleAuthError(error));
      })
    );
  }

  /**
   * Logout user and clear session
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSignal.set(null);
    this.router.navigate(['/authentication/login']);
  }

  /**
   * Get stored access token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: UserRole): boolean {
    return this.currentUserSignal()?.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const userRole = this.currentUserSignal()?.role;
    return userRole ? roles.includes(userRole) : false;
  }

  /**
   * Fetch current user profile from backend
   */
  fetchProfile(): Observable<{ success: boolean; data: User }> {
    return this.http.get<{ success: boolean; data: User }>(
      `${environment.apiBaseUrl}${environment.api.auth.profile}`
    ).pipe(
      tap((response) => {
        if (response.success && response.data) {
          const user = this.mapBackendUserToUser(response.data);
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
          this.currentUserSignal.set(user);
        }
      })
    );
  }

  /**
   * Get default route based on user role
   */
  getDefaultRouteForRole(role: UserRole): string {
    const routes: Record<UserRole, string> = {
      [UserRole.ADMIN]: '/admin/dashboard',
      [UserRole.SHOP]: '/shop/dashboard',
      [UserRole.USER]: '/user/dashboard',
    };
    return routes[role] || '/';
  }

  /**
   * Navigate to user's default dashboard
   */
  navigateToRoleDashboard(): void {
    const role = this.userRole();
    if (role) {
      this.router.navigate([this.getDefaultRouteForRole(role)]);
    } else {
      this.router.navigate(['/authentication/login']);
    }
  }

  // Private methods

  /**
   * Handle login response from backend
   */
  private handleLoginResponse(response: LoginResponse): void {
    // Store token
    localStorage.setItem(this.TOKEN_KEY, response.token);

    // Decode JWT to get user info
    const decoded = this.decodeToken(response.token);
    
    // Create user object from response and decoded token
    const user: User = {
      id: response.user.id,
      email: decoded?.email || '',
      role: response.user.role as UserRole,
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  /**
   * Handle register response from backend
   */
  private handleRegisterResponse(response: RegisterResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.data.token);
    
    const user = this.mapBackendUserToUser(response.data.user);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  /**
   * Map backend user object to frontend User interface
   */
  private mapBackendUserToUser(backendUser: any): User {
    return {
      id: backendUser._id || backendUser.id,
      email: backendUser.email,
      role: backendUser.role as UserRole,
      profile: backendUser.profile,
      shopId: backendUser.shopId,
      isActive: backendUser.isActive,
      createdAt: backendUser.createdAt ? new Date(backendUser.createdAt) : undefined,
      updatedAt: backendUser.updatedAt ? new Date(backendUser.updatedAt) : undefined,
    };
  }

  /**
   * Decode JWT token to extract payload
   */
  private decodeToken(token: string): TokenPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload) as TokenPayload;
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    // exp is in seconds, Date.now() is in milliseconds
    return decoded.exp * 1000 < Date.now();
  }

  private loadUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson) as User;
      } catch {
        return null;
      }
    }
    return null;
  }

  private checkTokenValidity(): void {
    const token = this.getToken();
    if (!token) {
      this.currentUserSignal.set(null);
      return;
    }

    // Check token expiry
    if (this.isTokenExpired(token)) {
      this.logout();
      return;
    }

    const user = this.loadUserFromStorage();
    if (!user) {
      this.logout();
    }
  }

  /**
   * Handle authentication errors
   */
  private handleAuthError(error: HttpErrorResponse): { status: number; message: string } {
    let message = 'Une erreur est survenue';

    if (error.error?.message) {
      message = error.error.message;
    } else if (error.status === 401) {
      message = 'Email ou mot de passe incorrect';
    } else if (error.status === 400) {
      message = error.error?.message || 'Données invalides';
    } else if (error.status === 0) {
      message = 'Impossible de se connecter au serveur';
    }

    return { status: error.status, message };
  }
}
