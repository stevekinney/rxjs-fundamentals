import { of, from, interval, fromEvent, merge, NEVER } from 'rxjs';
import {
  pluck,
  concatMap,
  take,
  map,
  combineLatestAll,
  startWith,
} from 'rxjs/operators';

import {
  getCharacter,
  render,
  startButton,
  pauseButton,
  setStatus,
} from './utilities';

// const example$ = of('John', 'Paul', 'George', 'Ringo').pipe(
//   exhaustMap((beatle, index) =>
//     interval(index * 1000).pipe(
//       take(4),
//       map((i) => `${beatle} ${i}`),
//     ),
//   ),
// );

const example$ = of('John', 'Paul', 'George', 'Ringo').pipe(
  map((beatle, index) =>
    interval(index * 1000).pipe(
      startWith('(Not Started)'),
      take(5),
      map((i) => `${beatle} ${i}`),
    ),
  ),
  combineLatestAll(),
);

example$.subscribe(render);
