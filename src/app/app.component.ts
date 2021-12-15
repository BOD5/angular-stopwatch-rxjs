import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { action$, subscribeToStopwatch, ACTIONS } from 'src/assets/stopwatch';
import { zeroBefore } from 'src/assets/utils';

import { State } from 'src/assets/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnDestroy {
  title = 'App'
  subscription: Subscription | null = null;

  constructor() {
    this.subscription = subscribeToStopwatch(this.time, (v: State) => this.setTimer(v));
  }

  ngOnDestroy(): void {
    if(this.subscription !== null) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
  
  time: number = 0;
  count: boolean = false;
  dbClick: boolean = false;

  setTimer ({ count, value }: State) {
    this.time = value;
    this.count = count;
  }

  start() {
    action$.next(ACTIONS.START);
  }

  wait() {
    if (this.dbClick) {
      action$.next(ACTIONS.WAIT);
      return;
    }
    this.dbClick = true;
    setTimeout(() => {
      this.dbClick = false;
    }, 500);
  }

  reset() {
    action$.next(ACTIONS.RESET);
  }

  displayed(): string {
    const m = Math.floor(this.time / 60);
    const s = (this.time % 60);

    return `${zeroBefore(m)} : ${zeroBefore(s)}`;
  }
}
