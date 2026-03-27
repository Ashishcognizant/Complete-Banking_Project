import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse, UserResponse, UpdateUserRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:8090/api';
  private _user = signal<UserResponse | null>(null);
  unreadCount = signal(0);

  readonly currentUser = this._user.asReadonly();
  readonly isLoggedIn   = computed(() => !!this.token);
  readonly isAdmin      = computed(() => this._user()?.role === 'ADMIN');
  readonly isOfficer    = computed(() => this._user()?.role === 'OFFICER');
  readonly isCustomer   = computed(() => this._user()?.role === 'CUSTOMER');
  readonly canAnalytics = computed(() => this.isAdmin() || this.isOfficer());
  readonly userId       = computed(() => this._user()?.userId ?? 0);

  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (!this.isBrowser) return;
    const stored = localStorage.getItem('cts_user');
    if (stored) this._user.set(JSON.parse(stored));
  }

  get token(): string | null {
    return this.isBrowser ? localStorage.getItem('cts_token') : null;
  }

  register(req: RegisterRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.API}/auth/register`, req);
  }

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/auth/login`, req).pipe(
      tap(res => { if (this.isBrowser) localStorage.setItem('cts_token', res.accessToken); })
    );
  }

  fetchProfile(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API}/users/me`).pipe(
      tap(u => { if (this.isBrowser) localStorage.setItem('cts_user', JSON.stringify(u)); this._user.set(u); })
    );
  }

  updateProfile(req: UpdateUserRequest): Observable<UserResponse> {
    return this.http.patch<UserResponse>(`${this.API}/users/me`, req).pipe(
      tap(u => { if (this.isBrowser) localStorage.setItem('cts_user', JSON.stringify(u)); this._user.set(u); })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('cts_token');
      localStorage.removeItem('cts_user');
    }
    this._user.set(null);
    this.router.navigate(['/login']);
  }
}
