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
  color: string;
}

interface RecentActivity {
  id: number;
  action: string;
  target: string;
  timestamp: Date;
  icon: string;
}

/**
 * Admin Dashboard Component
 * Displays overview statistics and management tools for administrators.
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  statCards: StatCard[] = [
    {
      title: 'Total Shops',
      value: '24',
      change: '+12%',
      changeType: 'increase',
      icon: 'solar:shop-line-duotone',
      color: 'primary',
    },
    {
      title: 'Total Customers',
      value: '1,234',
      change: '+8%',
      changeType: 'increase',
      icon: 'solar:users-group-rounded-line-duotone',
      color: 'accent',
    },
    {
      title: 'Monthly Revenue',
      value: '$45,678',
      change: '+15%',
      changeType: 'increase',
      icon: 'solar:wallet-money-line-duotone',
      color: 'success',
    },
    {
      title: 'Pending Approvals',
      value: '7',
      change: '-3',
      changeType: 'decrease',
      icon: 'solar:clock-circle-line-duotone',
      color: 'warn',
    },
  ];

  recentActivities: RecentActivity[] = [
    {
      id: 1,
      action: 'New shop registered',
      target: 'Fashion Hub',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      icon: 'solar:shop-add-line-duotone',
    },
    {
      id: 2,
      action: 'Customer complaint resolved',
      target: 'Order #12345',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      icon: 'solar:check-circle-line-duotone',
    },
    {
      id: 3,
      action: 'System maintenance scheduled',
      target: 'Database backup',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      icon: 'solar:settings-line-duotone',
    },
    {
      id: 4,
      action: 'New promotional campaign',
      target: 'Summer Sale 2026',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      icon: 'solar:tag-price-line-duotone',
    },
  ];
}
