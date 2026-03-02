import { NavItem } from '../../layouts/full/sidebar/nav-item/nav-item';

/**
 * Navigation items for Admin role sidebar.
 * 
 * CLEANING PHASE: Disabled items are mock/incomplete pages.
 * Re-enable when fully implemented.
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
    displayName: 'Catégories',
    iconName: 'solar:folder-open-line-duotone',
    route: '/admin/categories',
  },
  {
    displayName: 'Boutiques',
    iconName: 'solar:shop-line-duotone',
    route: '/admin/shops',
  },
  // DISABLED: Mock page - redirects to dashboard, no dedicated component
  // {
  //   displayName: 'Utilisateurs',
  //   iconName: 'solar:users-group-rounded-line-duotone',
  //   route: '/admin/users',
  // },
  // DISABLED: Analytics section - all items are non-functional
  // {
  //   navCap: 'Analytiques',
  // },
  // DISABLED: Mock page - redirects to dashboard, no dedicated component
  // {
  //   displayName: 'Rapports',
  //   iconName: 'solar:chart-square-line-duotone',
  //   route: '/admin/reports',
  // },
  // DISABLED: Broken route - no route definition exists
  // {
  //   displayName: 'Statistiques',
  //   iconName: 'solar:graph-up-line-duotone',
  //   route: '/admin/statistics',
  // },
  // DISABLED: Settings section - all items are non-functional
  // {
  //   navCap: 'Paramètres',
  // },
  // DISABLED: Broken route - no route definition exists
  // {
  //   displayName: 'Paramètres du Centre',
  //   iconName: 'solar:settings-line-duotone',
  //   route: '/admin/settings',
  // },
];
