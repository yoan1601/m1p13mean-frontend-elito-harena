import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

interface FeaturedShop {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
}

interface OrderHistory {
  id: string;
  shop: string;
  items: number;
  total: string;
  status: 'delivered' | 'shipped' | 'processing' | 'pending';
  date: Date;
}

/**
 * User Dashboard Component
 * Displays personalized shopping experience for buyers (USER role).
 * Aligned with API Contract v1.4
 */
@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  templateUrl: './user-dashboard.component.html',
})
export class UserDashboardComponent {
  userName = 'User'; // Will be populated from auth service

  quickStats = [
    {
      label: 'Commandes Actives',
      value: '3',
      icon: 'solar:bag-4-line-duotone',
    },
    {
      label: 'Boutiques Favorites',
      value: '5',
      icon: 'solar:shop-line-duotone',
    },
    {
      label: 'Produits Consultés',
      value: '24',
      icon: 'solar:eye-line-duotone',
    },
  ];

  featuredShops: FeaturedShop[] = [
    {
      id: '1',
      name: 'Fashion Hub',
      category: 'Vêtements & Accessoires',
      image: '/assets/images/products/product-1.jpg',
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Tech World',
      category: 'Électronique',
      image: '/assets/images/products/product-2.jpg',
      rating: 4.6,
    },
    {
      id: '3',
      name: 'Home Essentials',
      category: 'Maison & Déco',
      image: '/assets/images/products/product-3.jpg',
      rating: 4.5,
    },
    {
      id: '4',
      name: 'Beauty Palace',
      category: 'Beauté & Soins',
      image: '/assets/images/products/product-4.jpg',
      rating: 4.7,
    },
  ];

  recentOrders: OrderHistory[] = [
    {
      id: 'ORD-1234',
      shop: 'Fashion Hub',
      items: 2,
      total: '$89.99',
      status: 'shipped',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: 'ORD-1233',
      shop: 'Tech World',
      items: 1,
      total: '$299.00',
      status: 'delivered',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    },
    {
      id: 'ORD-1232',
      shop: 'Home Essentials',
      items: 4,
      total: '$156.50',
      status: 'delivered',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    },
  ];

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      pending: 'warn',
      processing: 'accent',
      shipped: 'primary',
      delivered: 'primary',
    };
    return colors[status] || 'primary';
  }

  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
}

