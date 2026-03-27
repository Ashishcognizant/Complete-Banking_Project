import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';
import { NotificationResponse } from '../../models/models';

@Component({
  selector: 'app-notifications',
  imports: [],
  template: `
    <h1 class="section-title">Notifications</h1>
    <p class="section-sub">Your alerts and messages</p>

    <div class="glass-card">
      @if (notifications().length === 0) {
        <div class="text-center" style="padding:44px;color:var(--text-muted)">
          <div style="font-size:2.5rem;margin-bottom:10px">🔔</div>
          No notifications yet
        </div>
      } @else {
        @for (n of notifications(); track n.notificationId) {
          <div class="notif-item" [class.unread]="!n.read">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
              <div>
                <div style="font-size:.9rem">{{ n.message }}</div>
                <div style="font-size:.75rem;color:var(--text-muted);margin-top:4px">{{ n.createdAt }}</div>
              </div>
              <div style="flex-shrink:0">
                @if (!n.read) {
                  <button class="btn-outline btn-sm" (click)="markRead(n)">Mark Read</button>
                } @else {
                  <span class="badge-success">Read</span>
                }
              </div>
            </div>
          </div>
        }
      }
    </div>
  `
})
export class NotificationsComponent implements OnInit {
  private api   = inject(ApiService);
  private auth  = inject(AuthService);
  private toast = inject(ToastService);

  notifications = signal<NotificationResponse[]>([]);

  ngOnInit() {
    const uid = this.auth.userId();
    if (uid) this.api.getNotifications(uid).subscribe({ next: n => this.notifications.set(n), error: () => this.toast.error('Failed to load notifications') });
  }

  markRead(n: NotificationResponse) {
    this.api.markRead(n.notificationId).subscribe({
      next: updated => {
        this.notifications.update(list => list.map(x => x.notificationId === n.notificationId ? updated : x));
        this.auth.unreadCount.update(c => Math.max(0, c - 1));
      },
      error: () => this.toast.error('Failed to mark as read')
    });
  }
}
