import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { ToastService } from '../../core/toast.service';
import { FinancialReportResponse, TransactionTrendPoint } from '../../models/models';

@Component({
  selector: 'app-analytics',
  imports: [FormsModule],
  template: `
    <h1 class="section-title">Financial Analytics</h1>
    <p class="section-sub">Admin & Officer access — compliance reports and transaction trends</p>

    <!-- Generate Report -->
    <div class="glass-card mb-4">
      <h3 style="font-size:.95rem;font-weight:700;color:var(--accent);margin-bottom:16px">Generate Compliance Report</h3>
      <form (ngSubmit)="generate()" class="row g-3 align-items-end">
        <div class="col-md-4">
          <label class="form-label">From (date-time)</label>
          <input type="datetime-local" class="form-control" [(ngModel)]="req.from" name="from" required>
        </div>
        <div class="col-md-4">
          <label class="form-label">To (date-time)</label>
          <input type="datetime-local" class="form-control" [(ngModel)]="req.to" name="to" required>
        </div>
        <div class="col-md-2">
          <label class="form-label">Fraud Threshold (₹)</label>
          <input type="number" class="form-control" [(ngModel)]="req.fraudAmountThreshold" name="thresh" placeholder="Optional">
        </div>
        <div class="col-md-2">
          <button type="submit" class="btn-accent w-100" [disabled]="generating()">
            {{ generating() ? 'Generating…' : 'Generate' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Trends -->
    <div class="glass-card mb-4">
      <h3 style="font-size:.95rem;font-weight:700;color:var(--accent);margin-bottom:16px">Transaction Trends</h3>
      <form (ngSubmit)="loadTrends()" class="row g-3 align-items-end mb-3">
        <div class="col-md-4">
          <label class="form-label">From Date</label>
          <input type="date" class="form-control" [(ngModel)]="trendFrom" name="tf" required>
        </div>
        <div class="col-md-4">
          <label class="form-label">To Date</label>
          <input type="date" class="form-control" [(ngModel)]="trendTo" name="tt" required>
        </div>
        <div class="col-md-2">
          <button type="submit" class="btn-outline w-100">Load</button>
        </div>
      </form>
      @if (trends().length > 0) {
        <div style="overflow-x:auto">
          <table class="tbl">
            <thead><tr><th>Date</th><th>Transactions</th><th>Deposits</th><th>Withdrawals</th><th>Transfers</th><th>Total Amount</th></tr></thead>
            <tbody>
              @for (t of trends(); track t.date) {
                <tr>
                  <td>{{ t.date }}</td>
                  <td>{{ t.count }}</td>
                  <td><span class="badge-success">{{ t.deposits || 0 }}</span></td>
                  <td><span class="badge-danger">{{ t.withdrawals || 0 }}</span></td>
                  <td><span class="badge-accent">{{ t.transfers || 0 }}</span></td>
                  <td>₹{{ t.totalAmount?.toFixed(2) }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else if (trendsLoaded()) {
        <p style="color:var(--text-muted);font-size:.88rem;padding:10px 0">No trend data found for this period</p>
      }
    </div>

    <!-- Reports -->
    <div class="glass-card">
      <h3 style="font-size:.95rem;font-weight:700;color:var(--accent);margin-bottom:16px">All Compliance Reports</h3>
      @if (reports().length === 0) {
        <p style="color:var(--text-muted);font-size:.88rem;padding:10px 0">No reports generated yet</p>
      } @else {
        <div style="overflow-x:auto">
          <table class="tbl">
            <thead><tr><th>ID</th><th>Period</th><th>Transactions</th><th>Amount</th><th>Fraud Alerts</th><th>Generated</th></tr></thead>
            <tbody>
              @for (r of reports(); track r.reportId) {
                <tr>
                  <td>#{{ r.reportId }}</td>
                  <td style="font-size:.8rem">{{ r.period }}</td>
                  <td>{{ r.totalTransactions }}</td>
                  <td>₹{{ r.totalAmount?.toFixed(2) }}</td>
                  <td>
                    <span [class]="r.fraudAlerts > 0 ? 'badge-danger' : 'badge-success'">{{ r.fraudAlerts }}</span>
                  </td>
                  <td style="font-size:.8rem">{{ r.generatedAt }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `
})
export class AnalyticsComponent implements OnInit {
  private api   = inject(ApiService);
  private toast = inject(ToastService);

  reports     = signal<FinancialReportResponse[]>([]);
  trends      = signal<TransactionTrendPoint[]>([]);
  trendsLoaded = signal(false);
  generating  = signal(false);
  req         = { from: '', to: '', fraudAmountThreshold: undefined as number | undefined };
  trendFrom   = ''; trendTo = '';

  ngOnInit() {
    this.api.getReports().subscribe({ next: r => this.reports.set(r), error: e => this.toast.error(e.error?.message || 'Access denied') });
  }

  generate() {
    this.generating.set(true);
    this.api.generateReport(this.req as any).subscribe({
      next: r => { this.reports.update(list => [r, ...list]); this.toast.success('Report generated!'); this.generating.set(false); },
      error: e => { this.toast.error(e.error?.message || 'Failed'); this.generating.set(false); }
    });
  }

  loadTrends() {
    this.api.getTrends(this.trendFrom, this.trendTo).subscribe({
      next: t => { this.trends.set(t); this.trendsLoaded.set(true); },
      error: e => this.toast.error(e.error?.message || 'Failed to load trends')
    });
  }
}
