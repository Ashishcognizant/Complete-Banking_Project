import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { ToastService } from '../../core/toast.service';
import { FinancialReportResponse, TransactionTrendPoint } from '../../models/models';

@Component({
  selector: 'app-analytics',
  imports: [FormsModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class AnalyticsComponent implements OnInit {
  private api   = inject(ApiService);
  private toast = inject(ToastService);

  reports      = signal<FinancialReportResponse[]>([]);
  trends       = signal<TransactionTrendPoint[]>([]);
  trendsLoaded = signal(false);
  generating   = signal(false);
  req          = { from: '', to: '', fraudAmountThreshold: undefined as number | undefined };
  trendFrom    = ''; trendTo = '';

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
