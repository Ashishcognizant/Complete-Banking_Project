import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { ToastService } from '../../core/toast.service';
import { AuthService } from '../../core/auth.service';
import { TransactionResponse } from '../../models/models';

@Component({
  selector: 'app-transactions',
  imports: [FormsModule],
  template: `
    <h1 class="section-title">Transactions</h1>
    <p class="section-sub">Deposit, withdraw, or transfer funds</p>

    <div class="tab-list">
      <button class="tab-item" [class.active]="tab() === 'deposit'"  (click)="tab.set('deposit')">💰 Deposit</button>
      <button class="tab-item" [class.active]="tab() === 'withdraw'" (click)="tab.set('withdraw')">🏧 Withdraw</button>
      <button class="tab-item" [class.active]="tab() === 'transfer'" (click)="tab.set('transfer')">🔄 Transfer</button>
    </div>

    <div class="glass-card" style="max-width:480px">

      @if (tab() === 'deposit') {
        <form (ngSubmit)="doDeposit()" #df="ngForm">
          <div class="mb-3">
            <label class="form-label">Account ID</label>
            <input type="number" class="form-control" [(ngModel)]="dep.accountId" name="accId" required min="1" placeholder="Enter account ID">
          </div>
          <div class="mb-3">
            <label class="form-label">Amount (₹)</label>
            <input type="number" class="form-control" [(ngModel)]="dep.amount" name="amount" required min="1" placeholder="Enter amount">
          </div>
          <button type="submit" class="btn-accent w-100" [disabled]="loading() || df.invalid">
            {{ loading() ? 'Processing…' : 'Deposit' }}
          </button>
        </form>
      }

      @if (tab() === 'withdraw') {
        <form (ngSubmit)="doWithdraw()" #wf="ngForm">
          <div class="mb-3">
            <label class="form-label">Account ID</label>
            <input type="number" class="form-control" [(ngModel)]="wit.accountId" name="accId" required min="1" placeholder="Enter account ID">
          </div>
          <div class="mb-3">
            <label class="form-label">Amount (₹)</label>
            <input type="number" class="form-control" [(ngModel)]="wit.amount" name="amount" required min="1" placeholder="Enter amount">
          </div>
          <button type="submit" class="btn-accent w-100" [disabled]="loading() || wf.invalid">
            {{ loading() ? 'Processing…' : 'Withdraw' }}
          </button>
        </form>
      }

      @if (tab() === 'transfer') {
        <form (ngSubmit)="doTransfer()" #tf="ngForm">
          <div class="mb-3">
            <label class="form-label">From Account ID</label>
            <input type="number" class="form-control" [(ngModel)]="tra.accountId" name="fromId" required min="1" placeholder="Your account ID">
          </div>
          <div class="mb-3">
            <label class="form-label">To Account ID</label>
            <input type="number" class="form-control" [(ngModel)]="tra.toAccountId" name="toId" required min="1" placeholder="Recipient account ID">
          </div>
          <div class="mb-3">
            <label class="form-label">Amount (₹)</label>
            <input type="number" class="form-control" [(ngModel)]="tra.amount" name="amount" required min="1" placeholder="Enter amount">
          </div>
          <button type="submit" class="btn-accent w-100" [disabled]="loading() || tf.invalid">
            {{ loading() ? 'Processing…' : 'Transfer' }}
          </button>
        </form>
      }

      @if (result()) {
        <div class="result-box">
          <div class="r-title">✅ {{ result()!.message }}</div>
          <div class="r-sub">Account #{{ result()!.accountId }} — New Balance: ₹{{ result()!.updatedBalance?.toFixed(2) }}</div>
        </div>
      }
    </div>
  `
})
export class TransactionsComponent implements OnInit {
  private api   = inject(ApiService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private auth  = inject(AuthService);

  tab     = signal('deposit');
  loading = signal(false);
  result  = signal<TransactionResponse | null>(null);

  dep = { accountId: 0, amount: 0 };
  wit = { accountId: 0, amount: 0 };
  tra = { accountId: 0, toAccountId: 0, amount: 0 };

  ngOnInit() {
    this.route.queryParams.subscribe(p => { if (p['tab']) this.tab.set(p['tab']); });
  }

  doDeposit() {
    this.loading.set(true); this.result.set(null);
    this.api.deposit(this.dep).subscribe({
      next: r => { this.result.set(r); this.toast.success('Deposit successful!'); this.auth.unreadCount.update(c => c + 1); this.loading.set(false); },
      error: e => { this.toast.error(e.error?.message || 'Deposit failed'); this.loading.set(false); }
    });
  }

  doWithdraw() {
    this.loading.set(true); this.result.set(null);
    this.api.withdraw(this.wit).subscribe({
      next: r => { this.result.set(r); this.toast.success('Withdrawal successful!'); this.auth.unreadCount.update(c => c + 1); this.loading.set(false); },
      error: e => { this.toast.error(e.error?.message || 'Withdrawal failed'); this.loading.set(false); }
    });
  }

  doTransfer() {
    this.loading.set(true); this.result.set(null);
    this.api.transfer(this.tra).subscribe({
      next: r => { this.result.set(r); this.toast.success('Transfer successful!'); this.auth.unreadCount.update(c => c + 1); this.loading.set(false); },
      error: e => { this.toast.error(e.error?.message || 'Transfer failed'); this.loading.set(false); }
    });
  }
}
