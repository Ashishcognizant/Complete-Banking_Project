import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { ApiService } from '../../core/api.service';
import { Account, NotificationResponse } from '../../models/models';
 
@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  auth         = inject(AuthService);
  private api    = inject(ApiService);
  private router = inject(Router);
 
  account       = signal<Account | null>(null);
  accountsList  = signal<Account[]>([]);
  notifications = signal<NotificationResponse[]>([]);
 
  ngOnInit() {
    this.api.getMyAccounts().subscribe({
      next: a => { this.accountsList.set(a); if (a.length) this.account.set(a[0]); },
      error: () => {}
    });
 
    this.loadUnreadNotifications();
 
    // reload unread notifications every time user navigates back to dashboard
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => this.loadUnreadNotifications());
  }
 
  loadUnreadNotifications() {
    const uid = this.auth.userId();
    if (uid) this.api.getNotifications(uid).subscribe({
      next: n => this.notifications.set(n.filter(x => x.status === 'NEW')),
      error: () => {}
    });
  }
}