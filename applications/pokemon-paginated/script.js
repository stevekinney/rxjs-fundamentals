import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  mergeMap,
  switchMap,
  tap,
  of,
  merge,
  from,
  filter,
  catchError,
  concat,
  take,
  EMPTY,
  retry,
  pluck,
  concatMap,
} from 'rxjs';

import { fromFetch } from 'rxjs/fetch';

import {
  addResults,
  addResult,
  clearResults,
  endpointFor,
  search,
  form,
} from '../pokemon/utilities';

const endpoint = 'http://localhost:3333/api/pokemon?delay=100';

export const getData = (url = endpoint) => {
  return fromFetch(url).pipe(
    mergeMap((response) => response.json()),
    mergeMap((response) => {
      const next$ = response.nextPage
        ? getData(endpoint + '&page=' + response.nextPage)
        : EMPTY;
      return concat(of(response.pokemon), next$);
    }),
    tap(console.log),
    filter(Boolean),
    tap(addResults),
    catchError((error) => {
      console.error(error);
      return EMPTY;
    }),
  );
};

const fetch$ = fromEvent(form, 'submit').pipe(
  switchMap(() => getData(endpoint)),
);

fetch$.subscribe();
