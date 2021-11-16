---
title: Merging Timelines (Follow Along)
layout: layouts/lesson.njk
---

We're going to get a bit meta here for a moment and we're going to build the tooling that we're going to use to explore some of the functions for combining observables.

- We're going to create two observables
  - One for the start button.
  - One for the clear button.
- We'll merge those two observables into one stream.
- When the user clicks "Start", `true` will be passed into the stream.
- When the user clicks "Clear", `false` will be passed into the stream.
- We'll use a new operator called `startWith` to pass an initial value through the stream.

It will look something like this:

```js
const start$ = fromEvent(startButton, 'click').pipe(mapTo(true));
const clear$ = fromEvent(clearButton, 'click').pipe(mapTo(false));

const isRunning$ = merge(start$, clear$).pipe(startWith(false));

isRunning$.subscribe(setStatus);
```

With that in place, let's experiment with some of the operators for merging streams.

`bootstrap` is an observable that I wrote to help us visualize what's going. It's using concepts from this section and one the after it. We'll build a simplified version of it later, but for now, let's just take it for granted. The utility takes three functions and renders elements to the page.

Let's make a simplified version of it for now.

```js
const first$ = interval(1000).pipe(map(labelWith('First')), take(4));
const second$ = interval(1000).pipe(map(labelWith('Second')), take(4));
const combined$ = interval(1000).pipe(map(labelWith('Combined')), take(4));

bootstrap({ first$, second$, combined$ });
```

`combined$` isn't combining much of anything at this point. Let's fix that.

**Quick tasting note**: The first and second columns are their own instances of each subscription independent of the combined observable.

## `merge`

We got a taste of `merge` above. It will simply combine multiple observables. As each child observable emits, so does the merged observable.

```js
const first$ = interval(1000).pipe(map(labelWith('First')), take(4));
const second$ = interval(1000).pipe(map(labelWith('Second')), take(4));
const combined$ = merge(first$, second$);
```

We can play around with the times a bit and see that combined basically mirrors each observable.

## `concat`

`concat` plays through each observable it has been given in order. It will work through `first$` and then it will play through `next$`.

```js
const first$ = interval(1000).pipe(map(labelWith('First')), take(4));
const second$ = interval(1000).pipe(map(labelWith('Second')), take(4));
const combined$ = concat(first$, second$);
```

## `race`

`race` takes multiple observables and just goes with whatever one emits a value first and then ignores all of the rest of the,

In this case, `first$` will emit—umm—first and win the race.

```js
const first$ = interval(500).pipe(map(labelWith('First')), take(4));
const second$ = interval(1000).pipe(map(labelWith('Second')), take(4));
const combined$ = race(first$, second$);
```

But, you can see if we flip the timers, then we'll get the opposite effect.

```js
const first$ = interval(1000).pipe(map(labelWith('First')), take(4));
const second$ = interval(500).pipe(map(labelWith('Second')), take(4));
const combined$ = race(first$, second$);
```

## `forkJoin`

`forkJoin` ignores all of the values until everything is done and then will get you the last value of each.

```js
const first$ = interval(1000).pipe(map(labelWith('First')), take(4));
const second$ = interval(500).pipe(map(labelWith('Second')), take(4));
const combined$ = forkJoin(first$, second$);
```

## Final Code

```js
import { fromEvent, merge, interval, concat, race, forkJoin } from 'rxjs';
import { mapTo, startWith, take, map } from 'rxjs/operators';
import { labelWith } from './utilities';

import { startButton, pauseButton, setStatus, bootstrap } from './utilities';

const start$ = fromEvent(startButton, 'click').pipe(mapTo(true));
const clear$ = fromEvent(pauseButton, 'click').pipe(mapTo(false));

const isRunning$ = merge(start$, clear$).pipe(startWith(false));

isRunning$.subscribe(setStatus);

const first$ = interval(1000).pipe(map(labelWith('First')), take(4));
const second$ = interval(1000).pipe(map(labelWith('Second')), take(4));
const combined$ = merge(first$, second$);

bootstrap({ first$, second$, combined$ });
```
