import { fromEvent, of, timer, merge, NEVER } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import {
  catchError,
  exhaustMap,
  mapTo,
  mergeMap,
  retry,
  startWith,
  switchMap,
  tap,
  pluck,
} from 'rxjs/operators';

import {
  fetchButton,
  stopButton,
  clearError,
  clearFacts,
  addFacts,
  setError,
} from '../dog-facts/utilities';

const endpoint = 'http://localhost:3333/api/facts';

const fetchData = () =>
  fromFetch(endpoint).pipe(
    mergeMap((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong!');
      }
    }),
    tap(console.log),
    retry(4),
    catchError((error) => {
      console.error(error);
      return of({ error: 'The stream caught an error. Cool, right?' });
    }),
  );

const fetch$ = fromEvent(fetchButton, 'click').pipe(mapTo(true));
const stop$ = fromEvent(stopButton, 'click').pipe(mapTo(false));

const factStream$ = merge(fetch$, stop$).pipe(
  startWith(false),
  switchMap((shouldFetch) => {
    return shouldFetch
      ? timer(0, 5000).pipe(
          tap(() => clearError()),
          tap(() => clearFacts()),
          exhaustMap(fetchData),
        )
      : NEVER;
  }),
);

factStream$.subscribe(addFacts);
