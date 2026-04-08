import { Component, inject, output, signal } from '@angular/core';
import { SharedModule } from '../../../shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rules',
  imports: [SharedModule],
  templateUrl: './rules.html',
  styles: ``,
})
export class Rules {
  private router = inject(Router);
  countdown = signal<number | null>(null);

  startCountdown() {
    this.countdown.set(3);
    const interval = setInterval(() => {
      const current = this.countdown();
      if (current !== null && current > 0) {
        this.countdown.set(current - 1);
      } else {
        clearInterval(interval);
        setTimeout(() => this.complete(), 800);
      }
    }, 1000);
  }

  private complete() {
    localStorage.setItem('pictionary_view', 'play');
    this.router.navigate(['/play']);
  }
}
