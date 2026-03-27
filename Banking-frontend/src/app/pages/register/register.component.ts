import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';
import { ThemeService } from '../../core/theme.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);
  private toast  = inject(ToastService);
  theme          = inject(ThemeService);

  d = { name: '', role: '', email: '', phone: '', password: '' };
  loading = signal(false);

  strength(): number {
    const p = this.d.password;
    let s = 0;
    if (p.length >= 8)          s += 30;
    if (/[A-Z]/.test(p))        s += 20;
    if (/[0-9]/.test(p))        s += 25;
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
