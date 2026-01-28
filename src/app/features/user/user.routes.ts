import { Routes } from '@angular/router';
import { UserDashboardComponent } from './dashboard/user-dashboard.component';

/**
 * User (buyer) feature module routes.
 * Protected by userGuard in the parent route configuration.
 * Aligned with API Contract v1.4
 */
export const UserRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: UserDashboardComponent,
    data: {
      title: 'User Dashboard',
      breadcrumb: [
        { title: 'Home', url: '/user' },
        { title: 'Dashboard' },
      ],
    },
  },
  // Shop browsing - GET /api/shops
  {
    path: 'shops',
    loadComponent: () =>
      import('./dashboard/user-dashboard.component').then(
        (m) => m.UserDashboardComponent
      ),
    data: {
      title: 'Browse Shops',
      breadcrumb: [
        { title: 'Home', url: '/user' },
        { title: 'Shops' },
      ],
    },
  },
  // Product browsing - GET /api/products
  {
    path: 'products',
    loadComponent: () =>
      import('./dashboard/user-dashboard.component').then(
        (m) => m.UserDashboardComponent
      ),
    data: {
      title: 'Browse Products',
      breadcrumb: [
        { title: 'Home', url: '/user' },
        { title: 'Products' },
      ],
    },
  },
  // Categories - GET /api/categories
  {
    path: 'categories',
    loadComponent: () =>
      import('./dashboard/user-dashboard.component').then(
        (m) => m.UserDashboardComponent
      ),
    data: {
      title: 'Categories',
      breadcrumb: [
        { title: 'Home', url: '/user' },
        { title: 'Categories' },
      ],
    },
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./dashboard/user-dashboard.component').then(
        (m) => m.UserDashboardComponent
      ),
    data: {
      title: 'My Orders',
      breadcrumb: [
        { title: 'Home', url: '/user' },
        { title: 'Orders' },
      ],
    },
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./dashboard/user-dashboard.component').then(
        (m) => m.UserDashboardComponent
      ),
    data: {
      title: 'My Profile',
      breadcrumb: [
        { title: 'Home', url: '/user' },
        { title: 'Profile' },
      ],
    },
  },
];

