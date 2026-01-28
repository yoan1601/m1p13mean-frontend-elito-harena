# Shopping Mall System - Angular Frontend

A scalable Angular application for a multi-role shopping mall system, built on the "Modernize Angular Free" template.

## 🏗️ Architecture Overview

This project follows a modular architecture with clear separation of concerns:

```
src/app/
├── core/                    # Singleton services, guards, interceptors
│   ├── guards/              # Route guards (auth, role-based)
│   ├── interceptors/        # HTTP interceptors (JWT, error handling)
│   ├── models/              # TypeScript interfaces and enums
│   └── services/            # Core services (auth, API)
│
├── shared/                  # Reusable components, pipes, modules
│   ├── material.module.ts   # Angular Material imports
│   ├── pipes/               # Custom pipes
│   └── shared.module.ts     # Shared module for feature imports
│
├── features/                # Role-based feature modules
│   ├── admin/               # Admin dashboard and management
│   ├── shop/                # Shop owner features
│   └── customer/            # Customer shopping experience
│
├── layouts/                 # Layout components (full, blank)
├── pages/                   # Legacy pages (authentication, demo)
├── components/              # Legacy template components
└── services/                # Legacy template services
```

## 👥 User Roles

| Role | Description | Access Path |
|------|-------------|-------------|
| **Admin** | Mall administrators with full system access | `/admin/*` |
| **Shop** | Shop owners managing their stores | `/shop/*` |
| **Customer** | End users shopping in the mall | `/customer/*` |

## 🔐 Authentication

### Mock Authentication (Development)
The application includes mocked authentication for development:
- Email patterns determine role: `admin@*`, `shop@*`, `customer@*`
- Any password works in mock mode
- JWT tokens are simulated locally

### Demo Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@mall.com | any |
| Shop | shop@mall.com | any |
| Customer | customer@mall.com | any |

### Backend Integration
To connect to a real backend:
1. Update `src/environments/environment.ts` with your API URL
2. Modify `AuthService` to use actual HTTP calls (commented examples provided)
3. Configure CORS on your backend server

## 🛡️ Route Guards

| Guard | Description |
|-------|-------------|
| `authGuard` | Requires authentication |
| `noAuthGuard` | Prevents authenticated users (login/register pages) |
| `adminGuard` | Requires Admin role |
| `shopGuard` | Requires Shop role |
| `customerGuard` | Requires Customer role |
| `roleGuard(roles[])` | Factory for custom role combinations |

## 🌐 HTTP Interceptors

| Interceptor | Description |
|-------------|-------------|
| `jwtInterceptor` | Attaches Bearer token to requests |
| `errorInterceptor` | Global error handling and transformation |

## 📁 Key Files

### Environment Configuration
- `src/environments/environment.ts` - Development settings
- `src/environments/environment.prod.ts` - Production settings

### Core Services
- `src/app/core/services/auth.service.ts` - Authentication logic
- `src/app/core/services/api.service.ts` - Base API service

### Feature Navigation
- `src/app/features/admin/admin-nav.ts` - Admin sidebar items
- `src/app/features/shop/shop-nav.ts` - Shop sidebar items
- `src/app/features/customer/customer-nav.ts` - Customer sidebar items

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
ng serve

# Build for production
ng build --configuration production
```

## 🔧 Environment Variables

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api',
  
  api: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      // ... other endpoints
    },
    // ... role-specific endpoints
  },
  
  jwt: {
    tokenKey: 'access_token',
    refreshTokenKey: 'refresh_token',
    tokenExpiryKey: 'token_expiry',
  },
};
```

## 📦 Module Imports Guide

### For Feature Modules
```typescript
import { SharedModule } from 'src/app/shared';
import { AuthService } from 'src/app/core';
```

### For Standalone Components
```typescript
import { MaterialModule } from 'src/app/shared/material.module';
import { AuthService } from 'src/app/core/services/auth.service';
```

## 🎨 Template Reference

This project is based on the [Modernize Angular Free](https://adminmart.com/product/modernize-angular-admin-dashboard/) template. Original template features (UI components, demo pages) are available under `/demo/*` routes.

## 📋 TODO for Backend Integration

- [ ] Replace mock authentication in `AuthService`
- [ ] Implement API services for each feature module
- [ ] Add loading states and error handling in components
- [ ] Implement real-time notifications
- [ ] Add file upload functionality for products
- [ ] Implement payment gateway integration

## 🤝 Contributing

1. Follow the modular architecture pattern
2. Place role-specific code in feature modules
3. Use shared module for reusable components
4. Keep core module for singletons only
