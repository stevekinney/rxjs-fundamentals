---
title: Basic Async (Solution)
layout: layouts/lesson.njk
---

Making API calls is one of most common asynchornous actions that we do in our client-side applications. Naturally, RxJS comes with `fromFetch` to assist us when we're woring with APIs.

```js
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import './playground';

import { fromFetch } from 'rxjs/fetch';

export const example$ = fromFetch('http://localhost:3333/api/pokemon').pipe(
  map((response) => response.json()),
);
```

But, we need a `switchMap` to actually make things work.

```js
import { switchMap } from 'rxjs/operators';
import { fromFetch } from 'rxjs/fetch';

export const example$ = fromFetch('http://localhost:3333/api/pokemon').pipe(
  switchMap((response) => response.json()),
);
```

You can propably use a `mergeMap` but, if we're being honest with ourselves, we only want the last one going through the pipe.

We can improve this a little more with some error handling.

Using a special `flakiness` query parameter will make the API fail for us.

- `flakiness=1` will have it fail all of the time.
- `flakiness=2` will have it fail half of the time.
- `flakiness=3` will have it fail one third of the time.

```js
import { catchError, of, switchMap } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

export const example$ = fromFetch(
  'http://localhost:3333/api/pokemon?flakiness=1',
).pipe(
  switchMap((response) => {
    if (response.ok) {
      return response.json();
    } else {
      return of({ error: true, message: response.status });
    }
  }),
  catchError((error) => {
    console.error(error);
    return of({ error: true, message: error.message });
  }),
);
```

Okay, but what if we wanted to retry?

```js
import { catchError, of, retry, switchMap, tap } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

export const example$ = fromFetch(
  'http://localhost:3333/api/pokemon?flakiness=3',
).pipe(
  tap((x) => console.log('Trying', x)),
  switchMap((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`${response.status}`);
    }
  }),
  retry(5),
  catchError((error) => {
    console.error(error.message);
    return of({ error: true, message: error });
  }),
);
```
