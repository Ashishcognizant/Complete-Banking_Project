import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { ToastService } from '../../core/toast.service';
import { UserResponse } from '../../models/models';

@Component({
  selector: 'app-user-management',
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
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
