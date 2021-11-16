---
title: Progressive Data Enhancement
layout: layouts/lesson.njk
---

We've all been there. You get some of the base amount of data from on API but you have to hit _another_ API to get everything you need. This should literally be my job description.

We only get some simple data about our Pokémon. But, what if we wanted to use the initial data at first and them supplment it later?

```js
const search$ = fromEvent(form, 'submit').pipe(
  map(() => search.value),
  switchMap((searchTerm) =>
    fromFetch(endpoint + searchTerm + '?delay=5000&chaos=true').pipe(
      mergeMap((response) => response.json()),
    ),
  ),
  tap(clearResults),
  pluck('pokemon'),
  mergeMap(identity),
  mergeMap((pokemon) =>
    fromFetch(endpointFor(pokemon.id)).pipe(
      mergeMap((response) => response.json()),
    ),
  ),
  tap(addResult),
);
```

Doing it this way has some problems: You're basically waiting until you get everything. And this is kind of silly because the reason that we're taking on all of this cognitive overhead is because we want to avoid problems like this.

What we want:

- Get me what you have immediately.
- Show it on the page.
- Simultaneously: get the enriched data.
- When you have that, add it to the page.

So, what would this look like?

```js
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
  map((event) => event.target.value),
  switchMap((searchTerm) =>
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
```

Okay, so there are some issues here as well. You have an issue where if the user rage clicks, then they end up starting this process over and over. For what? There is no new data. This is silly.

As we've seen before, `switchMap` only listens to the last inner observable.

One option: We could switch to `exhaustMap`. This however, will introduce a new issue. What happens if they search for something different?

We could toss in a `takeUntil` on the search field. So, give up once they change. Another option: `distinctUntilChanged`.

```js
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
```
