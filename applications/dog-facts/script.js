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
} from 'rxjs/operators';

import {
  fetchButton,
  endpoint,
  stopButton,
  clearError,
  clearFacts,
  addFact,
  setError,
} from './utilities';

const fetchData = () =>
  fromFetch(endpoint).pipe(
    tap(() => console.log('Let us try', Date.now())),
    mergeMap((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong!');
      }
    }),
    retry(4),
    catchError((error) => {
      console.error(error);
      return of({ error: 'The stream caught an error. Cool, right?' });
    }),
  );

const start$ = fromEvent(fetchButton, 'click').pipe(mapTo(true));
const stop$ = fromEvent(stopButton, 'click').pipe(mapTo(false));

const factStream$ = merge(start$, stop$).pipe(
  startWith(false),
  switchMap((shouldFetch) => {
    return shouldFetch
      ? timer(0, 5000).pipe(
          tap(() => clearError()),
          exhaustMap(fetchData),
        )
      : NEVER;
  }),
);

factStream$.subscribe(({ facts, error }) => {
  if (error) return setError(error);
  clearFacts();
  facts.forEach(addFact);
});
