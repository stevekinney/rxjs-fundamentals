---
title: Autocomplete
layout: layouts/lesson.njk
---

Let's start by listening to the search field.

```js
const search$ = fromEvent(search, 'input').pipe(
  map((event) => event.target.value),
);

search$.subscribe(console.log);
```

We have a search endpoint: `http://localhost:3333/api/pokemon/search/pika`;

We can start with the simplest example:

```js
const search$ = fromEvent(search, 'input').pipe(
  map((event) => event.target.value),
  mergeMap((searchTerm) =>
    fromFetch(endpoint + searchTerm + '?delay=5000&chaos=true').pipe(
      mergeMap((response) => response.json()),
    ),
  ),
  tap(clearResults),
  map((response) => response.pokemon),
  tap(addResults),
);
```

Try it out. What's not working? It keeps switching out and reloading pieces.

Do we have any hypotheses here?

Yea, totally… a `switchMap` will work:

```js
const search$ = fromEvent(search, 'input').pipe(
  map((event) => event.target.value),
  switchMap((searchTerm) =>
    fromFetch(endpoint + searchTerm + '?delay=5000&chaos=true').pipe(
      mergeMap((response) => response.json()),
    ),
  ),
  tap(clearResults),
  map((response) => response.pokemon),
  tap(addResults),
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
    fromFetch(endpoint + searchTerm + '?delay=5000&chaos=true').pipe(
      mergeMap((response) => response.json()),
    ),
  ),
  tap(clearResults),
  map((response) => response.pokemon),
  tap(addResults),
);
```
