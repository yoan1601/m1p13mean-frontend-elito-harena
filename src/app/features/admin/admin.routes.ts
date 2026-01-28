import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';

/**
 * Admin feature module routes.
 * Protected by adminGuard in the parent route configuration.
 */
export const AdminRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
    data: {
      title: 'Admin Dashboard',
      breadcrumb: [
        { title: 'Admin', url: '/admin' },
        { title: 'Dashboard' },
      ],
    },
  },
  // Placeholder routes for future features
  {
    path: 'shops',
    loadComponent: () =>
      import('./dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
    data: {
      title: 'Manage Shops',
      breadcrumb: [
        { title: 'Admin', url: '/admin' },
        { title: 'Shops' },
      ],
    },
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
    data: {
      title: 'Manage Users',
      breadcrumb: [
        { title: 'Admin', url: '/admin' },
        { title: 'Users' },
      ],
    },
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
    data: {
      title: 'Reports',
      breadcrumb: [
        { title: 'Admin', url: '/admin' },
        { title: 'Reports' },
      ],
    },
  },
];
