---
title: Basic Counter (Exercise)
layout: layouts/lesson.njk
---

Making observables out of what effectively are arrays is all well and good, but what if we wanted to started taking advantage of this whole "values over time" thing that we've been talking about?

Well, it turns out that we have _even more_ ways to create observables. We can use `interval` in order to produce values at a regular—umm—interval.

```js
const { interval } = require('rxjs');

const startingTime = Date.now();
const tick$ = interval(1000);

tick$.subscribe(() => console.log(Date.now() - startingTime));

// Logs:  1002, 2002, 3002, 4003, 5002
```

One thing to notice is that it waits however many milliseconds before it produces a value.

`timer` is similiar in so far as it produces a value after a given number of milliseconds, but it also can take a second argument where it behaves a lot like `interval`.

This is how it behaves with one value.

```js
const { timer } = require('rxjs');

const startingTime = Date.now();
const tick$ = timer(5000);

tick$.subscribe(() => console.log(Date.now() - startingTime));

// Logs: 5002
```

And, if we give it two arguments. It will produce a value after the initial value and again every _n_ milliseconds.

```js
const { timer } = require('rxjs');

const startingTime = Date.now();
const tick$ = timer(2000, 5000);

tick$.subscribe(() => console.log(Date.now() - startingTime));

// Logs:  2003, 7007, 12006
```

## Cleaning Up an Interval Observable

We'll explore some additional ways to subscribe and unsubscribe from an observable, but let's start with the basics. When we call `subscribe`, we get back a `Subscription` object. This object has a very useful method called `unsubscribe`.

We don't know everything we need to know in order to do this purely with RxJS just yet, but let's take a naïve approach for now.

```js
const interval$ = interval(1000);

const subscription = interval$.subscribe(console.log);

setTimeout(() => subscription.unsubscribe(), 5000);
```

This can be useful in client-side frameworks where you might want to subscribe to an observable when a component mounts, but also then unsubscribe from it when the component unmounts.

## Your Mission

Alright, so we have a few new tricks up our sleeves.

- We know how to create observables that fire at regular intervals using `timer` and `interval`.
- We know how to create observables from DOM events using `fromEvent` and listen to them.

Given the _very_ simple UI in `applications/basic-counter`, can you wire up this simple counter.

Hitting the start button should create an `interval` observable that updates the value of the counter.

Try it out with `timer` too just to get a feel for the difference.

What did you learn about the values that `interval` and `timer` emit?
