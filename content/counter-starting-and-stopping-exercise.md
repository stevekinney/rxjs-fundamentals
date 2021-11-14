Alright, so we have a few new tricks up our sleeves.

- We know how to create observables that fire at regular intervals using `timer` and `interval`.
- We know how to unsubscribe from an observable.
- We know how to create observables from DOM events using `fromEvent`.

Given the _very_ simple UI in `applications/counter-basic`, can you wire up this simple counter.

It should be able to do the following:

- Hitting the start button should create an `interval` observable that updates the value of the counter.
- Hitting stop should… umm… stop the counter.
