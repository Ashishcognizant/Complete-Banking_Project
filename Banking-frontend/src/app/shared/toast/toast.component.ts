import { Component, inject } from '@angular/core';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  toast = inject(ToastService);
}
