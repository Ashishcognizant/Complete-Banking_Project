import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
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
