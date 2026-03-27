import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { NavbarComponent  } from './navbar.component';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  template: `
    <app-sidebar></app-sidebar>
    <app-navbar></app-navbar>
    <main class="page-content">
      <router-outlet></router-outlet>
    </main>
  `
})
export class LayoutComponent {}
