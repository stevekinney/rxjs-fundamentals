import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  mergeMap,
  switchMap,
  tap,
} from 'rxjs';

import { fromFetch } from 'rxjs/fetch';

import {
  addResult,
  clearResults,
  endpoint,
  endpointFor,
  search,
} from './utilities';

const search$ = fromEvent(search, 'input').pipe(
  debounceTime(300),
  map((event) => event.target.value),
  distinctUntilChanged(),
  switchMap((searchTerm) =>
    fromFetch(endpoint + searchTerm + '?chaos=5000').pipe(
      mergeMap((response) => response.json())
    )
  ),
  tap(clearResults),
  mergeMap((response) => response.pokemon),
  mergeMap((pokemon) =>
    fromFetch(endpointFor(pokemon.id)).pipe(
      mergeMap((response) => response.json())
    )
  ),
  tap(console.log)
);

search$.subscribe(addResult);
