---
title: Manipulating Time (Follow Along)
layout: layouts/lesson.njk
---

Let's head over to our [playground](/applications/manipulating-time) and—erm—play around for a bit, shall we?

We're mostly just trying to get familiar with the `delay`, `throttleTime`, and `debounceTime` operators here. So, let's get to experimenting, shall we?

We'll start by putting a simple delay on the button and seeing what happens.

```js
const buttonClicks$ = fromEvent(button, 'click').pipe(delay(2000));
```

This, of course, creates a fun problem. Even though we're the ones that put that delay on the button, it's tempting to want to click it a bunch of times because we don't think it's working because of that delay.

You'll also notice that `delay` isn't necessarily spacing them out. If we rage click, they all come in roughly the same time, just two seconds in the future.

So, what would this look like if we said throttled that button a bit?

```js
const buttonClicks$ = fromEvent(button, 'click').pipe(
  throttleTime(2000),
  delay(2000),
);
```

So, now we can go to town on that button and we'll see that only one message appears. (If you see more than one, you might have to reload the page to clear out those old event listeners.)

This effect is more pronounced if we remove the `delay` completely and just go at the button with reckless abandonment.

```js
const buttonClicks$ = fromEvent(button, 'click').pipe(
  throttleTime(2000),
  // delay(2000)
);
```

You can keep clicking, but a new message will only show up every two seconds.

As we discussed, `debounceTime` works a bit differently. With `debounceTime` we ignore emitted values until there is a period of silence and then we take the last one and deal with it.

```js
const buttonClicks$ = fromEvent(button, 'click').pipe(debounceTime(1000));
```

I can click that button to my heart's content, but a new notification will only be displayed _after_ I chill out for a second.

## Throttling and Debouncing with Other Observables

If you peeked at the API documentation. You might have also seen that there are just plain ol' `throttle` and `debounce` operators as well. These work a little bit differently. They rely on subscribing to some other observable.

Instead on relying on a given amount of time, this one will throttle or debounce until the dependant observable emits a value. Let's try something like this.

```js
const panicButtonClicks$ = fromEvent(panicButton, 'click');
const buttonClicks$ = fromEvent(button, 'click').pipe(
  debounce(() => panicButtonClicks$),
);
```

I can keep clicking, but nothing will happen until I click the panic button. `throttle` works in the opposite fashion. The first notification will be displayed, but subsequent ones will _not_ be until the panic button is pressed again.

```js
const panicButtonClicks$ = fromEvent(panicButton, 'click');
const buttonClicks$ = fromEvent(button, 'click').pipe(
  throttle(() => panicButtonClicks$),
);
```

## Mimicking `debounceTime` and `throttleTime`

We know the folloing two things to be true:

- We can debounce or throttle an observable stream based on another observable emitting a value.
- We can create an observable that will emit values at regular intervals.

So, it stands to reason, that we can recreate the behavior of `throttleTime` and `debounceTime`.

```js
const buttonClicks$ = fromEvent(button, 'click').pipe(
  throttle(() => interval(2000)),
);
```
