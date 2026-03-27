import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  template: `
    <app-toast></app-toast>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class App {}
