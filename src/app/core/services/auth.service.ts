import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  User,
  UserRole,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  TokenPayload,
} from '../models';

/**
 * Authentication service handling login, logout, and token management.
 * Currently uses mocked data - ready for backend integration.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = environment.jwt.tokenKey;
  private readonly REFRESH_TOKEN_KEY = environment.jwt.refreshTokenKey;
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
   * TODO: Replace mock with actual API call
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);

    // MOCK: Simulate API response - Replace with actual HTTP call
    // return this.http.post<AuthResponse>(`${environment.apiBaseUrl}${environment.api.auth.login}`, credentials)
    
    const mockResponse = this.getMockAuthResponse(credentials.email);
    
    return of(mockResponse).pipe(
      delay(800), // Simulate network delay
      tap((response) => {
        this.handleAuthResponse(response);
        this.isLoadingSignal.set(false);
      })
    );
  }

  /**
   * Register new user
   * TODO: Replace mock with actual API call
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);

    // MOCK: Simulate API response - Replace with actual HTTP call
    // return this.http.post<AuthResponse>(`${environment.apiBaseUrl}${environment.api.auth.register}`, data)
    
    const mockResponse = this.getMockAuthResponse(data.email, data.role, data.firstName, data.lastName);
    
    return of(mockResponse).pipe(
      delay(800),
      tap((response) => {
        this.handleAuthResponse(response);
        this.isLoadingSignal.set(false);
      })
    );
  }

  /**
   * Logout user and clear session
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
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
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
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
   * Refresh authentication token
   * TODO: Replace mock with actual API call
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    
    // MOCK: Return current auth state - Replace with actual HTTP call
    // return this.http.post<AuthResponse>(`${environment.apiBaseUrl}${environment.api.auth.refresh}`, { refreshToken })
    
    const user = this.currentUserSignal();
    if (!user || !refreshToken) {
      this.logout();
      throw new Error('No refresh token available');
    }

    const mockResponse = this.getMockAuthResponse(user.email, user.role, user.firstName, user.lastName);
    return of(mockResponse).pipe(
      delay(300),
      tap((response) => this.handleAuthResponse(response))
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

  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    this.currentUserSignal.set(response.user);
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

    // Basic token expiry check (for mock purposes)
    // In production, decode JWT and check exp claim
    const user = this.loadUserFromStorage();
    if (!user) {
      this.logout();
    }
  }

  /**
   * MOCK: Generate fake auth response for development
   * Remove this method when backend is ready
   */
  private getMockAuthResponse(
    email: string,
    role?: UserRole,
    firstName?: string,
    lastName?: string
  ): AuthResponse {
    // Determine role based on email pattern for mock
    let determinedRole = role;
    if (!determinedRole) {
      if (email.includes('admin')) {
        determinedRole = UserRole.ADMIN;
      } else if (email.includes('shop')) {
        determinedRole = UserRole.SHOP;
      } else {
        determinedRole = UserRole.USER;
      }
    }

    const mockUser: User = {
      id: 'mock-user-' + Math.random().toString(36).substr(2, 9),
      email,
      firstName: firstName || 'John',
      lastName: lastName || 'Doe',
      role: determinedRole,
      createdAt: new Date(),
    };

    return {
      user: mockUser,
      accessToken: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      expiresIn: 3600,
    };
  }
}
