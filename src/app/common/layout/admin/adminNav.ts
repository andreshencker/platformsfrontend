// Admin: navegación 100% estática
export type NavItem = { label: string; path: string; icon?: string };

export const ADMIN_TOPBAR: NavItem[] = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'layout-dashboard' },
    { label: 'Users',     path: '/admin/users',     icon: 'users' },
    { label: 'Settings',  path: '/admin/settings',  icon: 'settings' },
];

export const ADMIN_SIDEBAR: NavItem[] = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'layout-dashboard' },
    { label: 'Users',     path: '/admin/users',     icon: 'users' },
    { label: 'Settings',  path: '/admin/settings',  icon: 'settings' },
];