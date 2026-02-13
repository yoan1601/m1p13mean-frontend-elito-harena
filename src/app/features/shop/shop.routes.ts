import { Routes } from '@angular/router';
import { ShopDashboardComponent } from './dashboard/shop-dashboard.component';
import { ProductListComponent } from './products/product-list.component';

/**
 * Shop feature module routes.
 * Protected by shopGuard in the parent route configuration.
 */
export const ShopRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: ShopDashboardComponent,
    data: {
      title: 'Shop Dashboard',
      breadcrumb: [
        { title: 'Shop', url: '/shop' },
        { title: 'Dashboard' },
      ],
    },
  },
  {
    path: 'products',
    component: ProductListComponent,
    data: {
      title: 'Products',
      breadcrumb: [
        { title: 'Shop', url: '/shop' },
        { title: 'Produits' },
      ],
    },
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./dashboard/shop-dashboard.component').then(
        (m) => m.ShopDashboardComponent
      ),
    data: {
      title: 'Orders',
      breadcrumb: [
        { title: 'Shop', url: '/shop' },
        { title: 'Orders' },
      ],
    },
  },
  {
    path: 'inventory',
    loadComponent: () =>
      import('./dashboard/shop-dashboard.component').then(
        (m) => m.ShopDashboardComponent
      ),
    data: {
      title: 'Inventory',
      breadcrumb: [
        { title: 'Shop', url: '/shop' },
        { title: 'Inventory' },
      ],
    },
  },
  {
    path: 'promotions',
    loadComponent: () =>
      import('./dashboard/shop-dashboard.component').then(
        (m) => m.ShopDashboardComponent
      ),
    data: {
      title: 'Promotions',
      breadcrumb: [
        { title: 'Shop', url: '/shop' },
        { title: 'Promotions' },
      ],
    },
  },
];
