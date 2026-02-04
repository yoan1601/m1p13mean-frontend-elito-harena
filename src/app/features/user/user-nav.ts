import { NavItem } from '../../layouts/full/sidebar/nav-item/nav-item';

/**
 * Navigation items for User (buyer) role sidebar.
 * Aligned with API Contract v1.4
 */
export const userNavItems: NavItem[] = [
  {
    navCap: 'Accueil',
  },
  {
    displayName: 'Tableau de bord',
    iconName: 'solar:home-2-line-duotone',
    route: '/user/dashboard',
  },
  {
    navCap: 'Achats',
  },
  {
    displayName: 'Parcourir les Boutiques',
    iconName: 'solar:shop-line-duotone',
    route: '/user/shops',
  },
  {
    displayName: 'Parcourir les Produits',
    iconName: 'solar:bag-smile-line-duotone',
    route: '/user/products',
  },
  {
    displayName: 'Catégories',
    iconName: 'solar:widget-4-line-duotone',
    route: '/user/categories',
  },
  {
    navCap: 'Mon Compte',
  },
  {
    displayName: 'Mes Commandes',
    iconName: 'solar:bag-4-line-duotone',
    route: '/user/orders',
  },
  {
    displayName: 'Mon Profil',
    iconName: 'solar:user-circle-line-duotone',
    route: '/user/profile',
  },
];

