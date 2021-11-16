---
title: Counter (Follow Along)
layout: layouts/lesson.njk
---

If the purpose of using RxJS is to play around with time, then it makes sense to kick the tires on it by building a simple timer, right? Well, I think so anyway.

We're start by selecting all of the elements on the page.

```js
const count = document.getElementById('count');
const start = document.getElementById('start');
const pause = document.getElementById('pause');
const setTo = document.getElementById('set');
const setToAmount = document.getElementById('set-amount');
const reset = document.getElementById('reset');
const countUp = document.getElementById('count-up');
const countDown = document.getElementById('count-down');
```

Okay, let's start with the most naive version of any of this.

```js
interval(1000).subscribe((value) => (count.value = value));
```

This will iterate our value and I guess it's technically a counter. But you can't start it, stop it or reset it. But, it's using RxJS and it's a start—so, we'll take it.

Okay, so what if we wanted to at least get the start button working?

Well, what we can do here is we can start our interval stream, but basically just ignore it until we get literally anything emitted from a stream attached to the start button.

```js
const start$ = fromEvent(start, 'click');

const counter$ = interval(1000).pipe(skipUntil(start$));

counter$.subscribe((value) => (count.value = value));
```

This implementation _also_ has a problem: the `interval` stream is ticking upwards, with a new integer every second, but we're just ignoring them. This means that when we finally do start our timer, it's going to pick up from whatever tick the `interval` stream was on.

Rather than rely on whatever interval thinks the current count is, we can just take the values that make it through our stream and count those.

**Quick Exercise**: Can you have the stream go back to ignoring values once the _pause_ button has been pressed?

Here is a possible solution.

```js
const start$ = fromEvent(start, 'click');
const pause$ = fromEvent(pause, 'click');

const counter$ = interval(1000).pipe(
  skipUntil(start$),
  scan((total) => total + 1, 0),
  takeUntil(pause$),
);
```

Okay, so this works for a single use timer. But we basically only start it once and we can only pause it once.

For an extra fun bonus, if you pause the counter before you start it, you'll ever turn on because you already told it to no longer listen to values emitted from the interval.

## Adding State

So, what we could do is something similiar to what might do in React. We could hold onto an object that stores the current value and whether or not we're actively iterating.

There are a bunch of ways we could tackle this. Let's try something simple.

The wrong answer is always be tossing variables in the global scope to store state.

```ts
type CounterState = {
  value: number;
  isActive: boolean;
};
```

Before we actually solve the issue we had earlier, let's get it working with this new concept of state.

Let's start with mapping our events to payloads of data that we can use in our stream.

```js
const start$ = fromEvent(start, 'click').pipe(mapTo({ isActive: true }));
const pause$ = fromEvent(pause, 'click').pipe(mapTo({ isActive: false }));
```

I'll just say this now: If this is feeling a little bit like Redux to you, then you're probably not totally off the mark. And, if you're lucky, we'll tie this into Redux later as well.

## Merging Multiple Streams

When we used `takeUntil` and `skipUntil` we subscribed to to `start$` and `pause$`, but we weren't exactly using their values anywhere. But, now we want to bring their mapped values into the stream as well.

This means we're going to need to _merge_ them in with ticks coming from the `interval(1000)` stream.

We'll deal with the interval again in a moment, but let's merge together the events coming from our two buttons.

```js
const counter$ = merge(start$, pause$).pipe(
  startWith({ value: 0, isActive: false }),
  scan((state, payload) => ({ ...state, ...payload }), {}),
  tap(console.log), // Allows for side effects
);
```

If you press the two buttons, you'll see that we can set the counter is active and inactive states, even if we're removed the actually incrementing of the number for now.

## Making a Quick Reducer

This isn't going to be our final answer for this but it does present a fairly interesting pattern for us. Could we do something similar to what we might do in Redux.

Hear me out:

- What if we mapped the start and pause buttons to actions?
- What if interval also was mapped to an action?
- In `scan` could we update the state based on the action?

Let's try it out.

The first and somewhat obvious thing to do is to update the values emitted from our buttons.

```js
const start$ = fromEvent(start, 'click').pipe(mapTo({ type: 'START' }));
const pause$ = fromEvent(pause, 'click').pipe(mapTo({ type: 'PAUSE' }));
```

We could then do something like this:

```js
const start$ = fromEvent(start, 'click').pipe(mapTo({ type: 'START' }));
const pause$ = fromEvent(pause, 'click').pipe(mapTo({ type: 'PAUSE' }));

const counter$ = merge(start$, pause$).pipe(
  scan(
    (state, action) => {
      if (action.type === 'START') return { ...state, isActive: true };
      if (action.type === 'PAUSE') return { ...state, isActive: false };
    },
    { value: 0, isActive: false },
  ),
  tap(console.log),
);
```

**Quick Exercise**: Okay, can you map the interval to an action and update the state accordingly?

Solution:

