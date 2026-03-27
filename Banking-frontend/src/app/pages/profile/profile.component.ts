import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';
import { UpdateUserRequest } from '../../models/models';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  auth          = inject(AuthService);
  private toast = inject(ToastService);

  d: UpdateUserRequest = {};
  loading = signal(false);

  initials(): string {
    return (this.auth.currentUser()?.name || '').split(' ').map((w: string) => w[0]).join('').toUpperCase().substring(0, 2);
  }

  onUpdate() {
    const req: UpdateUserRequest = {};
    if (this.d.name?.trim())     req.name     = this.d.name.trim();
    if (this.d.email?.trim())    req.email    = this.d.email.trim();
    if (this.d.phone?.trim())    req.phone    = this.d.phone.trim();
    if (this.d.password?.trim()) req.password = this.d.password.trim();
    if (!Object.keys(req).length) { this.toast.info('Nothing changed'); return; }

    this.loading.set(true);
    this.auth.updateProfile(req).subscribe({
      next: () => { this.toast.success('Profile updated!'); this.loading.set(false); this.d = {}; },
      error: e => { this.toast.error(e.error?.message || 'Update failed'); this.loading.set(false); }
    });
  }
}
