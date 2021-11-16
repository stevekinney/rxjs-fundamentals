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
} from 'rxjs';

import { fromFetch } from 'rxjs/fetch';

import {
  addPokemon,
  clearResults,
  endpoint,
  endpointFor,
  search,
} from './utilities';

const getPokemon = (name) =>
  fromFetch(endpoint + name).pipe(mergeMap((response) => response.json()));

const getAdditionalData = (id) =>
  fromFetch(endpointFor(id)).pipe(mergeMap((response) => response.json()));

const search$ = fromEvent(search, 'input').pipe(
  map((event) => event.target.value),
  switchMap((name) =>
    getPokemon(name).pipe(
      switchMap(({ pokemon }) => {
        const pokemon$ = from(pokemon);

        const additionalData$ = getAdditionalData(pokemon.id).pipe(
          map((data) => addDataToPokemon(pokemon, data)),
        );

        return merge(pokemon$, additionalData$);
      }),
    ),
  ),
);

search$.subscribe(console.log);
