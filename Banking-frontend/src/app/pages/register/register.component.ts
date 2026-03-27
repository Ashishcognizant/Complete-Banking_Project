import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card" style="max-width:540px">
        <span class="auth-logo">🏦</span>
        <h1 class="auth-title">CTS-BANK</h1>
        <p class="auth-sub">Create Your Account</p>

        <form (ngSubmit)="onRegister()" #f="ngForm">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-control" [(ngModel)]="d.name" name="name"
                required #nameF="ngModel" placeholder="John Doe">
              @if (nameF.invalid && nameF.touched) {
                <div class="invalid-msg">Name is required</div>
              }
            </div>
            <div class="col-md-6">
              <label class="form-label">Role</label>
              <select class="form-select" [(ngModel)]="d.role" name="role" required #roleF="ngModel">
                <option value="">Select a role</option>
                <option value="CUSTOMER">Customer</option>
                <option value="OFFICER">Officer</option>
                <option value="ADMIN">Admin</option>
              </select>
              @if (roleF.invalid && roleF.touched) {
                <div class="invalid-msg">Role is required</div>
              }
            </div>
            <div class="col-md-6">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-control" [(ngModel)]="d.email" name="email"
                required email #emailF="ngModel" placeholder="you@example.com">
              @if (emailF.invalid && emailF.touched) {
                <div class="invalid-msg">Valid email required</div>
              }
            </div>
            <div class="col-md-6">
              <label class="form-label">Phone (10 digits)</label>
              <input type="text" class="form-control" [(ngModel)]="d.phone" name="phone"
                required minlength="10" maxlength="10" pattern="[0-9]{10}" #phoneF="ngModel"
                placeholder="9876543210">
              @if (phoneF.invalid && phoneF.touched) {
                <div class="invalid-msg">Must be exactly 10 digits</div>
              }
            </div>
            <div class="col-12">
              <label class="form-label">Password</label>
              <input type="password" class="form-control" [(ngModel)]="d.password" name="password"
                required minlength="8" #pwdF="ngModel" placeholder="Minimum 8 characters">
              @if (pwdF.invalid && pwdF.touched) {
                <div class="invalid-msg">Min. 8 characters required</div>
              }
              <div class="pwd-bar-wrap mt-1">
                <div class="pwd-bar"
                  [style.width]="strength() + '%'"
                  [style.background]="strength() > 70 ? 'var(--success)' : strength() > 40 ? 'var(--warning)' : 'var(--danger)'">
                </div>
              </div>
            </div>
          </div>

          <button type="submit" class="btn-accent w-100 mt-3"
            [disabled]="loading() || f.invalid">
            {{ loading() ? 'Creating Account…' : 'Register' }}
          </button>
        </form>

        <p class="text-center mt-3" style="color:var(--text-muted);font-size:.83rem">
          Already have an account?
          <a routerLink="/login" style="color:var(--accent)">Login here</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);
  private toast  = inject(ToastService);

  d = { name: '', role: '', email: '', phone: '', password: '' };
  loading = signal(false);

  strength(): number {
    const p = this.d.password;
    let s = 0;
    if (p.length >= 8)         s += 30;
    if (/[A-Z]/.test(p))       s += 20;
    if (/[0-9]/.test(p))       s += 25;
    if (/[^A-Za-z0-9]/.test(p)) s += 25;
    return s;
  }

  onRegister() {
    this.loading.set(true);
    this.auth.register(this.d).subscribe({
      next: () => { this.toast.success('Registered! Please login.'); this.router.navigate(['/login']); },
      error: e => { this.loading.set(false); this.toast.error(e.error?.message || 'Registration failed'); }
    });
  }
}
