import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { ToastService } from '../../core/toast.service';
import { UserResponse } from '../../models/models';

@Component({
  selector: 'app-user-management',
  imports: [FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  private api   = inject(ApiService);
  private toast = inject(ToastService);

  users        = signal<UserResponse[]>([]);
  selectedUser = signal<UserResponse | null>(null);
  sending      = signal(false);
  message      = '';

  ngOnInit() {
    this.api.getAllUsers().subscribe({
      next: u => this.users.set(u),
      error: e => this.toast.error(e.error?.message || 'You are not authorized to do this')
    });
  }

  openNotify(u: UserResponse) {
    this.selectedUser.set(u);
    this.message = '';
  }

  closeNotify() {
    this.selectedUser.set(null);
    this.message = '';
  }

  sendNotify() {
    const user = this.selectedUser();
    if (!user || !this.message.trim()) return;
    this.sending.set(true);
    this.api.sendNotification({ userId: user.userId, message: this.message.trim() }).subscribe({
      next: () => {
        this.toast.success(`Notification sent to ${user.name}`);
        this.sending.set(false);
        this.closeNotify();
      },
      error: e => {
        this.toast.error(e.error?.message || 'Failed to send notification');
        this.sending.set(false);
      }
    });
  }
}
