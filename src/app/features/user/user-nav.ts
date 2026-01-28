import { NavItem } from '../../layouts/full/sidebar/nav-item/nav-item';

/**
 * Navigation items for User (buyer) role sidebar.
 * Aligned with API Contract v1.4
 */
export const userNavItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'solar:home-2-line-duotone',
    route: '/user/dashboard',
  },
  {
    navCap: 'Shopping',
  },
  {
    displayName: 'Browse Shops',
    iconName: 'solar:shop-line-duotone',
    route: '/user/shops',
  },
  {
    displayName: 'Browse Products',
    iconName: 'solar:bag-smile-line-duotone',
    route: '/user/products',
  },
  {
    displayName: 'Categories',
    iconName: 'solar:widget-4-line-duotone',
    route: '/user/categories',
  },
  {
    navCap: 'My Account',
  },
  {
    displayName: 'My Orders',
    iconName: 'solar:bag-4-line-duotone',
    route: '/user/orders',
  },
  {
    displayName: 'My Profile',
    iconName: 'solar:user-circle-line-duotone',
    route: '/user/profile',
  },
];

