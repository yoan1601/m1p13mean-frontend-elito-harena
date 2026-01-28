import { NavItem } from '../../layouts/full/sidebar/nav-item/nav-item';

/**
 * Navigation items for Admin role sidebar.
 */
export const adminNavItems: NavItem[] = [
  {
    navCap: 'Admin Panel',
  },
  {
    displayName: 'Dashboard',
    iconName: 'solar:widget-line-duotone',
    route: '/admin/dashboard',
  },
  {
    navCap: 'Management',
  },
  {
    displayName: 'Shops',
    iconName: 'solar:shop-line-duotone',
    route: '/admin/shops',
  },
  {
    displayName: 'Users',
    iconName: 'solar:users-group-rounded-line-duotone',
    route: '/admin/users',
  },
  {
    navCap: 'Analytics',
  },
  {
    displayName: 'Reports',
    iconName: 'solar:chart-square-line-duotone',
    route: '/admin/reports',
  },
  {
    displayName: 'Statistics',
    iconName: 'solar:graph-up-line-duotone',
    route: '/admin/statistics',
  },
  {
    navCap: 'Settings',
  },
  {
    displayName: 'Mall Settings',
    iconName: 'solar:settings-line-duotone',
    route: '/admin/settings',
  },
];
