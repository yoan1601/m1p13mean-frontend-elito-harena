# 🛒 Shopping Mall Frontend - Angular Application

> **Projet Académique MEAN Stack - Master 1**  
> Application web de gestion de centre commercial  
> Developpé par ETU 1773 - FANAHY MANAMPENO Joss Elito & ETU 1793 - RABARIJAONA Harena Juan


---

## 📋 Table des matières

- [Contexte du projet](#-contexte-du-projet)
- [Stack technique](#-stack-technique)
- [Architecture du projet](#-architecture-du-projet)
- [Structure des dossiers](#-structure-des-dossiers)
- [Authentification et routage par rôle](#-authentification-et-routage-par-rôle)
- [Intégration API](#-intégration-api)
- [Configuration d'environnement](#-configuration-denvironnement)
- [Installation et exécution](#-installation-et-exécution)
- [Comptes de démonstration](#-comptes-de-démonstration)
- [Workflow Git](#-workflow-git)
- [Déploiement](#-déploiement)
- [Auteurs](#-auteurs)

---

## 🎯 Contexte du projet

### Objectif académique

Ce projet s'inscrit dans le cadre du module **MEAN Stack** du programme Master 1. L'objectif est de concevoir et développer une application web complète de gestion de centre commercial, démontrant la maîtrise des technologies modernes du développement web.

### Objectifs pédagogiques

- Maîtriser le framework **Angular** avec une architecture modulaire
- Implémenter une authentification **JWT** avec gestion des rôles
- Intégrer un backend **REST API** (NodeJS/Express/MongoDB)
- Appliquer les bonnes pratiques de développement (clean code, séparation des responsabilités)
- Travailler en équipe avec un workflow Git professionnel

### Périmètre fonctionnel

L'application gère trois types d'utilisateurs :

| Rôle | Description | Fonctionnalités principales |
|------|-------------|----------------------------|
| **ADMIN** | Administrateur du centre commercial | Consultation des boutiques, produits et catégories |
| **SHOP** | Propriétaire de boutique | Gestion de ses produits (CRUD), changement de statut |
| **USER** | Acheteur / Client | Navigation dans les boutiques et produits |

---

## 🛠 Stack technique

### Framework principal

| Technologie | Version | Justification |
|-------------|---------|---------------|
| **Angular** | 21.x | Framework SPA robuste, architecture modulaire, TypeScript natif |
| **Angular Material** | 21.x | Composants UI cohérents et accessibles |
| **TailwindCSS** | 4.x | Styling utilitaire flexible et responsive |
| **RxJS** | 7.8 | Gestion réactive des flux de données asynchrones |

### Template de base

Ce projet est basé sur le template **Modernize Angular Free** d'AdminMart, refactorisé pour correspondre aux besoins spécifiques du projet :

- Restructuration en architecture modulaire par fonctionnalité
- Ajout du système d'authentification et de gestion des rôles

### Choix architecturaux

- **Standalone Components** : Approche moderne Angular sans NgModules
- **Lazy Loading** : Chargement différé des modules par rôle
- **Signals** : Gestion d'état réactive (Angular 17+)
- **Guards fonctionnels** : Protection des routes basée sur les rôles

---

## 🏗 Architecture du projet

```
┌─────────────────────────────────────────────────────────────────┐
│                        ANGULAR FRONTEND                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │    ADMIN    │  │    SHOP     │  │    USER     │  Features   │
│  │   Module    │  │   Module    │  │   Module    │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                │                │                     │
│  ┌──────┴────────────────┴────────────────┴──────┐             │
│  │                 CORE MODULE                    │             │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────────────┐  │             │
│  │  │ Guards  │ │ Services│ │  Interceptors   │  │             │
│  │  └─────────┘ └─────────┘ └─────────────────┘  │             │
│  └───────────────────────────────────────────────┘             │
│                            │                                    │
│  ┌─────────────────────────┴─────────────────────┐             │
│  │              SHARED MODULE                     │             │
│  │     Components • Pipes • Material Module       │             │
│  └────────────────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   REST API      │
                    │  (Backend)      │
                    └─────────────────┘
```

---

## 📁 Structure des dossiers

```
src/
├── app/
│   ├── core/                    # Services singleton et logique métier
│   │   ├── guards/              # Protection des routes (auth, rôles)
│   │   ├── interceptors/        # Intercepteurs HTTP (JWT, erreurs)
│   │   ├── models/              # Interfaces et types TypeScript
│   │   └── services/            # Services d'authentification et API
│   │
│   ├── features/                # Modules fonctionnels par rôle
│   │   ├── admin/               # Dashboard et fonctionnalités ADMIN
│   │   │   ├── dashboard/
│   │   │   ├── services/
│   │   │   ├── admin.routes.ts
│   │   │   └── admin-nav.ts
│   │   ├── shop/                # Dashboard et fonctionnalités SHOP
│   │   │   ├── dashboard/
│   │   │   ├── services/
│   │   │   ├── shop.routes.ts
│   │   │   └── shop-nav.ts
│   │   └── user/                # Dashboard et fonctionnalités USER
│   │       ├── dashboard/
│   │       ├── services/
│   │       ├── user.routes.ts
│   │       └── user-nav.ts
│   │
│   ├── layouts/                 # Layouts de l'application
│   │   ├── blank/               # Layout sans sidebar (auth)
│   │   └── full/                # Layout complet avec sidebar
│   │
│   ├── pages/                   # Pages communes
│   │   └── authentication/      # Login, Register
│   │
│   ├── shared/                  # Éléments partagés
│   │   └── material.module.ts   # Exports Angular Material
│   │
│   ├── app.routes.ts            # Configuration des routes principales
│   └── app.config.ts            # Configuration de l'application
│
├── assets/                      # Ressources statiques
│   ├── images/
│   ├── scss/                    # Styles globaux
│   └── i18n/                    # Fichiers de traduction
│
└── environments/                # Configuration par environnement
    ├── environment.ts           # Développement
    └── environment.prod.ts      # Production
```

### Justification de la structure

| Dossier | Responsabilité |
|---------|----------------|
| `core/` | Services injectés à la racine, logique partagée globalement |
| `features/` | Isolation des fonctionnalités par rôle, lazy loading possible |
| `shared/` | Composants et modules réutilisables sans dépendances circulaires |
| `layouts/` | Séparation des layouts pour différents contextes (auth vs app) |

---

## 🔐 Authentification et routage par rôle

### Flux d'authentification

```
┌──────────┐    POST /auth/login    ┌──────────┐
│  Login   │ ───────────────────────▶│  Backend │
│  Form    │                         │          │
└──────────┘◀─────────────────────── └──────────┘
                 JWT Token + User
                        │
                        ▼
              ┌─────────────────┐
              │  LocalStorage   │
              │  - access_token │
              │  - user_data    │
              └─────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │   AuthService   │
              │   (Signal)      │
              └─────────────────┘
```

### Guards de protection

| Guard | Fonction |
|-------|----------|
| `authGuard` | Vérifie que l'utilisateur est authentifié |
| `noAuthGuard` | Redirige les utilisateurs connectés (pages login/register) |
| `adminGuard` | Accès restreint au rôle ADMIN |
| `shopGuard` | Accès restreint au rôle SHOP |
| `userGuard` | Accès restreint au rôle USER |

### Configuration des routes

```typescript
// Routes principales (app.routes.ts)
{
  path: 'admin',
  canActivate: [authGuard, adminGuard],
  loadChildren: () => import('./features/admin/admin.routes')
},
{
  path: 'shop',
  canActivate: [authGuard, shopGuard],
  loadChildren: () => import('./features/shop/shop.routes')
},
{
  path: 'user',
  canActivate: [authGuard, userGuard],
  loadChildren: () => import('./features/user/user.routes')
}
```

---

## 🔗 Intégration API

### Contrat REST (v1.4)

L'intégration frontend est strictement alignée avec le contrat d'API REST :

| Endpoint | Méthode | Accès | Description |
|----------|---------|-------|-------------|
| `/api/categories` | GET | Tous | Liste des catégories |
| `/api/shops` | GET | ADMIN, USER | Liste des boutiques (paginée) |
| `/api/products` | GET | ADMIN, USER | Liste des produits (paginée) |
| `/api/products/my` | GET | SHOP | Produits de sa boutique |
| `/api/products` | POST | SHOP | Création d'un produit |
| `/api/products/:id` | PUT | SHOP | Modification d'un produit |
| `/api/products/:id/status` | PATCH | SHOP | Changement de statut |
| `/api/products/:id` | DELETE | SHOP | Suppression (soft delete) |

### Format de pagination

```typescript
// Requête
GET /api/products?page=1&limit=10&sortBy=name&order=asc

// Réponse
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 100,
    "totalPages": 10
  }
}
```

### Statuts des produits

```typescript
type ProductStatus = 'DRAFT' | 'PUBLISHED' | 'INACTIVE';
```

### Services par rôle

| Service | Responsabilité |
|---------|----------------|
| `AdminApiService` | Consultation globale (shops, products, categories) |
| `ShopApiService` | CRUD produits de sa boutique |
| `UserApiService` | Navigation et consultation (shops, products) |

---

## ⚙️ Configuration d'environnement

### Variables d'environnement

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api',
  
  api: {
    auth: { login: '/auth/login', register: '/auth/register', ... },
    categories: '/categories',
    shops: '/shops',
    products: { base: '/products', my: '/products/my', status: '/products' }
  },
  
  jwt: {
    tokenKey: 'access_token',
    refreshTokenKey: 'refresh_token'
  },
  
  pagination: {
    defaultPage: 1,
    defaultLimit: 10
  }
};
```

### Configuration production

Modifier `environment.prod.ts` avec l'URL du backend déployé :

```typescript
apiBaseUrl: 'https://api.votre-domaine.com/api'
```

---

## 🚀 Installation et exécution

### Prérequis

- **Node.js** : v18.x ou supérieur
- **npm** : v9.x ou supérieur
- **Angular CLI** : v21.x

### Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/m1p13mean-frontend-elito-harena.git

# Accéder au dossier
cd m1p13mean-frontend-elito-harena

# Installer les dépendances
npm install
```

### Exécution en développement

```bash
# Démarrer le serveur de développement
npm start

# L'application sera accessible sur http://localhost:4200
```

### Build de production

```bash
# Générer le build optimisé
npm run build

# Les fichiers seront dans le dossier dist/
```

### Tests

```bash
# Exécuter les tests unitaires
npm test
```

---

## 👥 Comptes de démonstration

> **Note** : En mode développement avec mock activé, les comptes suivants sont disponibles.

| Rôle | Email pattern | Redirection |
|------|---------------|-------------|
| ADMIN | `*admin*@...` | `/admin/dashboard` |
| SHOP | `*shop*@...` | `/shop/dashboard` |
| USER | (autres) | `/user/dashboard` |

Le système de mock détermine le rôle selon le pattern de l'email saisi.

---

## 🔄 Workflow Git

### Branches

| Branche | Usage |
|---------|-------|
| `main` | Production stable |
| `develop` | Intégration des fonctionnalités |
| `feature/*` | Développement de nouvelles fonctionnalités |
| `fix/*` | Corrections de bugs |

### Convention de commits

```
type(scope): description

# Types : feat, fix, docs, style, refactor, test, chore
# Exemples :
feat(auth): add JWT interceptor
fix(shop): correct product status update
docs(readme): update installation guide
```

### Workflow de contribution

1. Créer une branche depuis `develop`
2. Développer et tester localement
3. Commit avec message conventionnel
4. Push et créer une Pull Request
5. Code review et merge

---

## 🌐 Déploiement

### Netlify (Recommandé)

Le projet inclut un fichier `netlify.toml` préconfiguré :

```toml
[build]
  command = "npm run build"
  publish = "dist/Modernize"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Étapes de déploiement

1. Connecter le repository à Netlify
2. Configurer les variables d'environnement si nécessaire
3. Déclencher le déploiement automatique

### Autres plateformes

- **Vercel** : Configuration similaire
- **Firebase Hosting** : Utiliser `firebase init` et `firebase deploy`

---

## 📝 Notes techniques

### Soft Delete

Les ressources supprimées ne sont pas physiquement effacées. Le champ `deletedAt` indique la suppression logique. Les requêtes GET excluent par défaut les ressources avec `deletedAt != null`.

### Gestion des erreurs

L'intercepteur HTTP centralise la gestion des erreurs :
- **401** : Redirection vers login
- **403** : Accès interdit (notification)
- **500** : Erreur serveur (notification)

### Responsive Design

L'application est entièrement responsive grâce à TailwindCSS et Angular Material. La sidebar passe en mode overlay sur mobile.

---

## 👨‍💻 Auteurs

| Matricule | Nom complet |
|-----------|-------------|
| **ETU 1783** | RANDRIAMPENO Joss Elito |
| **ETU 1793** | RABARIJAONA Harena Juan |

---

## 📄 Licence

Projet académique - ITU Master 1 MEAN Stack - 2026

---

*Ce README a été rédigé pour faciliter l'évaluation du projet et la présentation lors de la soutenance orale.*