import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ShopUser, ShopUsersResponse } from 'src/app/core/models';

/**
 * User Service
 * Handles user-related API calls
 * Access: ADMIN only for most operations
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = `${environment.apiBaseUrl}${environment.api.users}`;

  constructor(private http: HttpClient) {}

  /**
   * Get all users with SHOP role
   * GET /api/users/shops
   * Returns users enriched with their shop information
   */
  getShopUsers(): Observable<ShopUser[]> {
    return this.http.get<ShopUsersResponse>(`${this.baseUrl}/shops`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get shop users who don't have any shop assigned yet
   * Filters users where totalShops === 0
   */
  getAvailableShopOwners(): Observable<ShopUser[]> {
    return this.getShopUsers().pipe(
      map(users => users.filter(user => user.totalShops === 0))
    );
  }
}
