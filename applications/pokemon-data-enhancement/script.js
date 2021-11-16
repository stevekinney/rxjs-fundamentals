import { identity } from 'lodash';
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
  pluck,
  take,
  exhaustMap,
} from 'rxjs';

import { fromFetch } from 'rxjs/fetch';

import {
  renderPokemon,
  clearResults,
  endpoint,
  endpointFor,
  search,
  addDataToPokemon,
  form,
} from '../pokemon/utilities';

const getPokemon = (searchTerm) =>
  fromFetch(endpoint + searchTerm).pipe(
    mergeMap((response) => response.json()),
  );

const getAdditionalData = (pokemon) =>
  fromFetch(endpointFor(pokemon.id)).pipe(
    mergeMap((response) => response.json()),
  );

const search$ = fromEvent(form, 'submit').pipe(
  map(() => search.value),
  exhaustMap((searchTerm) =>
    getPokemon(searchTerm).pipe(
      pluck('pokemon'),
      mergeMap(identity),
      take(1),
      switchMap((pokemon) => {
        const pokemon$ = of(pokemon);

        const additionalData$ = getAdditionalData(pokemon).pipe(
          map((data) => ({ ...pokemon, data })),
        );

        return merge(pokemon$, additionalData$);
      }),
    ),
  ),
  tap(renderPokemon),
);

search$.subscribe(console.log);
