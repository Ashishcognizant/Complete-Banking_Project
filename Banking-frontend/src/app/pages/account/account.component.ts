import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { Account } from '../../models/models';

@Component({
  selector: 'app-account',
  imports: [],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  private api = inject(ApiService);
  account = signal<Account | null>(null);

  ngOnInit() {
    this.api.getMyAccounts().subscribe({ next: a => { if (a.length) this.account.set(a[0]); }, error: () => {} });
  }
}
