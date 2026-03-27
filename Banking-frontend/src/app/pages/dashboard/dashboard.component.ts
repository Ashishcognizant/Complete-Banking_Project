import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ApiService } from '../../core/api.service';
import { Account, NotificationResponse } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  template: `
    <div class="d-flex justify-content-between align-items-start mb-4">
      <div>
        <h1 class="section-title mb-1">Dashboard</h1>
        <p class="section-sub mb-0">Overview of your banking activity</p>
      </div>

      @if (accountsList().length > 1) {
        <div class="tab-list" style="margin-bottom:0 !important; padding:4px">
          @for (a of accountsList(); track a.accountID) {
            <button class="tab-item" style="padding:4px 12px; font-size:.8rem"
                    [class.active]="account()?.accountID === a.accountID" 
                    (click)="account.set(a)">
              {{ a.accountType === 'SAVINGS' ? '💰 Savings' : '💳 Current' }}
            </button>
          }
        </div>
      }
    </div>

    <!-- Stat Cards -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-3">
        <div class="stat-card">
          <div class="stat-label">Account Balance</div>
          <div class="stat-value">₹{{ account()?.balance?.toFixed(2) ?? '—' }}</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="stat-card">
          <div class="stat-label">Account Type</div>
          <div class="stat-value" style="font-size:1.3rem">{{ account()?.accountType ?? '—' }}</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="stat-card">
          <div class="stat-label">Status</div>
          @if (account()) {
            <span [class]="account()!.status === 'Active' ? 'badge-success' : 'badge-danger'">
              {{ account()!.status }}
            </span>
          } @else {
            <span class="badge-warning">No Account</span>
          }
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="stat-card">
          <div class="stat-label">Unread Alerts</div>
          <div class="stat-value" style="font-size:1.3rem">{{ auth.unreadCount() }}</div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <h2 style="font-size:1rem;font-weight:600;margin-bottom:14px">Quick Actions</h2>
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-3">
        <a routerLink="/transactions" [queryParams]="{tab:'deposit'}" class="quick-action">
          <div class="qa-icon" style="background:rgba(34,197,94,.12);color:var(--success)">💰</div>
          <span style="font-size:.88rem;font-weight:500">Deposit</span>
        </a>
      </div>
      <div class="col-6 col-md-3">
        <a routerLink="/transactions" [queryParams]="{tab:'withdraw'}" class="quick-action">
          <div class="qa-icon" style="background:rgba(239,68,68,.12);color:var(--danger)">🏧</div>
          <span style="font-size:.88rem;font-weight:500">Withdraw</span>
        </a>
      </div>
      <div class="col-6 col-md-3">
        <a routerLink="/transactions" [queryParams]="{tab:'transfer'}" class="quick-action">
          <div class="qa-icon" style="background:rgba(59,130,246,.12);color:var(--info)">🔄</div>
          <span style="font-size:.88rem;font-weight:500">Transfer</span>
        </a>
      </div>
      <div class="col-6 col-md-3">
        <a routerLink="/notifications" class="quick-action">
          <div class="qa-icon" style="background:rgba(245,158,11,.12);color:var(--warning)">🔔</div>
          <span style="font-size:.88rem;font-weight:500">Alerts</span>
        </a>
      </div>
    </div>

    <!-- Recent Notifications -->
    <div class="glass-card">
      <h3 style="font-size:.95rem;font-weight:700;color:var(--accent);margin-bottom:14px">Recent Notifications</h3>
      @if (notifications().length === 0) {
        <p style="color:var(--text-muted);font-size:.88rem;padding:10px 0">No notifications yet</p>
      } @else {
        @for (n of notifications().slice(0, 5); track n.notificationId) {
          <div class="notif-item" [class.unread]="!n.read">
            <div style="font-size:.88rem">{{ n.message }}</div>
            <div style="font-size:.74rem;color:var(--text-muted);margin-top:3px">{{ n.createdAt }}</div>
          </div>
        }
        @if (notifications().length > 5) {
          <a routerLink="/notifications" style="color:var(--accent);font-size:.83rem;display:block;margin-top:12px;text-decoration:none">
            View all {{ notifications().length }} notifications →
          </a>
        }
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  auth    = inject(AuthService);
  private api  = inject(ApiService);

  account       = signal<Account | null>(null);
  accountsList  = signal<Account[]>([]);
  notifications = signal<NotificationResponse[]>([]);

  ngOnInit() {
    this.api.getMyAccounts().subscribe({ 
      next: a => { 
        this.accountsList.set(a);
        if (a.length) this.account.set(a[0]); 
      }, 
      error: () => {} 
    });
    const uid = this.auth.userId();
    if (uid) this.api.getNotifications(uid).subscribe({ next: n => this.notifications.set(n), error: () => {} });
  }
}
