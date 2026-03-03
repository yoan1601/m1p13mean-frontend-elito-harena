import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { DashboardService } from '../../../core/services';
import { AdminDashboardStats, AdminStatItem, StatCard } from '../../../core/models';

/**
 * Admin Dashboard Component
 * Displays overview statistics and management tools for administrators.
 * Fetches data from GET /dashboard/admin endpoint.
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MaterialModule, TablerIconsModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  // State management
  loading = true;
  error: string | null = null;

  // Dashboard data
  statCards: StatCard[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  /**
   * Fetch dashboard data from API
   */
  private loadDashboard(): void {
    this.loading = true;
    this.error = null;

    this.dashboardService.getAdminDashboard().subscribe({
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
  private mapDashboardData(data: AdminDashboardStats): void {
    this.statCards = [
      this.createStatCard(data.totalShops, 'building-store', 'primary'),
      this.createStatCard(data.totalCustomers, 'users', 'accent'),
      this.createStatCard(data.monthlyRevenue, 'wallet', 'success'),
      this.createStatCard(data.monthlyOrders, 'shopping-cart', 'warn'),
      this.createStatCard(data.avgConversion, 'trending-up', 'primary'),
      this.createStatCard(data.outOfStock, 'alert-triangle', 'warn'),
      this.createStatCard(data.occupancyRate, 'building', 'accent'),
      this.createStatCard(data.newMerchants, 'user-plus', 'success'),
    ];
  }

  /**
   * Create a stat card from admin stat item
   */
  private createStatCard(stat: AdminStatItem, fallbackIcon: string, fallbackColor: string): StatCard {
    let displayValue: string;
    
    if (stat.format === 'currency') {
      displayValue = this.formatCurrency(stat.value);
    } else if (stat.unit === '%') {
      displayValue = `${stat.value}%`;
    } else {
      displayValue = this.formatNumber(stat.value);
    }

    return {
      title: stat.label,
      value: displayValue,
      change: '', // Backend doesn't provide change data for admin stats
      changeType: 'neutral',
      icon: this.mapIcon(stat.icon) || fallbackIcon,
      color: stat.color || fallbackColor,
    };
  }

  /**
   * Map backend icon names to Tabler icons
   */
  private mapIcon(icon: string): string {
    const iconMap: Record<string, string> = {
      'store': 'building-store',
      'people': 'users',
      'euro': 'currency-euro',
      'shopping-cart': 'shopping-cart',
      'trending-up': 'trending-up',
      'warning': 'alert-triangle',
      'building': 'building',
      'user-plus': 'user-plus',
    };
    return iconMap[icon] || icon;
  }

  /**
   * Format currency value
   */
  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
    }).format(value);
  }

  /**
   * Format number with thousand separators
   */
  private formatNumber(value: number): string {
    return new Intl.NumberFormat('fr-FR').format(value);
  }

  /**
   * Retry loading dashboard on error
   */
  retry(): void {
    this.loadDashboard();
  }
}
