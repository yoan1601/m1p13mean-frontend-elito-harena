import { NavItem } from '../../layouts/full/sidebar/nav-item/nav-item';

/**
 * Navigation items for User (buyer) role sidebar.
 * Aligned with API Contract v1.4
 * 
 * CLEANING PHASE: Disabled items are mock/incomplete pages.
 * Re-enable when fully implemented.
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
  // DISABLED: Mock page - redirects to dashboard, no dedicated component
  // {
  //   displayName: 'Parcourir les Boutiques',
  //   iconName: 'solar:shop-line-duotone',
  //   route: '/user/shops',
  // },
  {
    displayName: 'Parcourir les Produits',
    iconName: 'solar:bag-smile-line-duotone',
    route: '/user/products',
  },
  // DISABLED: Mock page - redirects to dashboard, no dedicated component
  // {
  //   displayName: 'Catégories',
  //   iconName: 'solar:widget-4-line-duotone',
  //   route: '/user/categories',
  // },
  {
    displayName: 'Mon Panier',
    iconName: 'solar:cart-large-2-line-duotone',
    route: '/user/cart',
  },
  {
    navCap: 'Mon Compte',
  },
  {
    displayName: 'Mes Commandes',
    iconName: 'solar:bag-4-line-duotone',
    route: '/user/orders',
  },
  // DISABLED: Mock page - redirects to dashboard, no dedicated component
  // {
  //   displayName: 'Mon Profil',
  //   iconName: 'solar:user-circle-line-duotone',
  //   route: '/user/profile',
  // },
];
