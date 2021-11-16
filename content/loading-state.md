---
title: Loading State
layout: layouts/lesson.njk
---

Let's start with something simple to validate that everything works.

```js
const loading$ = fromEvent(form, 'submit').pipe(tap(() => showLoading(true)));
```

`fetchData` is a fake API call that lasts about as long as we say it should in that input field.

```js
const loading$ = fromEvent(form, 'submit').pipe(
  tap(() => showLoading(true)),
  exhaustMap(() => fetchData()),
  tap(() => showLoading(false)),
);
```

Now, we're showing the loading field and cleaning up after ourselves when it's done.

But, we want to delay that loading indicator, right?

```js
const showSpinner$ = of(true).pipe(
  delay(+showLoadingAfterField.value),
  tap(() => showLoading(true)),
);

const hideSpinner$ = of(true).pipe(tap(() => showLoading(false)));

const loading$ = fromEvent(form, 'submit').pipe(
  exhaustMap(() => concat(showSpinner$, fetchData(), hideSpinner$)),
);
```

Well, this has some problems, we don't even start fetching the data until after we show the loading indicator.

We can improve this by racing the data against the start time for the loading indicator.

```js
const loading$ = fromEvent(form, 'submit').pipe(
  exhaustMap(() => {
    const data$ = fetchData();
    const dataOrSpinner$ = race(showSpinner$, data$);
    return concat(dataOrSpinner$, data$, hideSpinner$);
  }),
);
```

If you look closely at the console, you'll see we fetch the data twice. Once for the race and once to actually get the data. This is because each subscription gets a fresh copy of the observsble.

There is an operator called `share` that allows us to share once instance between two subscriptions.

```js
const loading$ = fromEvent(form, 'submit').pipe(
  exhaustMap(() => {
    const data$ = fetchData().pipe(share());
    const dataOrSpinner$ = race(showSpinner$, data$);
    return concat(dataOrSpinner$, data$, hideSpinner$);
  }),
);
```

## Completed

```js
const loading$ = fromEvent(form, 'submit').pipe(
  exhaustMap(() => {
    const data$ = fetchData().pipe(shareReplay(1));

    const showSpinner$ = of(true).pipe(
      delay(+showLoadingAfterField.value),
      tap(() => showLoading(true)),
    );

    const hideSpinner$ = timer(+showLoadingForAtLeastField.value).pipe(first());

    const spinner$ = concat(
      showSpinner$,
      hideSpinner$,
      data$.pipe(tap(() => showLoading(false))),
    );

    return race(data$, spinner$);
  }),
);
```
