import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { ToastService } from '../../core/toast.service';
import { Account } from '../../models/models';

@Component({
  selector: 'app-account-management',
  imports: [FormsModule],
  template: `
    <h1 class="section-title">Account Management</h1>
    <p class="section-sub">Admin only — create and manage bank accounts</p>

    <!-- Create Account -->
    <div class="glass-card mb-4" style="max-width:480px">
      <h3 style="font-size:.95rem;font-weight:700;color:var(--accent);margin-bottom:16px">Create New Account</h3>
      <form (ngSubmit)="createAccount()" #cf="ngForm">
        <div class="mb-3">
          <label class="form-label">User ID</label>
          <input type="number" class="form-control" [(ngModel)]="newAcc.userID" name="userId" required min="1" placeholder="User ID">
        </div>
        <div class="mb-3">
          <label class="form-label">Account Type</label>
          <select class="form-select" [(ngModel)]="newAcc.accountType" name="type" required>
            <option value="">Select type</option>
            <option value="SAVINGS">Savings</option>
            <option value="CURRENT">Current</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Initial Balance (₹)</label>
          <input type="number" class="form-control" [(ngModel)]="newAcc.balance" name="balance" placeholder="0.00" min="0">
        </div>
        <button type="submit" class="btn-accent w-100" [disabled]="creating() || cf.invalid">
          {{ creating() ? 'Creating…' : 'Create Account' }}
        </button>
      </form>
    </div>

    <!-- All Accounts -->
    <div class="glass-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h3 style="font-size:.95rem;font-weight:700;color:var(--accent);margin:0">All Accounts</h3>
        <button class="btn-outline btn-sm" (click)="load()">↻ Refresh</button>
      </div>
      @if (accounts().length === 0) {
        <p style="color:var(--text-muted);font-size:.88rem;padding:10px 0">No accounts found</p>
      } @else {
        <div style="overflow-x:auto">
          <table class="tbl">
            <thead>
              <tr><th>ID</th><th>User ID</th><th>Type</th><th>Balance</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              @for (a of accounts(); track a.accountID) {
                <tr>
                  <td>#{{ a.accountID }}</td>
                  <td>#{{ a.userID }}</td>
                  <td>{{ a.accountType }}</td>
                  <td>₹{{ a.balance.toFixed(2) }}</td>
                  <td>
                    <span [class]="a.status === 'Active' ? 'badge-success' : 'badge-danger'">{{ a.status }}</span>
                  </td>
                  <td>
                    @if (a.status === 'Active') {
                      <button class="btn-danger-sm" (click)="toggleStatus(a, 'Closed')">Close</button>
                    } @else {
                      <button class="btn-outline btn-sm" (click)="toggleStatus(a, 'Active')">Activate</button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `
})
export class AccountManagementComponent implements OnInit {
  private api   = inject(ApiService);
  private toast = inject(ToastService);

  accounts = signal<Account[]>([]);
  newAcc: Partial<Account> = {};
  creating = signal(false);

  ngOnInit() { this.load(); }

  load() {
    this.api.getAllAccounts().subscribe({ next: a => this.accounts.set(a), error: e => this.toast.error(e.error?.message || 'Access denied') });
  }

  createAccount() {
    this.creating.set(true);
    this.api.createAccount(this.newAcc).subscribe({
      next: a => { this.accounts.update(l => [a, ...l]); this.newAcc = {}; this.toast.success('Account created!'); this.creating.set(false); },
      error: e => { this.toast.error(e.error?.message || 'Failed'); this.creating.set(false); }
    });
  }

  toggleStatus(a: Account, status: string) {
    this.api.updateStatus(a.accountID, status).subscribe({
      next: updated => { this.accounts.update(l => l.map(x => x.accountID === a.accountID ? updated : x)); this.toast.success('Status updated!'); },
      error: e => this.toast.error(e.error?.message || 'Failed')
    });
  }
}
