import { interval, NEVER, scan, startWith, Subject, switchMap, tap, Observable } from 'rxjs';
import { State } from './types';

export const ACTIONS = {
  START: 'start',
  WAIT: 'wait',
  RESET: 'reset',
}

export const action$ = new Subject();

export const counter = new Observable(function subscribe(observer) {
  var intervalID = setInterval(() => {
    observer.next(1);
  }, 1000);
  return function unsubscribe() {
    clearInterval(intervalID);
  };
});


export const subscribeToStopwatch = (value: number = 0, setFunction: Function) => {
  const stopwtch$ = action$.pipe(
    scan((state, action): State => {
      let newVal;
      if (action === ACTIONS.START) {
        newVal = (state.count) ? { count: false, value: 0 } : { count: true };
      }
      if (action === ACTIONS.WAIT) {
        newVal = { count: false };
      }
      if (action === ACTIONS.RESET) {
        newVal = { count: true, value: 0 };
      }
      return { ...state, ...newVal };
    }, { count: false, value: value | 0 } as State),
    tap((state: State) => setFunction(state)),
    switchMap((state: State) => 
      state.count
        ? interval(1000)
          .pipe(
            tap(_ => state.value += 1),
            tap(_ => setFunction(state)),
          )
        : NEVER)
  );
  return stopwtch$.subscribe();
}
