import { Component, inject } from '@angular/core';
import { ToastService } from '../core/toast.service';

@Component({
  selector: 'app-toast',
  imports: [],
  template: `
    <div class="toast-host">
      @for (t of toast.toasts(); track t) {
        <div class="toast-msg" [class]="'toast-' + t.type">
          @switch (t.type) {
            @case ('success') { ✅ }
            @case ('error')   { ❌ }
            @default          { ℹ️ }
          }
          {{ t.message }}
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toast = inject(ToastService);
}
