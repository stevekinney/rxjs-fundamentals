---
title: Combining Obervables with Operators (Solution)
layout: layouts/lesson.njk
---

When last we worked with our counter, we had something like this.

```js
let interval$;

startButtonClicks$.subscribe(() => {
  interval$ = interval(1000).subscribe((value) => (count.value = value));
});

stopButtonClicks$.subscribe(() => {
  interval$.unsubscribe();
});
```

But, now we have `skipUntil` and `takeUntil` at our disposal. What would it look like if we refactored our timer to _not_ use a global variable?

We could try something like this:

```js
const start$ = fromEvent(start, 'click');
const pause$ = fromEvent(pause, 'click');

const counter$ = interval(1000).pipe(skipUntil(start$), takeUntil(pause$));
```

You'll notice that our count is a little weird. The `interval` is still going. We can use `scan` to fix this.

```js
const start$ = fromEvent(start, 'click');
const pause$ = fromEvent(pause, 'click');

const counter$ = interval(1000).pipe(
  skipUntil(start$),
  scan((total) => total + 1, 0),
  takeUntil(pause$),
);
```

## It Still Has Some Issues

We've made our code cleaner and we've done things in a more idiomatic way, but we're not struggling with the fact that we have a single-use counter. There are a few ways that we can deal with this, but none of them are great. So, let's revisit this later, shall we?
