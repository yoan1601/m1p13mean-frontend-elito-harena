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
      title: 'Total Boutiques',
      value: '24',
      change: '+12%',
      changeType: 'increase',
      icon: 'building-store',
      color: 'primary',
    },
    {
      title: 'Total Clients',
      value: '1,234',
      change: '+8%',
      changeType: 'increase',
      icon: 'users',
      color: 'accent',
    },
    {
      title: 'Revenus Mensuels',
      value: '$45,678',
      change: '+15%',
      changeType: 'increase',
      icon: 'wallet',
      color: 'success',
    },
    {
      title: 'Approbations en Attente',
      value: '7',
      change: '-3',
      changeType: 'decrease',
      icon: 'clock',
      color: 'warn',
    },
  ];

  recentActivities: RecentActivity[] = [
    {
      id: 1,
      action: 'Nouvelle boutique enregistrée',
      target: 'Fashion Hub',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      icon: 'building-store',
    },
    {
      id: 2,
      action: 'Réclamation client résolue',
      target: 'Commande #12345',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      icon: 'solar:check-circle-line-duotone',
    },
    {
      id: 3,
      action: 'Maintenance système planifiée',
      target: 'Sauvegarde base de données',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      icon: 'solar:settings-line-duotone',
    },
    {
      id: 4,
      action: 'Nouvelle campagne promotionnelle',
      target: 'Soldes d\'été 2026',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      icon: 'solar:tag-price-line-duotone',
    },
  ];
}
