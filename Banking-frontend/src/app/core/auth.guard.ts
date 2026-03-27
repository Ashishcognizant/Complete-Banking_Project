import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const a = inject(AuthService); const r = inject(Router);
  if (a.isLoggedIn()) return true;
  r.navigate(['/login']); return false;
};

export const adminGuard: CanActivateFn = () => {
  const a = inject(AuthService); const r = inject(Router);
  if (a.isLoggedIn() && a.isAdmin()) return true;
  r.navigate(['/dashboard']); return false;
};

export const analyticsGuard: CanActivateFn = () => {
  const a = inject(AuthService); const r = inject(Router);
  if (a.isLoggedIn() && a.canAnalytics()) return true;
  r.navigate(['/dashboard']); return false;
};
