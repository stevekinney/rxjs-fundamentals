---
title: Switch Map
layout: layouts/lesson.njk
---

So, in a previous example. I had those nifty "Start" and "Pause" buttons working. How did I do that? Was I subscribing and unsubscribing between observables?

Nope. (Well, RxJS was under the hood, but I wasn't.) I was using `switchMap` to switch between a stream of values and a stream without values.

I was doing some crazy stuff with multiple streams back then, but we're rendering one stream now. So, let's go ahead and implement a version of this together and then you'll do a similiar example on your own.

## `NEVER`

First, we need to talk about `NEVER`.

This is a pre-baked observable that RxJS gives us. It never emits and and it never completes.

(There is also `EMPTY`, which just immediately completes.)

## Wiring Up the Buttons

We've done this before, but let's try it out again.

```js
const start$ = fromEvent(startButton, 'click').pipe(mapTo(true));
const pause$ = fromEvent(pauseButton, 'click').pipe(mapTo(false));
const isRunning$ = merge(start$, pause$).pipe(startWith(false));

isRunning$.subscribe(setStatus);
```

We now have a boolean that tells us whether or not we should run through our observable or not. Based on the last boolean that comes through the stream, we ant to redirect between our stream and `NEVER`.

That boolean is not going to be the end result. So, let's do our DOM manipulation with a `tap`.

```js
const start$ = fromEvent(startButton, 'click').pipe(mapTo(true));
const pause$ = fromEvent(pauseButton, 'click').pipe(mapTo(false));
const isRunning$ = merge(start$, pause$).pipe(startWith(false), tap(setStatus));

isRunning$.subscribe();
```

## Making Promises

```js
const start$ = fromEvent(startButton, 'click').pipe(mapTo(true));
const pause$ = fromEvent(pauseButton, 'click').pipe(mapTo(false));
const isRunning$ = merge(start$, pause$).pipe(
  startWith(false),
  tap(setStatus),
  switchMap((isRunning) => {
    if (isRunning) {
      return interval(1000).pipe(mergeMap(getCharacter));
    } else {
      return NEVER;
    }
  }),
  tap(render),
);

isRunning$.subscribe();
```

### Picking Up Where We Left Off

What if we refactored our code like this?

```js
const characters$ = interval(1000).pipe(mergeMap(getCharacter));

const start$ = fromEvent(startButton, 'click').pipe(mapTo(true));
const pause$ = fromEvent(pauseButton, 'click').pipe(mapTo(false));
const isRunning$ = merge(start$, pause$).pipe(
  startWith(false),
  tap(setStatus),
  switchMap((isRunning) => (isRunning ? characters$ : NEVER)),
  tap(render),
);
```

We're not making a new observable on the fly. So, it should pick up where it left off right? Well, no. Each subscription is a unique instance of that observable.

If we want to ensure that all subscriptions share the same obsevable, we need to use the `shareReplay()` operator.

```js
const characters$ = interval(1000).pipe(mergeMap(getCharacter), shareReplay(0));

const start$ = fromEvent(startButton, 'click').pipe(mapTo(true));
const pause$ = fromEvent(pauseButton, 'click').pipe(mapTo(false));
const isRunning$ = merge(start$, pause$).pipe(
  startWith(false),
  tap(setStatus),
  switchMap((isRunning) => (isRunning ? characters$ : NEVER)),
  tap(render),
);
```

We'll explore this a little more later.
