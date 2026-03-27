import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  template: `
    <nav class="topbar">
      <div class="tb-left">
        👋 Welcome back, <strong>{{ auth.currentUser()?.name || 'User' }}</strong>
      </div>
      <div class="tb-right">
        <a routerLink="/notifications" class="tb-bell">
          🔔
          @if (auth.unreadCount() > 0) {
            <span class="nb">{{ auth.unreadCount() }}</span>
          }
        </a>
        <div class="tb-user" (click)="open.set(!open())">
          <div class="tb-avatar">
            <svg viewBox="0 0 24 24" fill="currentColor" style="width:20px;height:20px">
              <path d="M12,12c2.21,0 4,-1.79 4,-4s-1.79,-4 -4,-4s-4,1.79 -4,4S9.79,12 12,12z M12,14c-2.67,0 -8,1.34 -8,4v2h16v-2C20,15.34 14.67,14 12,14z"/>
            </svg>
          </div>
          <div class="tb-info">
            <span class="tb-name">{{ auth.currentUser()?.name }}</span>
            <span class="tb-role">{{ auth.currentUser()?.role }}</span>
          </div>
          <span class="tb-arrow">▾</span>
        </div>
        @if (open()) {
          <div class="tb-dropdown">
            <a routerLink="/profile" (click)="open.set(false)">👤 Profile Settings</a>
            <button (click)="logout()">🚪 Logout</button>
          </div>
        }
      </div>
    </nav>
  `,
  styles: [`
    .topbar { position:fixed;top:0;left:var(--sidebar-width);right:0;height:var(--navbar-height); background:rgba(10,22,40,.88);backdrop-filter:blur(16px);border-bottom:1px solid rgba(212,168,67,.08); display:flex;align-items:center;justify-content:space-between;padding:0 28px;z-index:99;font-size:.88rem;color:var(--text-muted); }
    .topbar strong { color:var(--text); }
    .tb-right { display:flex;align-items:center;gap:18px;position:relative; }
    .tb-bell  { font-size:1.15rem;cursor:pointer;position:relative;padding:8px;border-radius:8px;transition:.2s;text-decoration:none; }
    .tb-bell:hover { background:rgba(212,168,67,.08); }
    .nb { position:absolute;top:3px;right:3px;background:var(--danger);color:#fff;font-size:.6rem;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700; }
    .tb-user { display:flex;align-items:center;gap:9px;cursor:pointer;padding:5px 10px;border-radius:9px;transition:.2s; }
    .tb-user:hover { background:rgba(212,168,67,.06); }
    .tb-avatar { width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,var(--accent),var(--accent-dark));display:flex;align-items:center;justify-content:center;color:var(--primary);font-weight:800;font-size:.82rem; }
    .tb-info { display:flex;flex-direction:column; }
    .tb-name { font-size:.82rem;font-weight:600;color:var(--text);line-height:1.2; }
    .tb-role { font-size:.68rem;color:var(--accent);text-transform:uppercase;letter-spacing:.5px; }
    .tb-arrow { color:var(--text-muted);font-size:.75rem; }
    .tb-dropdown { position:absolute;top:52px;right:0;background:var(--surface);border:1px solid rgba(212,168,67,.12);border-radius:10px;min-width:175px;box-shadow:0 8px 28px rgba(0,0,0,.4);overflow:hidden;z-index:200; }
    .tb-dropdown a, .tb-dropdown button { display:block;width:100%;padding:11px 15px;color:var(--text-muted);text-decoration:none;font-size:.85rem;transition:.2s;text-align:left;background:transparent;border:none;cursor:pointer;font-family:inherit; }
    .tb-dropdown a:hover, .tb-dropdown button:hover { background:rgba(212,168,67,.06);color:var(--text); }
  `]
})
export class NavbarComponent implements OnInit {
  auth = inject(AuthService);
  private api = inject(ApiService);
  open = signal(false);

  ngOnInit() {
    const uid = this.auth.userId();
    if (uid) this.api.getUnreadCount(uid).subscribe({ next: c => this.auth.unreadCount.set(c), error: () => {} });
  }

  initials(): string {
    return (this.auth.currentUser()?.name || '').split(' ').map((w: string) => w[0]).join('').toUpperCase().substring(0, 2);
  }

  logout() { this.open.set(false); this.auth.logout(); }
}
