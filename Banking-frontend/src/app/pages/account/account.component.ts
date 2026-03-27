import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { Account } from '../../models/models';

@Component({
  selector: 'app-account',
  imports: [],
  template: `
    <h1 class="section-title">My Account</h1>
    <p class="section-sub">Your bank account details</p>

    @if (!account()) {
      <div class="glass-card text-center" style="padding:48px">
        <div style="font-size:3rem;margin-bottom:12px">🏦</div>
        <p style="color:var(--text-muted)">You don't have a bank account yet.</p>
        <p style="color:var(--text-muted);font-size:.83rem;margin-top:6px">Contact an administrator to create one.</p>
      </div>
    } @else {
      <div class="glass-card">
        <div class="row">
          <div class="col-md-6">
            <div class="detail-row">
              <span class="dl">Account ID</span>
              <span class="dv">#{{ account()!.accountID }}</span>
            </div>
            <div class="detail-row">
              <span class="dl">Account Type</span>
              <span class="dv">{{ account()!.accountType }}</span>
            </div>
            <div class="detail-row">
              <span class="dl">Status</span>
              <span [class]="account()!.status === 'Active' ? 'badge-success' : 'badge-danger'">
                {{ account()!.status }}
              </span>
            </div>
          </div>
          <div class="col-md-6">
            <div class="detail-row">
              <span class="dl">User ID</span>
              <span class="dv">#{{ account()!.userID }}</span>
            </div>
            <div class="detail-row">
              <span class="dl">Current Balance</span>
              <div class="balance">₹{{ account()!.balance.toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .detail-row { margin-bottom: 22px; }
    .dl { display:block; font-size:.76rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:.5px; margin-bottom:4px; }
    .dv { font-size:1.05rem; font-weight:600; color:var(--text); }
    .balance { font-size:2.2rem; font-weight:800; color:var(--accent); }
  `]
})
export class AccountComponent implements OnInit {
  private api = inject(ApiService);
  account = signal<Account | null>(null);

  ngOnInit() {
    this.api.getMyAccounts().subscribe({ next: a => { if (a.length) this.account.set(a[0]); }, error: () => {} });
  }
}
