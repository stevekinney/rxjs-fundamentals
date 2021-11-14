---
title: Counter (Basic) — Exercise
layout: layouts/lesson.hbs
---

Alright, so we have a few new tricks up our sleeves.

- We know how to create observables that fire at regular intervals using `timer` and `interval`.
- We know how to create observables from DOM events using `fromEvent` and listen to them.

Given the _very_ simple UI in `applications/counter-basic`, can you wire up this simple counter.

Hitting the start button should create an `interval` observable that updates the value of the counter.

Try it out with `timer` too just to get a feel for the difference.

What did you learn about the values that `interval` and `timer` emit?
