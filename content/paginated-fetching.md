---
title: Pagination
layout: layouts/lesson.njk
---

Here is a quick bonus recipe that I'm throwing into the mix because I literally needed to use it the other day. But, also I think it demonstrates a time when we might use `concat` and it's also our first appearance of `EMPTY`.

So, that Pokémon API. There is that next page token. Could we iterate down the pages?

```js
const endpoint = 'http://localhost:3333/api/pokemon?delay=100';

export const example$ = (url = endpoint) => {
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
