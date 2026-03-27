import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';
import { UpdateUserRequest } from '../../models/models';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  template: `
    <h1 class="section-title">Profile Settings</h1>
    <p class="section-sub">Update your personal information (role cannot be changed)</p>

    <div class="glass-card" style="max-width:560px">
      <div class="mb-3 p-3" style="background:var(--surface);border-radius:10px;display:flex;align-items:center;gap:14px">
        <div style="width:50px;height:50px;border-radius:14px;background:linear-gradient(135deg,var(--accent),var(--accent-dark));display:flex;align-items:center;justify-content:center;color:var(--primary);font-weight:800;font-size:1.1rem">
          {{ initials() }}
        </div>
        <div>
          <div style="font-weight:600;font-size:1rem">{{ auth.currentUser()?.name }}</div>
          <span class="badge-accent">{{ auth.currentUser()?.role }}</span>
        </div>
      </div>

      <form (ngSubmit)="onUpdate()" #f="ngForm">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-control" [(ngModel)]="d.name" name="name"
              [placeholder]="auth.currentUser()?.name ?? ''">
          </div>
          <div class="col-md-6">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-control" [(ngModel)]="d.email" name="email" #emailF="ngModel"
              [placeholder]="auth.currentUser()?.email ?? ''">
            @if (emailF.invalid && emailF.touched) {
              <div class="invalid-msg">Enter a valid email</div>
            }
          </div>
          <div class="col-md-6">
            <label class="form-label">Phone Number</label>
            <input type="text" class="form-control" [(ngModel)]="d.phone" name="phone"
              minlength="10" maxlength="10" pattern="[0-9]{10}" #phoneF="ngModel"
              [placeholder]="auth.currentUser()?.phone ?? ''">
            @if (phoneF.invalid && phoneF.touched) {
              <div class="invalid-msg">Must be exactly 10 digits</div>
            }
          </div>
          <div class="col-md-6">
            <label class="form-label">New Password</label>
            <input type="password" class="form-control" [(ngModel)]="d.password" name="password"
              minlength="8" placeholder="Leave blank to keep current">
          </div>
        </div>
        <button type="submit" class="btn-accent w-100 mt-3" [disabled]="loading()">
          {{ loading() ? 'Saving…' : 'Save Changes' }}
        </button>
      </form>
    </div>
  `
})
export class ProfileComponent {
  auth    = inject(AuthService);
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
