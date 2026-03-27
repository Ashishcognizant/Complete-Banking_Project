import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  isDark = signal(true);

  constructor() {
    if (this.isBrowser) {
      const saved = localStorage.getItem('cts_theme');
      const dark = saved ? saved === 'dark' : true;
      this.isDark.set(dark);
      this.apply(dark);
    }
  }

  toggle() {
    const dark = !this.isDark();
    this.isDark.set(dark);
    if (this.isBrowser) {
      localStorage.setItem('cts_theme', dark ? 'dark' : 'light');
      this.apply(dark);
    }
  }

  private apply(dark: boolean) {
    document.body.classList.toggle('light', !dark);
  }
}
