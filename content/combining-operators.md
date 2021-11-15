---
title: Combining Obervables with Operators
layout: layouts/lesson.njk
---

Some operators will subscribe to other observables. `takeUntil` and `skipUntil` are like that.

```js
const startingTime = Date.now();

const firstTimer$ = timer(2000);
const secondTimer$ = timer(7000);

const example$ = interval(1000).pipe(
  skipUntil(firstTimer$),
  takeUntil(secondTimer$),
);

example$.subscribe(() => console.log(Date.now() - startingTime));

// Logs: 2004, 3000, 4000, 5001, 6002
```

<!-- TODO: Use the example playground to create a start and stop button -->

## Exercise: Improving Our Counter

Alright, so we have a few new tricks up our sleeves.

- We know how to create observables that fire at regular intervals using `timer` and `interval`.
- We know how to unsubscribe from an observable.
- We know how to create observables from DOM events using `fromEvent`.

Given the _very_ simple UI in `applications/counter-basic`, can you wire up this simple counter.

It should be able to do the following:

- Hitting the start button should create an `interval` observable that updates the value of the counter.
- Hitting stop should… umm… stop the counter.
