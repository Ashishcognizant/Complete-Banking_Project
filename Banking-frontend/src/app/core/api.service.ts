import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Account, TransactionRequest, TransactionResponse,
  UserResponse, NotificationResponse, SendNotificationRequest,
  FinancialReportRequest, FinancialReportResponse, TransactionTrendPoint
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly G = 'http://localhost:8090/api';
  constructor(private http: HttpClient) {}

  // ── Accounts ──────────────────────────────────────────────────────────
  getMyAccounts(): Observable<Account[]>                              { return this.http.get<Account[]>(`${this.G}/accounts/my`); }
  getAllAccounts(): Observable<Account[]>                             { return this.http.get<Account[]>(`${this.G}/accounts`); }
  getAccount(id: number): Observable<Account>                        { return this.http.get<Account>(`${this.G}/accounts/${id}`); }
  createAccount(a: Partial<Account>): Observable<Account>            { return this.http.post<Account>(`${this.G}/accounts`, a); }
  updateStatus(id: number, status: string): Observable<Account>      { return this.http.put<Account>(`${this.G}/accounts/${id}/status?status=${status}`, {}); }
  getBalance(id: number): Observable<number>                         { return this.http.get<number>(`${this.G}/accounts/${id}/balance`); }

  // ── Transactions ─────────────────────────────────────────────────────
  deposit(req: TransactionRequest): Observable<TransactionResponse>  { return this.http.post<TransactionResponse>(`${this.G}/transactions/deposit`, req); }
  withdraw(req: TransactionRequest): Observable<TransactionResponse> { return this.http.post<TransactionResponse>(`${this.G}/transactions/withdraw`, req); }
  transfer(req: TransactionRequest): Observable<TransactionResponse> { return this.http.post<TransactionResponse>(`${this.G}/transactions/transfer`, req); }

  // ── Users (Admin) ────────────────────────────────────────────────────
  getAllUsers(): Observable<UserResponse[]>                           { return this.http.get<UserResponse[]>(`${this.G}/users`); }

  // ── Notifications ─────────────────────────────────────────────────────
  getNotifications(uid: number): Observable<NotificationResponse[]>  { return this.http.get<NotificationResponse[]>(`${this.G}/notifications/user/${uid}`); }
  getUnreadCount(uid: number): Observable<number>                    { return this.http.get<number>(`${this.G}/notifications/user/${uid}/unread-count`); }
  markRead(id: number): Observable<NotificationResponse>             { return this.http.put<NotificationResponse>(`${this.G}/notifications/${id}/read`, {}); }
  sendNotification(req: SendNotificationRequest): Observable<NotificationResponse> { return this.http.post<NotificationResponse>(`${this.G}/notifications/admin/send`, req); }

  // ── Analytics ─────────────────────────────────────────────────────────
  generateReport(req: FinancialReportRequest): Observable<FinancialReportResponse>  { return this.http.post<FinancialReportResponse>(`${this.G}/analytics/reports/compliance`, req); }
  getReports(): Observable<FinancialReportResponse[]>                { return this.http.get<FinancialReportResponse[]>(`${this.G}/analytics/reports`); }
  getTrends(from: string, to: string): Observable<TransactionTrendPoint[]> { return this.http.get<TransactionTrendPoint[]>(`${this.G}/analytics/trends?from=${from}&to=${to}`); }
}
