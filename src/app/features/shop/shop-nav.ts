import { NavItem } from '../../layouts/full/sidebar/nav-item/nav-item';

/**
 * Navigation items for Shop role sidebar.
 * 
 * CLEANING PHASE: Disabled items are mock/incomplete pages.
 * Re-enable when fully implemented.
 */
export const shopNavItems: NavItem[] = [
  {
    navCap: 'Panneau Boutique',
  },
  {
    displayName: 'Tableau de bord',
    iconName: 'solar:widget-line-duotone',
    route: '/shop/dashboard',
  },
  {
    navCap: 'Gestion du Magasin',
  },
  {
    displayName: 'Produits',
    iconName: 'solar:box-line-duotone',
    route: '/shop/products',
  },
  // DISABLED: Mock page - redirects to dashboard, no dedicated component
  // {
  //   displayName: 'Inventaire',
  //   iconName: 'solar:clipboard-list-line-duotone',
  //   route: '/shop/inventory',
  // },
  // DISABLED: Broken route - no route definition exists for shop categories
  // {
  //   displayName: 'Catégories',
  //   iconName: 'solar:folder-open-line-duotone',
  //   route: '/shop/categories',
  // },
  {
    navCap: 'Ventes',
  },
  {
    displayName: 'Commandes',
    iconName: 'solar:bag-4-line-duotone',
    route: '/shop/orders',
  },
  // DISABLED: Mock page - redirects to dashboard, no dedicated component
  // {
  //   displayName: 'Promotions',
  //   iconName: 'solar:tag-price-line-duotone',
  //   route: '/shop/promotions',
  // },
  // DISABLED: Analytics section - all items are non-functional
  // {
  //   navCap: 'Analytiques',
  // },
  // DISABLED: Broken route - no route definition exists
  // {
  //   displayName: 'Rapport des Ventes',
  //   iconName: 'solar:chart-line-duotone',
  //   route: '/shop/reports',
  // },
];
