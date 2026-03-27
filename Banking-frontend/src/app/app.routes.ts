import { Routes } from '@angular/router';
import { authGuard, adminGuard, analyticsGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: 'login',    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  {
    path: '',
    loadComponent: () => import('./shared/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard',          loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'account',            loadComponent: () => import('./pages/account/account.component').then(m => m.AccountComponent) },
      { path: 'transactions',       loadComponent: () => import('./pages/transactions/transactions.component').then(m => m.TransactionsComponent) },
      { path: 'profile',            loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
      { path: 'notifications',      loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent) },
      { path: 'analytics',          loadComponent: () => import('./pages/analytics/analytics.component').then(m => m.AnalyticsComponent),          canActivate: [analyticsGuard] },
      { path: 'user-management',    loadComponent: () => import('./pages/user-management/user-management.component').then(m => m.UserManagementComponent), canActivate: [adminGuard] },
      { path: 'account-management', loadComponent: () => import('./pages/account-management/account-management.component').then(m => m.AccountManagementComponent), canActivate: [adminGuard] },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