```js
const start$ = fromEvent(start, 'click').pipe(mapTo({ type: 'START' }));
const pause$ = fromEvent(pause, 'click').pipe(mapTo({ type: 'PAUSE' }));
const interval$ = interval(1000).pipe(mapTo({ type: 'INCREMENT' }));

const counter$ = merge(interval$, start$, pause$).pipe(
  scan(
    (state, action) => {
      if (action.type === 'START') return { ...state, isActive: true };
      if (action.type === 'PAUSE') return { ...state, isActive: false };
      if (action.type === 'INCREMENT' && state.isActive) {
        return { ...state, value: state.value + 1 };
      }
      return state;
    },
    { value: 0, isActive: false },
  ),
  tap(console.log),
);
```

There are a bunch of things that I don't like about this solution. I don't like that we're ticking all of the time, regardless of whether or not we even want to update the counter. This feels wasteful and probably won't scale in a more complex example.

We had perfectly good ticking going on previously.

Okay, so what about this: What if we did a little bit of stream inception.

- Merge together a stream of events coming from the start and pause buttons.
- Switch between a stream that emits a new value at every interval and one that just never emits anything ever.

## Solution

```js
const counter$ = merge(start$, pause$).pipe(
  scan(
    (state, action) => {
      if (action.type === 'START') return { ...state, isActive: true };
      if (action.type === 'PAUSE') return { ...state, isActive: false };
      return state;
    },
    { value: 0, isActive: false },
  ),
  switchMap((state) => {
    if (state.isActive) {
      return interval(1000).pipe(
        tap(() => {
          count.value = ++state.value;
        }),
      );
    }
    return NEVER;
  }),
);
```

## Exercise

Can you get the following additional features working?

- Reset the count
- Set the count to a particular value
- Update the stream to count up
- Update the stream to count down
- Extension: Implement the ability to set it to a particular value

## Solution

```js
const counter$ = merge(start$, pause$, reset$, countUp$, countDown$).pipe(
  scan(
    (state, action) => {
      if (action.type === 'START') return { ...state, isActive: true };
      if (action.type === 'PAUSE') return { ...state, isActive: false };
      if (action.type === 'RESET') return { ...state, value: 0 };
      if (action.type === 'COUNTUP') return { ...state, increment: 1 };
      if (action.type === 'COUNTDOWN') return { ...state, increment: -1 };
      return state;
    },
    { value: 0, isActive: false, increment: 1 },
  ),
  tap((state) => (count.value = state.value)), // For the setting and resetting.
  switchMap((state) => {
    if (state.isActive) {
      return interval(1000).pipe(
        tap(() => (state.value += state.increment)),
        tap(() => (count.value = state.value)),
      );
    }
    return NEVER;
  }),
);
```

## Implement set to a given amount

`addEvent` takes an additional argument, which is basically a function that maps the value.

```js
const setValue$ = fromEvent(setTo, 'click', () =>
  parseInt(setToAmount.value, 10),
).pipe(map((amount) => ({ type: 'SET', payload: amount })));
```

Then, in our reducer:

```js
if (action.type === 'SET') return { ...state, value: action.payload };
```

## Bonus: Breaking It Apart

```js
const counterState$ = merge(
  start$,
  pause$,
  reset$,
  countUp$,
  countDown$,
  setValue$,
).pipe(
  scan(
    (state, action) => {
      if (action.type === 'START') return { ...state, isActive: true };
      if (action.type === 'PAUSE') return { ...state, isActive: false };
      if (action.type === 'RESET') return { ...state, value: 0 };
      if (action.type === 'COUNTUP') return { ...state, increment: 1 };
      if (action.type === 'COUNTDOWN') return { ...state, increment: -1 };
      if (action.type === 'SET') return { ...state, value: action.payload };
      return state;
    },
    { value: 0, isActive: false, increment: 1 },
  ),
);

const counter$ = merge(
  counterState$,
  counterState$.pipe(
    switchMap((state) => {
      if (state.isActive) {
        return interval(1000).pipe(
          tap(() => (state.value += state.increment)),
          mapTo(state),
        );
      }
      return NEVER;
    }),
  ),
);

counter$.subscribe((state) => (count.value = state.value));
```

This will have a subtle bug because you're technically switching off of that first one in the `switchMap` which makes RxJS, so adding one final `share` will keep it around.

```js
const counterState$ = merge(
  start$,
  pause$,
  reset$,
  countUp$,
  countDown$,
  setValue$,
).pipe(
  scan(
    (state, action) => {
      // …
      return state;
    },
    { value: 0, isActive: false, increment: 1 },
  ),
  share(), // 👀
);
```

### Extra, Extra Bonus

If you wanted to hide the details and only have the value exposed, you can use `pluck` to grab the value and then `distinctUntilChanged` to basically not emit anything unless that value updates.

```js
const counter$ = merge(
  counterState$,
  counterState$.pipe(
    switchMap((state) => {
      if (state.isActive) {
        return interval(1000).pipe(
          tap(() => (state.value += state.increment)),
          mapTo(state),
        );
      }
      return NEVER;
    }),
  ),
).pipe(pluck('value'), distinctUntilChanged());
```
