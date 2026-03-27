import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <span class="auth-logo">🏦</span>
        <h1 class="auth-title">CTS-BANK</h1>
        <p class="auth-sub">Secure Banking Solutions</p>

        <form (ngSubmit)="onLogin()" #f="ngForm">
          <div class="mb-3">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-control" [(ngModel)]="email" name="email"
              required email #emailF="ngModel" placeholder="you@example.com">
            @if (emailF.invalid && emailF.touched) {
              <div class="invalid-msg">Please enter a valid email</div>
            }
          </div>

          <div class="mb-3">
            <label class="form-label">Password</label>
            <div class="input-wrap">
              <input [type]="showPwd() ? 'text' : 'password'" class="form-control"
                [(ngModel)]="password" name="password" required minlength="8"
                #pwdF="ngModel" placeholder="Min. 8 characters">
              <span class="pwd-eye" (click)="showPwd.set(!showPwd())">
                {{ showPwd() ? '🙈' : '👁️' }}
              </span>
            </div>
            @if (pwdF.invalid && pwdF.touched) {
              <div class="invalid-msg">Password must be at least 8 characters</div>
            }
          </div>

          <button type="submit" class="btn-accent w-100 mt-1"
            [disabled]="loading() || f.invalid">
            {{ loading() ? 'Logging in…' : 'Login' }}
          </button>
        </form>

        <p class="text-center mt-3" style="color:var(--text-muted);font-size:.83rem">
          Don't have an account?
          <a routerLink="/register" style="color:var(--accent)">Register here</a>
        </p>
        <p class="text-center mt-2" style="color:var(--text-muted);font-size:.72rem">
          🔒 Protected by BCrypt Encryption
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);
  private toast  = inject(ToastService);

  email    = ''; password = '';
  showPwd  = signal(false);
  loading  = signal(false);

  onLogin() {
    this.loading.set(true);
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.auth.fetchProfile().subscribe({
        next: () => { this.toast.success('Welcome back!'); this.router.navigate(['/dashboard']); },
        error: () => { this.loading.set(false); this.toast.error('Could not load profile'); }
      }),
      error: e => { this.loading.set(false); this.toast.error(e.error?.message || 'Invalid email or password'); }
    });
  }
}
