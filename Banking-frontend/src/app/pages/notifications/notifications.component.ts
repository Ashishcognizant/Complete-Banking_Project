import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';
import { NotificationResponse } from '../../models/models';

@Component({
  selector: 'app-notifications',
  imports: [],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  notifications = signal<NotificationResponse[]>([]);

  ngOnInit() {
    const uid = this.auth.userId();
    if (uid)
      this.api
        .getNotifications(uid)
        .subscribe({
          next: (n) => this.notifications.set(n),
          error: () => this.toast.error('Failed to load notifications'),
        });
  }

  markRead(n: NotificationResponse) {
    this.api.markRead(n.notificationId).subscribe({
      next: (updated) => {
        this.notifications.update((list) =>
          list.map((x) => (x.notificationId === n.notificationId ? updated : x)),
        );
        this.auth.unreadCount.update((c) => Math.max(0, c - 1));
      },
      error: () => this.toast.error('Failed to mark as read'),
    });
  }
}
