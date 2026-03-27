import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="sb-brand">
        <span class="sb-icon">🏦</span>
        <span class="sb-name">CTS-BANK</span>
      </div>

      <nav class="sb-nav">
        <a routerLink="/dashboard"     routerLinkActive="sb-active" class="sb-link">
          <span class="sb-li">📊</span> Dashboard
        </a>
        <a routerLink="/account"       routerLinkActive="sb-active" class="sb-link">
          <span class="sb-li">💳</span> My Account
        </a>
        <a routerLink="/transactions"  routerLinkActive="sb-active" class="sb-link">
          <span class="sb-li">💸</span> Transactions
        </a>
        <a routerLink="/notifications" routerLinkActive="sb-active" class="sb-link">
          <span class="sb-li">🔔</span> Notifications
        </a>
        <a routerLink="/profile"       routerLinkActive="sb-active" class="sb-link">
          <span class="sb-li">👤</span> Profile Settings
        </a>

        @if (auth.isAdmin()) {
          <div class="sb-divider">Admin</div>
          <a routerLink="/user-management"    routerLinkActive="sb-active" class="sb-link">
            <span class="sb-li">👥</span> User Management
          </a>
          <a routerLink="/account-management" routerLinkActive="sb-active" class="sb-link">
            <span class="sb-li">🏛️</span> Account Management
          </a>
        }

        @if (auth.canAnalytics()) {
          <div class="sb-divider">Reports</div>
          <a routerLink="/analytics" routerLinkActive="sb-active" class="sb-link">
            <span class="sb-li">📈</span> Analytics Reports
          </a>
        }
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed; top: 0; left: 0; width: var(--sidebar-width); height: 100vh;
      background: linear-gradient(180deg,#0d1b2e,#091422);
      border-right: 1px solid rgba(212,168,67,.08); z-index: 100;
      display: flex; flex-direction: column; overflow-y: auto;
    }
    .sb-brand { padding: 22px 24px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(212,168,67,.1); }
    .sb-icon  { font-size: 1.6rem; }
    .sb-name  { font-size: 1.3rem; font-weight: 800; color: var(--accent); letter-spacing: 1.5px; }
    .sb-nav   { padding: 14px 10px; display: flex; flex-direction: column; gap: 3px; }
    .sb-link  { display: flex; align-items: center; gap: 11px; padding: 11px 14px; color: var(--text-muted); text-decoration: none; border-radius: 10px; font-size: .88rem; font-weight: 500; transition: all .2s; }
    .sb-link:hover { background: rgba(212,168,67,.06); color: var(--text); }
    .sb-active { background: rgba(212,168,67,.1) !important; color: var(--accent) !important; font-weight: 600; }
    .sb-li  { font-size: 1.05rem; width: 22px; text-align: center; }
    .sb-divider { padding: 14px 14px 5px; font-size: .68rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
  `]
})
export class SidebarComponent {
  auth = inject(AuthService);
}
