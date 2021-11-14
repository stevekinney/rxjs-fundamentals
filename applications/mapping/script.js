import { of, from, interval, fromEvent, merge, NEVER } from 'rxjs';
import {
  map,
  mapTo,
  mergeAll,
  mergeMap,
  delay,
  take,
  concatMap,
  switchMap,
  exhaustMap,
  combineLatestAll,
  startWith,
  endWith,
  pluck,
  tap,
  share,
  shareReplay,
} from 'rxjs/operators';

import {
  getCharacter,
  render,
  startButton,
  pauseButton,
  clearButton,
  setStatus,
} from './utilities';

const characters$ = interval(1000).pipe(mergeMap(getCharacter), shareReplay(0));

const start$ = fromEvent(startButton, 'click').pipe(mapTo(true));
const pause$ = fromEvent(pauseButton, 'click').pipe(mapTo(false));
const isRunning$ = merge(start$, pause$).pipe(
  startWith(false),
  tap(setStatus),
  switchMap((isRunning) => (isRunning ? characters$ : NEVER)),
  tap(render),
);

isRunning$.subscribe();

// const character$ = from(getCharacter(1)).pipe(pluck('name'));

// character$.subscribe(render);
