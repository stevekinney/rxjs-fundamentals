# Progressive Data Enhancement

We've all been there. You get some of the base amount of data from on API but you have to hit _another_ API to get everything you need. This should literally be my job description.

Okay, so let's start with the basics.

**Note**: You should do this with the Spotify Data. The the exercise can be doing it with the either the Dog Facts or the pokemon data.

```js
const data$ = fromEvent(search, 'click').pipe(
  map((event) => event.target.value),
  switchMap((name) => fromFetch(endpoint)),
);

data$.subscribe(addResult);
```

Okay, so now we want to get our additional data.

```js
const data$ = fromEvent(search, 'click').pipe(
  map((event) => event.target.value),
  switchMap((name) =>
    fromFetch(endpoint).pipe(
      mergeMap((response) => response.json()),
      mergeMap((pokemon) =>
        endpointFor(pokemon.id).pipe(mergeMap((response) => response.json())),
      ),
    ),
  ),
);

data$.subscribe(addResult);
```

Doing it this way has some problems: You're basically waiting until you get everything. And this is kind of silly because the reason that we're taking on all of this cognitive overhead is because we want to avoid problems like this.

What we want:

- Get me what you have immediately.
- Show it on the page.
- Simultaneously: get the enriched data.
- When you have that, add it to the page.

So, what would this look like?

Here is the example code from that video that I was watching.

```js
const getPokemon = () =>
  fromFetch(endpoint).pipe(mergeMap((response) => response.json()));

const getAdditionalData = () =>
  endpointFor(pokemon.id).pipe(mergeMap((response) => response.json()));

const data$ = fromEvent(search, 'click').pipe(
  map((event) => event.target.value),
  switchMap((name) =>
    getPokemon().pipe(
      switchMap((pokemon) => {
        const pokemon$ = of(pokemon);

        const additionalData$ = getAdditionalData(pokemon.id).pipe(
          map((data) => addDataToPokemon(pokemon, data)),
        );

        return merge(pokemon$, additionalData$);
      }),
    ),
  ),
);

data$.subscribe(addResult);
```

Okay, so there are some issues here as well. You have an issue where if the user rage clicks, then they end up starting this process over and over. For what? There is no new data. This is silly.

As we've seen before, `switchMap` only listens to the last inner observable.

One option: We could switch to `exhaustMap`. This however, will introduce a new issue. What happens if they search for something different?

We could toss in a `takeUntil` on the search field. So, give up once they change. Another option: `distinctUntilChanged`.
