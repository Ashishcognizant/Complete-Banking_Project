import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { ToastService } from '../../core/toast.service';
import { UserResponse } from '../../models/models';

@Component({
  selector: 'app-user-management',
  imports: [],
  template: `
    <h1 class="section-title">User Management</h1>
    <p class="section-sub">Admin only — all registered users</p>
    <div class="glass-card">
      @if (users().length === 0) {
        <p style="color:var(--text-muted);padding:20px 0;text-align:center">No users found</p>
      } @else {
        <div style="overflow-x:auto">
          <table class="tbl">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th></tr>
            </thead>
            <tbody>
              @for (u of users(); track u.userId) {
                <tr>
                  <td>#{{ u.userId }}</td>
                  <td>{{ u.name }}</td>
                  <td>{{ u.email }}</td>
                  <td>{{ u.phone }}</td>
                  <td>
                    @switch (u.role) {
                      @case ('ADMIN')    { <span class="badge-danger">ADMIN</span> }
                      @case ('OFFICER')  { <span class="badge-warning">OFFICER</span> }
                      @default           { <span class="badge-info">CUSTOMER</span> }
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
export class UserManagementComponent implements OnInit {
  private api   = inject(ApiService);
  private toast = inject(ToastService);
  users = signal<UserResponse[]>([]);

  ngOnInit() {
    this.api.getAllUsers().subscribe({
      next: u => this.users.set(u),
      error: e => this.toast.error(e.error?.message || 'You are not authorized to do this')
    });
  }
}
