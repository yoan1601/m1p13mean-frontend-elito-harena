import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: string;
}

interface Order {
  id: string;
  customer: string;
  items: number;
  total: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  timestamp: Date;
}

/**
 * Shop Dashboard Component
 * Displays shop-specific statistics, orders, and management tools.
 */
@Component({
  selector: 'app-shop-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  templateUrl: './shop-dashboard.component.html',
})
export class ShopDashboardComponent {
  statCards: StatCard[] = [
    {
      title: 'Today\'s Orders',
      value: '28',
      change: '+5',
      changeType: 'increase',
      icon: 'solar:bag-4-line-duotone',
    },
    {
      title: 'Total Revenue',
      value: '$3,456',
      change: '+12%',
      changeType: 'increase',
      icon: 'solar:wallet-money-line-duotone',
    },
    {
      title: 'Products',
      value: '156',
      change: '+3',
      changeType: 'increase',
      icon: 'solar:box-line-duotone',
    },
    {
      title: 'Low Stock Items',
      value: '8',
      change: '-2',
      changeType: 'decrease',
      icon: 'solar:danger-triangle-line-duotone',
    },
  ];

  recentOrders: Order[] = [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      items: 3,
      total: '$125.00',
      status: 'pending',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      items: 1,
      total: '$49.99',
      status: 'processing',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
    },
    {
      id: 'ORD-003',
      customer: 'Bob Wilson',
      items: 5,
      total: '$234.50',
      status: 'completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
    },
    {
      id: 'ORD-004',
      customer: 'Alice Brown',
      items: 2,
      total: '$78.00',
      status: 'completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 180),
    },
  ];

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      pending: 'warn',
      processing: 'accent',
      completed: 'primary',
      cancelled: 'warn',
    };
    return colors[status] || 'primary';
  }
}
