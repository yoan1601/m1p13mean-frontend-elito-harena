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
  // DISABLED: Mock route - loads UserDashboardComponent as placeholder
  // Re-enable when dedicated ShopBrowseComponent is implemented
  // {
  //   path: 'shops',
  //   loadComponent: () =>
  //     import('./dashboard/user-dashboard.component').then(
  //       (m) => m.UserDashboardComponent
  //     ),
  //   data: {
  //     title: 'Browse Shops',
  //     breadcrumb: [
  //       { title: 'Home', url: '/user' },
  //       { title: 'Shops' },
  //     ],
  //   },
  // },
  // Product browsing - GET /api/products
  {
    path: 'products',
    loadComponent: () =>
      import('./products/product-browse.component').then(
        (m) => m.ProductBrowseComponent
      ),
    data: {
      title: 'Browse Products',
      breadcrumb: [
        { title: 'Home', url: '/user' },
        { title: 'Products' },
      ],
    },
  },
  // DISABLED: Mock route - loads UserDashboardComponent as placeholder
  // Re-enable when dedicated CategoryBrowseComponent is implemented
  // {
  //   path: 'categories',
  //   loadComponent: () =>
  //     import('./dashboard/user-dashboard.component').then(
  //       (m) => m.UserDashboardComponent
  //     ),
  //   data: {
  //     title: 'Categories',
  //     breadcrumb: [
  //       { title: 'Home', url: '/user' },
  //       { title: 'Categories' },
  //     ],
  //   },
  // },
  // Cart - GET /api/carts
  {
    path: 'cart',
    loadComponent: () =>
      import('./cart/cart.component').then(
        (m) => m.CartComponent
      ),
    data: {
      title: 'Mon Panier',
      breadcrumb: [
        { title: 'Home', url: '/user' },
        { title: 'Panier' },
      ],
    },
  },
  // Orders - GET /api/orders
  {
    path: 'orders',
    loadComponent: () =>
      import('./orders/user-orders.component').then(
        (m) => m.UserOrdersComponent
      ),
    data: {
      title: 'Mes Commandes',
      breadcrumb: [
        { title: 'Home', url: '/user' },
        { title: 'Commandes' },
      ],
    },
  },
  // DISABLED: Mock route - loads UserDashboardComponent as placeholder
  // Re-enable when dedicated ProfileComponent is implemented
  // {
  //   path: 'profile',
  //   loadComponent: () =>
  //     import('./dashboard/user-dashboard.component').then(
  //       (m) => m.UserDashboardComponent
  //     ),
  //   data: {
  //     title: 'My Profile',
  //     breadcrumb: [
  //       { title: 'Home', url: '/user' },
  //       { title: 'Profile' },
  //     ],
  //   },
  // },
];
