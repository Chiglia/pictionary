import { Component, computed, effect, inject, signal } from '@angular/core';
import { SharedModule } from '../../../shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  imports: [SharedModule],
  templateUrl: './game.html',
  styles: ``,
})
export class Game {
  private words = ['Chitarra', 'Elefante', 'Pizza', 'Grattacielo', 'Venezia', 'Internet', 'Dinosauro', 'Zaino'];
  private interval = setInterval(() => this.tick(), 1000);

  router = inject(Router);

  scores = signal(JSON.parse(localStorage.getItem('p_scores') || '{"t1":0,"t2":0}'));
  turn = signal(Number(localStorage.getItem('p_turn')) || 1);
  timer = signal(60);
  index = signal(Math.floor(Math.random() * this.words.length));
  currentWord = computed(() => this.words[this.index()]);

  constructor() {
    effect(() => {
      localStorage.setItem('p_scores', JSON.stringify(this.scores()));
      localStorage.setItem('p_turn', this.turn().toString());
    });
  }

  tick() {
    if (this.timer() > 0) {
      this.timer.update(v => v - 1);
    } else {
      this.switchTurn();
    }
  }

  score() {
    const key = this.turn() === 1 ? 't1' : 't2';
    this.scores.update(s => ({ ...s, [key]: s[key] + 1 }));
    this.next();
  }

  next() {
    this.index.set(Math.floor(Math.random() * this.words.length));
  }

  switchTurn() {
    this.turn.update(t => t === 1 ? 2 : 1);
    this.timer.set(60);
    this.next();
  }

  reset() {
    localStorage.clear();
    this.router.navigate(['/rules'])
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}