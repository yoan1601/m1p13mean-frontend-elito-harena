import { NavItem } from '../../layouts/full/sidebar/nav-item/nav-item';

/**
 * Navigation items for Admin role sidebar.
 */
export const adminNavItems: NavItem[] = [
  {
    navCap: 'Panneau Administrateur',
  },
  {
    displayName: 'Tableau de bord',
    iconName: 'solar:widget-line-duotone',
    route: '/admin/dashboard',
  },
  {
    navCap: 'Gestion',
  },
  {
    displayName: 'Boutiques',
    iconName: 'solar:shop-line-duotone',
    route: '/admin/shops',
  },
  {
    displayName: 'Utilisateurs',
    iconName: 'solar:users-group-rounded-line-duotone',
    route: '/admin/users',
  },
  {
    navCap: 'Analytiques',
  },
  {
    displayName: 'Rapports',
    iconName: 'solar:chart-square-line-duotone',
    route: '/admin/reports',
  },
  {
    displayName: 'Statistiques',
    iconName: 'solar:graph-up-line-duotone',
    route: '/admin/statistics',
  },
  {
    navCap: 'Paramètres',
  },
  {
    displayName: 'Paramètres du Centre',
    iconName: 'solar:settings-line-duotone',
    route: '/admin/settings',
  },
];
