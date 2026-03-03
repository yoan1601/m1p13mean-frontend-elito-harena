import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { DashboardService, AuthService, CategoryService } from '../../../core/services';
import { UserDashboardStats, QuickStat, Category } from '../../../core/models';

/**
 * User Dashboard Component
 * Displays personalized shopping experience for buyers (USER role).
 * Fetches data from GET /dashboard/customer endpoint.
 */
@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MaterialModule, TablerIconsModule],
  templateUrl: './user-dashboard.component.html',
})
export class UserDashboardComponent implements OnInit {
  // State management
  loading = true;
  error: string | null = null;
  categoriesLoading = true;
  
  // User info
  userName = 'User';

  // Dashboard data
  quickStats: QuickStat[] = [];
  categories: Category[] = [];

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadDashboard();
    this.loadCategories();
  }

  /**
   * Load current user info from auth service
   */
  private loadUserInfo(): void {
    const user = this.authService.currentUser();
    if (user?.profile?.name) {
      this.userName = user.profile.name;
    }
  }

  /**
   * Fetch dashboard data from API
   */
  private loadDashboard(): void {
    this.loading = true;
    this.error = null;

    this.dashboardService.getUserDashboard().subscribe({
      next: (response) => {
        if (response.success) {
          this.mapDashboardData(response.data);
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Erreur lors du chargement du tableau de bord';
        this.loading = false;
      },
    });
  }

  /**
   * Map API response to display format
   */
  private mapDashboardData(data: UserDashboardStats): void {
    this.quickStats = [
      {
        label: 'Commandes Actives',
        value: data.activeOrders.toString(),
        icon: 'shopping-bag',
      },
      {
        label: 'Boutiques Favorites',
        value: data.favoriteShops.toString(),
        icon: 'building-store',
      },
      {
        label: 'Produits Consultés',
        value: data.viewedProducts.toString(),
        icon: 'eye',
      },
    ];
  }

  /**
   * Fetch categories from API
   */
  private loadCategories(): void {
    this.categoriesLoading = true;
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories.filter(c => c.isActive && !c.deletedAt);
        this.categoriesLoading = false;
      },
      error: () => {
        this.categoriesLoading = false;
      },
    });
  }

  /**
   * Get icon for category, fallback to default
   */
  getCategoryIcon(category: Category): string {
    return category.icon || 'box';
  }

  /**
   * Retry loading dashboard on error
   */
  retry(): void {
    this.loadDashboard();
    this.loadCategories();
  }
}

