import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { DashboardService } from '../../../core/services';
import { ShopDashboardStats, StatCard } from '../../../core/models';

/**
 * Shop Dashboard Component
 * Displays shop-specific statistics, orders, and management tools.
 * Fetches data from GET /dashboard/merchant endpoint.
 */
@Component({
  selector: 'app-shop-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MaterialModule, TablerIconsModule],
  templateUrl: './shop-dashboard.component.html',
})
export class ShopDashboardComponent implements OnInit {
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

    this.dashboardService.getShopDashboard().subscribe({
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
  private mapDashboardData(data: ShopDashboardStats): void {
    this.statCards = [
      {
        title: 'Commandes du Jour',
        value: data.dailyOrders.count.toString(),
        change: this.formatChange(data.dailyOrders.change),
        changeType: this.getChangeType(data.dailyOrders.change),
        icon: 'shopping-bag',
      },
      {
        title: 'Revenus du Jour',
        value: this.formatCurrency(data.revenue.total),
        change: data.revenue.change,
        changeType: this.getChangeTypeFromString(data.revenue.change),
        icon: 'wallet',
      },
      {
        title: 'Produits',
        value: data.products.total.toString(),
        change: this.formatChange(data.products.change),
        changeType: this.getChangeType(data.products.change),
        icon: 'box',
      },
      {
        title: 'Stock Faible',
        value: data.lowStock.count.toString(),
        change: this.formatChange(data.lowStock.change),
        changeType: data.lowStock.change <= 0 ? 'decrease' : 'increase',
        icon: 'alert-triangle',
      },
    ];
  }

  /**
   * Format numeric change with sign
   */
  private formatChange(value: number): string {
    if (value > 0) return `+${value}`;
    return value.toString();
  }

  /**
   * Determine change type from numeric value
   */
  private getChangeType(value: number): 'increase' | 'decrease' | 'neutral' {
    if (value > 0) return 'increase';
    if (value < 0) return 'decrease';
    return 'neutral';
  }

  /**
   * Determine change type from string (e.g., "+12%", "-5%")
   */
  private getChangeTypeFromString(value: string): 'increase' | 'decrease' | 'neutral' {
    if (value.startsWith('+')) return 'increase';
    if (value.startsWith('-')) return 'decrease';
    return 'neutral';
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
   * Retry loading dashboard on error
   */
  retry(): void {
    this.loadDashboard();
  }
}
