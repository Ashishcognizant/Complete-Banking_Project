import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ApiService } from '../../core/api.service';
import { ThemeService } from '../../core/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  auth        = inject(AuthService);
  theme       = inject(ThemeService);
  private api = inject(ApiService);
  open        = signal(false);

  ngOnInit() {
    const uid = this.auth.userId();
    if (uid) this.api.getUnreadCount(uid).subscribe({ next: c => this.auth.unreadCount.set(c), error: () => {} });
  }

  initials(): string {
    return (this.auth.currentUser()?.name || '').split(' ').map((w: string) => w[0]).join('').toUpperCase().substring(0, 2);
  }

  logout() { this.open.set(false); this.auth.logout(); }
}
