import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { authGuard, noAuthGuard, adminGuard, shopGuard, userGuard } from './core/guards';

/**
 * Main application routes with role-based access control.
 *
 * Route structure:
 * - /authentication/* - Public routes (login, register)
 * - /admin/* - Admin-only routes
 * - /shop/* - Shop owner routes
 * - /user/* - User (buyer) routes
 * - /demo/* - Template demo routes (protected)
 */
export const routes: Routes = [
  // Public authentication routes (no auth required)
  {
    path: 'authentication',
    component: BlankComponent,
    canActivate: [noAuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },

  // Admin routes (requires admin role)
  {
    path: 'admin',
    component: FullComponent,
    canActivate: [authGuard, adminGuard],
    data: { role: 'admin' },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/admin/admin.routes').then((m) => m.AdminRoutes),
      },
    ],
  },

  // Shop routes (requires shop role)
  {
    path: 'shop',
    component: FullComponent,
    canActivate: [authGuard, shopGuard],
    data: { role: 'shop' },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/shop/shop.routes').then((m) => m.ShopRoutes),
      },
    ],
  },

  // User routes (requires user role)
  {
    path: 'user',
    component: FullComponent,
    canActivate: [authGuard, userGuard],
    data: { role: 'user' },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/user/user.routes').then(
            (m) => m.UserRoutes
          ),
      },
    ],
  },

  // Legacy/existing template routes (kept for UI components demo)
  {
    path: 'demo',
    component: FullComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'starter',
        pathMatch: 'full',
      },
      {
        path: 'starter',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
    ],
  },

  // Default redirect - goes to login
  {
    path: '',
    redirectTo: '/authentication/login',
    pathMatch: 'full',
  },

  // Legacy dashboard redirect
  {
    path: 'dashboard',
    redirectTo: '/authentication/login',
    pathMatch: 'full',
  },

  // 404 - Redirect to login
  {
    path: '**',
    redirectTo: '/authentication/login',
  },
];
