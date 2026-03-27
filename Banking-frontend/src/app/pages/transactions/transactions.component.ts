import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { ToastService } from '../../core/toast.service';
import { AuthService } from '../../core/auth.service';
import { Account, TransactionResponse } from '../../models/models';

@Component({
  selector: 'app-transactions',
  imports: [FormsModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit {
  private api   = inject(ApiService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private auth  = inject(AuthService);

  tab           = signal('deposit');
  loading       = signal(false);
  result        = signal<TransactionResponse | null>(null);
  myAccounts    = signal<Account[]>([]);
  allAccounts   = signal<Account[]>([]);
  otherAccounts = computed(() => {
    const myIds = new Set(this.myAccounts().map(a => a.accountID));
    return this.allAccounts().filter(a => !myIds.has(a.accountID));
  });

  dep = { accountId: 0, amount: 0 };
  wit = { accountId: 0, amount: 0 };
  tra = { accountId: 0, toAccountId: 0, amount: 0 };

  ngOnInit() {
    this.route.queryParams.subscribe(p => { if (p['tab']) this.tab.set(p['tab']); });
    this.api.getMyAccounts().subscribe({
      next: accounts => {
        this.myAccounts.set(accounts);
        if (accounts.length > 0) {
          this.dep.accountId = accounts[0].accountID;
          this.wit.accountId = accounts[0].accountID;
          this.tra.accountId = accounts[0].accountID;
        }
      },
      error: () => this.toast.error('Failed to load accounts')
    });
    this.api.getAllAccountsForUsers().subscribe({
      next: accounts => this.allAccounts.set(accounts),
      error: () => {}
    });
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
