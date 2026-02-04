import { NavItem } from '../../layouts/full/sidebar/nav-item/nav-item';

/**
 * Navigation items for Shop role sidebar.
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
  {
    displayName: 'Inventaire',
    iconName: 'solar:clipboard-list-line-duotone',
    route: '/shop/inventory',
  },
  {
    displayName: 'Catégories',
    iconName: 'solar:folder-open-line-duotone',
    route: '/shop/categories',
  },
  {
    navCap: 'Ventes',
  },
  {
    displayName: 'Commandes',
    iconName: 'solar:bag-4-line-duotone',
    route: '/shop/orders',
  },
  {
    displayName: 'Promotions',
    iconName: 'solar:tag-price-line-duotone',
    route: '/shop/promotions',
  },
  {
    navCap: 'Analytiques',
  },
  {
    displayName: 'Rapport des Ventes',
    iconName: 'solar:chart-line-duotone',
    route: '/shop/reports',
  },
];
