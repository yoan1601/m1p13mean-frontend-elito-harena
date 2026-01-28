import { NavItem } from '../../layouts/full/sidebar/nav-item/nav-item';

/**
 * Navigation items for Shop role sidebar.
 */
export const shopNavItems: NavItem[] = [
  {
    navCap: 'Shop Panel',
  },
  {
    displayName: 'Dashboard',
    iconName: 'solar:widget-line-duotone',
    route: '/shop/dashboard',
  },
  {
    navCap: 'Store Management',
  },
  {
    displayName: 'Products',
    iconName: 'solar:box-line-duotone',
    route: '/shop/products',
  },
  {
    displayName: 'Inventory',
    iconName: 'solar:clipboard-list-line-duotone',
    route: '/shop/inventory',
  },
  {
    displayName: 'Categories',
    iconName: 'solar:folder-open-line-duotone',
    route: '/shop/categories',
  },
  {
    navCap: 'Sales',
  },
  {
    displayName: 'Orders',
    iconName: 'solar:bag-4-line-duotone',
    route: '/shop/orders',
  },
  {
    displayName: 'Promotions',
    iconName: 'solar:tag-price-line-duotone',
    route: '/shop/promotions',
  },
  {
    navCap: 'Analytics',
  },
  {
    displayName: 'Sales Report',
    iconName: 'solar:chart-line-duotone',
    route: '/shop/reports',
  },
];
