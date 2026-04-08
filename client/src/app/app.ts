import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styles: [],
})
export class App {
  private router = inject(Router);

  constructor() {
    effect(() => {
      const path = this.router.url.replace('/', '');
      if (path) localStorage.setItem('pictionary_view', path);
    });
  }
}
