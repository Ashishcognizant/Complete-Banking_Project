import { Injectable, signal } from '@angular/core';

export interface Toast { message: string; type: 'success' | 'error' | 'info'; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: Toast['type'] = 'info') {
    const t: Toast = { message, type };
    this.toasts.update(list => [...list, t]);
    setTimeout(() => this.toasts.update(list => list.filter(x => x !== t)), 4000);
  }

  success(msg: string) { this.show(msg, 'success'); }
  error(msg: string)   { this.show(msg, 'error'); }
  info(msg: string)    { this.show(msg, 'info'); }
}
