import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { ToastService } from '../../core/toast.service';
import { Account } from '../../models/models';

@Component({
  selector: 'app-account-management',
  imports: [FormsModule],
  templateUrl: './account-management.component.html',
  styleUrl: './account-management.component.css'
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
