---
title: Basic Operators — Exercise
layout: layouts/lesson.njk
---

```js
const example = of(1, 2, 3);

example.subscribe((val) => console.log(val));
```

```js
const example = from([1, 2, 3]);

example.subscribe((val) => console.log(val));
```

```js
const button = document.querySelector('button');

button.addEventListener('click', (event) => {
  console.log(event);
});

const buttonClicks$ = fromEvent(button, 'click');

buttonClicks$.subscribe(console.log);
```

```js
fromEvent(input, 'input', (event) => {
  event.target.value;
});
```

```js
const get = bindCallback(jQuery.get);
const data$ = get('/api/endpoint');

const readFile = bindNodeCallback(fs.readFile);
const content$ = readFile('./groceries.md', 'utf-8');
```

```js
import { fromFetch } from 'rxjs/fetch';

const data$ = fromFetch('/api/endpoint');
```

```js
function* fibonacci(iterations) {
  let iteration = 0;
  let values = [0, 1];

  while (iteration < iterations) {
    const [previous, current] = values;
    const next = previous + current;

    yield next;

    values = [current, next];
    iteration++;
  }
}

const example = from(fibonacci(10));

example.subscribe((val) => console.log(val));
```

But, like why does the fibonacci generator need to worry about how many iterations and hard-code that all in—we can just handle that from our observable?

```js
function* fibonacci() {
  let values = [0, 1];

  while (true) {
    const [previous, current] = values;
    const next = previous + current;

    yield next;

    values = [current, next];
  }
}

const example = from(fibonacci()).pipe(take(10));

example.subscribe((val) => console.log(val));
// Logs: 1, 2, 3, 5, 8, 13, 21, 34, 55, 89
```

```js
const example = from([1, 2, 3, 4, 5]).pipe(skip(2));

example.subscribe((val) => console.log(val));
// Logs: 2, 3, 4
```

We can chain operators. What if we only wanted the even values?

```js
const example = from(fibonacci()).pipe(
  take(10),
  filter((n) => n % 2 === 0),
);

example.subscribe((val) => console.log(val));
```

```js
const evenNumbers$ = of(1,2,3,4,5,6,7,8).pipe(
  filter((n) => n % 2 === 0)
);

evenNumbers$..subscribe((val) => console.log(val));
// Logs: 2, 4, 6, 7
```

```js
const doubledNumbers$ = of(1, 2, 3).pipe(map((n) => n * 2));

doubledNumbers$.subscribe(console.log);
// Logs: 2, 4, 6
```

We can also quickly change the behavior by swapping around the way the pipe is composed.

```js
const example = from(fibonacci()).pipe(
  filter((n) => n % 2 === 0),
  take(10),
);

example.subscribe((val) => console.log(val));
```

```js
const example = merge(of(1, 2, 3), of('one', 'two', 'three'));

example.subscribe((val) => console.log(val));
```

What if we wanted to delay them by however many seconds?

```js
const example = merge(of(1, 2, 3).pipe(map((n) => delay(n * 1000))));

example.subscribe((val) => console.log(val));
```

Hmm… that's not what we wanted. It did what it's supposed to do, but not
what we wanted. It mapped over the collection of observables and modified
them.

So, like what we really want to is to map over all oftem and then merge
them back into the sacred timeline.

```js
const example = merge(
  of(1, 2, 3).pipe(
    map((n) => of(n).pipe(delay(n * 1000))),
    mergeAll(),
  ),
);

example.subscribe((val) => console.log(val));
```

```js
const example = merge(
  of(1, 2, 3).pipe(mergeMap((n) => of(n).pipe(delay(n * 1000)))),
);

example.subscribe((val) => console.log(val));
```

## switchMap

```js
const example = merge(
  of(1, 2, 3).pipe(switchMap((n) => of(n).pipe(delay(n * 1000)))),
);

example.subscribe((val) => console.log(val));
```

```js
const example = merge(
  of(1, 2, 3).pipe(
    mergeMap((n) => of(n).pipe(delay(n * 1000))),
    finalize(() => console.log('all done')),
  ),
);
```

## interval

```js
const { interval } = require('rxjs');

const startingTime = Date.now();
const tick$ = interval(1000);

tick$.subscribe(() => console.log(Date.now() - startingTime));

// Logs:  1002, 2002, 3002, 4003, 5002
```

## timer

```js
const { timer } = require('rxjs');

const startingTime = Date.now();
const tick$ = timer(5000);

tick$.subscribe(() => console.log(Date.now() - startingTime));

// Logs: 5002
```

```js
const { timer } = require('rxjs');

const startingTime = Date.now();
const tick$ = timer(2000, 5000);

tick$.subscribe(() => console.log(Date.now() - startingTime));

// Logs:  2003, 7007, 12006
```

```js
const empty$ = EMPTY;
```

## takeUntil

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

## takeWhile

```js
const example$ = from(fibonacci()).pipe(
  skipWhile((value) => value < 100),
  takeWhile((value) => value > 500),
);

example$.subscribe(console.log);
```

```js
const under200$ = from(fibonacci()).pipe(
  takeWhile((value) => value < 200),
  reduce((total, value) => total + value, 0),
);

under200$.subscribe(console.log);

// Logs: 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144

const over100$ = from(fibonacci()).pipe(
  skipWhile((value) => value < 100),
  take(4),
);

over100$.subscribe(console.log);

// Logs:  144, 233, 377, 610
```

```js
const over100$ = from(fibonacci()).pipe(
  skipWhile((value) => value < 100),
  take(4),
  mapTo('HELLO!'),
);

over100$.subscribe(console.log);

// Logs: "HELLO!", "HELLO!", "HELLO!", "HELLO!"
```

```js
const under200$ = from(fibonacci()).pipe(
  takeWhile((value) => value < 200),
  reduce((total, value) => total + value, 0),
);

under200$.subscribe(console.log);

// Logs: 1, 3, 6, 11, 19, 32, 53, 87, 142, 231, 375
```

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
