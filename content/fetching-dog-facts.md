---
title: Fetching from an API
layout: layouts/lesson.njk
---

First, let's make it work with that button, shall we? Let's create a stream out of clicks on that button, shall we?

**Nota bene**: If you're struggling to get your local server up and running, the API is also hosted at <a href="https://rxjs-api.glitch.me/api/facts">https://rxjs-api.glitch.me/api/facts</a>.

```js
const endpoint = 'http://localhost:3333/api/facts';

const fetch$ = fromEvent(fetchButton, 'click').pipe(
  mergeMap(() =>
    fromFetch(endpoint).pipe(mergeMap((response) => response.json())),
  ),
);
```

Great, it works, but this is nothing special.

## Dealing with Chaos

Let's say that there are some "imperfect" network conditions.

```js
const endpoint = 'http://localhost:3333/api/facts?delay=3000&chaos=1';
```

This adds a slight delay and a little bit of randomness to our response times. Go ahead and click on the button a few times. This is mildly annoying in our sample application, but can become a lot worse in a real-world application.

So, how would we deal with that?

The answer to that question ultimately depends on how you want to solve for it. Should the last request win or should we finish what we started in before loading more onto the page?

Since this is just displaying random facts and it's likely—but not guaranteed—that the first request will come back first.

When we worked on the counter, we used `switchMap` to take the latest event from stream. On the flip side, we can use `exhaustMap` to wait until the first observable has completed.

Let's take it for a spin.

```js
const fetch$ = fromEvent(fetchButton, 'click').pipe(
  exhaustMap(() =>
    fromFetch(endpoint).pipe(mergeMap((response) => response.json())),
  ),
);
```

Now, you can slam on that button as many times as you want and it doesn't matter.

You _could_ throttle the clicks, but this is probably a terrible idea. You don't care about a certain amount of time. You care whether or not the last request came back. If it came back super fast, then you don't want to ignore subsequent clicks completely, right?

Here is some code anyway:

```js
const fetch$ = fromEvent(fetchButton, 'click').pipe(
  throttleTime(1000),
  tap(console.log),
  exhaustMap(() =>
    fromFetch(endpoint).pipe(mergeMap((response) => response.json())),
  ),
);
```

### Dealing with Errors

What happens if the request fails?

### Fetching at an Interval

So, what if wanted to refresh this data every so often? (Keep in mind, we're keeping chaos mode turned on, here. So, all of the previous issues will remain.)

Let's start with just a super simple approach that does not involve learning anything new.

```js
const fetch$ = fromEvent(fetchButton, 'click').pipe(
  tap(clearError),
  exhaustMap(() =>
    fromFetch(endpoint).pipe(
      mergeMap((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return of({ error: 'Something went wrong!' });
        }
      }),
    ),
  ),
);

fetch$.subscribe(({ facts, error }) => {
  if (error) {
    return (errorStatus.innerText = error);
  }
  clearFacts();
  facts.forEach(addFact);
});
```

This works in the way that error handling works in Node: we ignore the built in error-handling in JavaScript and just create our own abstraction.

Okay, but like errors can still happen and I should probably teach you what RxJS gives you in order to handle when they do happen.

Also, what if you want to recover from this error?

```js
const fetch$ = fromEvent(fetchButton, 'click').pipe(
  tap(() => clearError()),
  exhaustMap(() =>
    fromFetch(endpoint).pipe(
      mergeMap((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong!');
        }
      }),
      catchError((error) => {
        console.error(error);
        return of({ error: 'The stream caught an error. Cool, right?' });
      }),
    ),
  ),
);
```

### Retrying

Okay, so here is where it gets cool. We can retry a set number of times. So, let's start by breaking out the actual stream of fetching the data from responding to the clicks in our click stream.

```js
const fetchData = () =>
  fromFetch(endpoint).pipe(
    mergeMap((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong!');
      }
    }),
    retry(4),
    catchError((error) => {
      console.error(error);
      return of({ error: 'The stream caught an error. Cool, right?' });
    }),
  );

const fetch$ = fromEvent(fetchButton, 'click').pipe(
  tap(() => clearError()),
  exhaustMap(fetchData),
);
```

Okay, nothing new to see here. Let's keep going.

So, the simplest possible answer is to create a stream that will finish one stream and move on to the next one.

```js
concat(response.json(), fetchData());
```

If we wanted to buy ourselves some time, we can do that too. This is where we harken back to our timer example from before. We know that we can map intervals into other observables.

```js
const fetch$ = fromEvent(fetchButton, 'click').pipe(
  tap(() => clearError()),
  exhaustMap(fetchData),
  switchMap((results) =>
    concat(of(results), interval(5000).pipe(mergeMap(fetchData)), take(1)),
  ),
);
```

So, this is cool. We'll switch over to the latest set of results, but then we'll tack on another request 5 seconds later.

## Pausing the Fetching

We're seen this movie before.

```js
const fetch$ = fromEvent(fetchButton, 'click').pipe(mapTo(true));
const stop$ = fromEvent(stopButton, 'click').pipe(mapTo(false));

const factStream$ = merge(fetch$, stop$).pipe(
  startWith(false),
  switchMap((shouldFetch) => {
    return shouldFetch
      ? timer(0, 5000).pipe(
          tap(() => clearError()),
          tap(() => clearFacts()),
          exhaustMap(fetchData),
        )
      : NEVER;
  }),
);

factStream$.subscribe(addFacts);
```
