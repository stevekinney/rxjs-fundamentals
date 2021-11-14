# Working with an API: Fetching Pokemon

Okay, let's start with the basics:

```js
import './styles.css';

const form = document.getElementById('fetch-form');
const search = document.getElementById('search');
const submit = document.getElementById('fetch');
const results = document.getElementById('results');

form.addEventListener('submit', (event) => event.preventDefault());
```

We also have some DOM manupulation helpers.

```js
const clearResults = () => (results.innerText = '');
const addResults = (results) => results.forEach(addResult);
const addResult = (result) => {
  const element = document.createElement('article');
  element.innerText = result.name;
  results.appendChild(element);
};
```

Nothing special here, just a bunch of DOM selectors and whatnot.

## Quick Exercise

Ignore the search box for a moment. Can you wire up that "Fetch" button to get us 5 Pokémon to put on the page?

Here is an endpoint for you: `https://rxjs-api.glitch.me/api/pokemon`.

### Quicker Solution

Start small. Just get the response logged to the console.

```js
const fetch$ = fromEvent(form, 'submit').pipe(
  switchMap(() => {
    return fromFetch(endpoint).pipe(mergeMap((response) => response.json()));
  }),
);

fetch$.subscribe(console.log);
```

Cool, now it's your choice as to whether or not you want to put them on the page using `subscribe` or `tap`.

### Pagination

There is that next page token. Could we iterate down the pages?

```js
const endpoint = 'https://rxjs-api.glitch.me/api/pokemon?delay=100';

const getData = (url = endpoint) => {
  return fromFetch(url).pipe(
    mergeMap((response) => response.json()),
    mergeMap((response) => {
      const next$ = response.nextPage
        ? getData(endpoint + '&page=' + response.nextPage)
        : EMPTY;
      return concat(of(response.pokemon), next$);
    }),
    filter(Boolean),
    tap(addResults),
    catchError(console.error),
  );
};

const fetch$ = fromEvent(form, 'submit').pipe(
  switchMap(() => getData(endpoint)),
);

fetch$.subscribe(console.log);
```

**TODO**: Make utility functions for working with query params and whatnot.

## Autocomplete

Let's start by listening to the search field.

```js
const search$ = fromEvent(search, 'input').pipe(
  map((event) => event.target.value),
);

search$.subscribe(console.log);
```

We have a search endpoint: `https://rxjs-api.glitch.me/api/pokemon/search/pika`;

We can start with the simplest example:

```js
const search$ = fromEvent(search, 'input').pipe(
  map((event) => event.target.value),
  mergeMap((searchTerm) =>
    fromFetch(endpoint + searchTerm + '?chaos=5000').pipe(
      mergeMap((response) => response.json()),
    ),
  ),
  tap(clearResults),
  map((response) => response.pokemon),
);
```

Try it out. What's not working? It keeps switching out and reloading pieces.

Do we have any hypotheses here?

Yea, totally… a `switchMap` will work:

```js
const search$ = fromEvent(search, 'input').pipe(
  map((event) => event.target.value),
  switchMap((searchTerm) =>
    fromFetch(endpoint + searchTerm + '?chaos=5000').pipe(
      mergeMap((response) => response.json()),
    ),
  ),
  tap(clearResults),
  map((response) => response.pokemon),
);
```

But we're also firing off a new keystroke every time as well, that seems to be a bit much.

How can we slow that down?

```js
const search$ = fromEvent(search, 'input').pipe(
  debounceTime(300),
  map((event) => event.target.value),
  distinctUntilChanged(),
  switchMap((searchTerm) =>
    fromFetch(endpoint + searchTerm + '?chaos=5000').pipe(
      mergeMap((response) => response.json()),
    ),
  ),
  tap(clearResults),
  map((response) => response.pokemon),
);
```

### Fanning Out Requests

```js
const search$ = fromEvent(search, 'input').pipe(
  debounceTime(300),
  map((event) => event.target.value),
  distinctUntilChanged(),
  switchMap((searchTerm) =>
    fromFetch(endpoint + searchTerm + '?chaos=5000').pipe(
      mergeMap((response) => response.json()),
    ),
  ),
  tap(clearResults),
  mergeMap((response) => response.pokemon),
  mergeMap((pokemon) =>
    fromFetch(individual(pokemon.id)).pipe(
      mergeMap((response) => response.json()),
    ),
  ),
);
```
