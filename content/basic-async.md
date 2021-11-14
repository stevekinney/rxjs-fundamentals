---
title: Basic Async
layout: layouts/lesson.hbs
---

Making API calls is one of most common asynchornous actions that we do in our client-side applications. Naturally, RxJS comes with `fromFetch` to assist us when we're woring with APIs.

```js
import { map } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

fromFetch('https://star-wars-character-search.glitch.me/api/characters')
  .pipe(map((response) => response.json()))
  .subscribe(console.log);
```

But, we need a `switchMap` to actually make things work.

```js
import { switchMap } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

fromFetch('https://star-wars-character-search.glitch.me/api/characters')
  .pipe(switchMap((response) => response.json()))
  .subscribe(console.log);
```

You can propably use a `mergeMap` but, if we're being honest with ourselves, we only want the last one going through the pipe.

We can improve this a little more with some error handling.

```js
import { catchError, of, switchMap } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

fromFetch('https://star-wars-character-search.glitch.me/api/characters')
  .pipe(
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
  )
  .subscribe(console.log);
```

Okay, but what if we wanted to retry?

```js
import { catchError, of, retry, switchMap, tap } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

fromFetch('https://star-wars-character-search.glitch.me/api/characters')
  .pipe(
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
  )
  .subscribe(console.log);
```
