---
title: Basic Operators
layout: layouts/lesson.njk
---

We've made observables from values, arrays, and promises. What about generators? They're iterables in JavaScript, so they should be fair game—and they are.

But, we run into a little bit of a problem when these generators don't ever end.

```js
export function* fibonacci() {
  let values = [0, 1];

  while (true) {
    let [current, next] = values;

    yield current;

    values = [next, current + next];
  }
}
```

## Introducing Operators

Using `from` here would totally work, but we'd end up locking up the main thread as our observable just worked through the values forever and ever. We _could_ add a condition to the while loop to break it off after a certain number of iterations, but we don't need to. Why? Because we have RxJS!

- Every observable has a `.pipe` method.
- This method takes one or more functions called _operators_.
- Each operator takes the observable, does something to it, and returns a new observable.
- This is similar to method chaining.
- Or, just using `pipe` in Lodash.

### take

Take a certain number of values from an observable and then stop.

```js
const example$ = from(fibonacci()).pipe(take(10));

example$.subscribe((val) => console.log(val));
// Logs: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34
```

### skip

Ignore the first however many values and then start listening.

```js
const example$ = from([1, 2, 3, 4, 5]).pipe(skip(2));

example$.subscribe((val) => console.log(val));
// Logs: 3, 4, 5
```

### takeWhile and skipWhile

`take` and `skip` have siblings that will take a function instead of an integer.

```js
const under200$ = from(fibonacci()).pipe(takeWhile((value) => value < 200));

under200$.subscribe(console.log);

// Logs: 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144
```

```js
const over100$ = from(fibonacci()).pipe(
  skipWhile((value) => value < 100),
  take(4),
);

over100$.subscribe(console.log);

// Logs:  144, 233, 377, 610
```

### filter

This one works just like it does with arrays.

```js
const evenNumbers$ = of(1, 2, 3, 4, 5, 6, 7, 8).pipe(
  filter((n) => n % 2 === 0),
);

evenNumbers$.subscribe((val) => console.log(val));
// Logs: 2, 4, 6, 8
```

### map

So does `map`.

```js
const doubledNumbers$ = of(1, 2, 3).pipe(map((n) => n * 2));

doubledNumbers$.subscribe(console.log);
// Logs: 2, 4, 6
```

### mapTo

`mapTo` is just a simplified version of `map`.

```js
const over100$ = from(fibonacci()).pipe(
  skipWhile((value) => value < 100),
  take(4),
  mapTo('HELLO!'),
);

over100$.subscribe(console.log);

// Logs: "HELLO!", "HELLO!", "HELLO!", "HELLO!"
```

### reduce

The thing to keep in mind with `reduce` is that it only emits one value: the final value upon completion. If you need each intermediate value, you'll want to use `scan`.

```js
const under200$ = from(fibonacci()).pipe(
  takeWhile((value) => value < 200),
  reduce((total, value) => total + value, 0),
);

under200$.subscribe(console.log);

// Logs: 375
```

### scan

`scan` behaves like `reduce`, but it also gives us every intermediate value along the way.

```js
const under200$ = from(fibonacci()).pipe(
  takeWhile((value) => value < 200),
  reduce((total, value) => total + value, 0),
);

under200$.subscribe(console.log);

// Logs: 1, 3, 6, 11, 19, 32, 53, 87, 142, 231, 375
```

We can also combine it with `take` if we wanted to use a certain number of values.

```js
const fibonacci$ = range(0, Infinity).pipe(
  scan(([curr, next]) => [next, curr + next], [0, 1]),
  map(([curr]) => curr),
  take(5),
);

fibonacci$.subscribe(console.log);
```

### tap

One of the problems with `.pipe` is that you you only get the value at the very end. This can be tricky for debugging. `tap` allows you to do something and immediately return the value that you started with. This can be useful for side effects—most notably logging to the console and manipulating the DOM.

```js
const div = document.querySelector('div');

const example$ = from([1, 2, 3, 4]).pipe(
  tap((value) => console.log(`About to set the <div> to ${value}.`)),
  tap((value) => {
    div.innerText = value;
  }),
  tap((value) => console.log(`Set the <div> to ${value}.`)),
);
```

## Your Mission

In `exercises/basic-operators.test.js`, there are a series of quick exercises. Your job is to make the tests pass.
