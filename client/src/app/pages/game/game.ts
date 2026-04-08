import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { SharedModule } from '../../../shared.module';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-game',
  imports: [SharedModule],
  templateUrl: './game.html',
  styles: ``,
})
export class Game implements OnDestroy, OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  private words: string[] = [];
  private usedWords = new Set<string>();
  private interval?: any;

  scores = signal(JSON.parse(localStorage.getItem('p_scores') || '{"t1":0,"t2":0}'));
  turn = signal(Number(localStorage.getItem('p_turn')) || 1);
  timer = signal(60);
  showTransition = signal(false);
  confirmReset = signal(false);
  currentWord = signal('Caricamento...');

  constructor() {
    effect(() => {
      localStorage.setItem('p_scores', JSON.stringify(this.scores()));
      localStorage.setItem('p_turn', this.turn().toString());
    });
  }

  ngOnInit() {
    this.http.get<string[]>('words.json').subscribe(data => {
      this.words = data;
      this.nextWord();
      this.startTimer();
    });
  }

  private startTimer() {
    this.interval = setInterval(() => {
      if (this.timer() > 0 && !this.showTransition()) {
        this.timer.update(v => v - 1);
      } else if (this.timer() === 0 && !this.showTransition()) {
        this.prepareNextTurn();
      }
    }, 1000);
  }

  private nextWord() {
    if (this.usedWords.size === this.words.length) this.usedWords.clear();

    const available = this.words.filter(w => !this.usedWords.has(w));
    const pick = available[Math.floor(Math.random() * available.length)];

    this.usedWords.add(pick);
    this.currentWord.set(pick);
  }

  score() {
    const key = this.turn() === 1 ? 't1' : 't2';
    this.scores.update(s => ({ ...s, [key]: s[key] + 1 }));
    this.nextWord();
  }

  next() {
    this.nextWord();
  }

  prepareNextTurn() {
    this.turn.update(t => t === 1 ? 2 : 1);
    this.showTransition.set(true);
  }

  startTurn() {
    this.timer.set(60);
    this.nextWord();
    this.showTransition.set(false);
  }

  handleReset() {
    if (this.confirmReset()) {
      localStorage.clear();
      this.router.navigate(['/rules']);
    } else {
      this.confirmReset.set(true);
      setTimeout(() => this.confirmReset.set(false), 3000);
    }
  }

  ngOnDestroy() {
    if (this.interval) clearInterval(this.interval);
  }
}