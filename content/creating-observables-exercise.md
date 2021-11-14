---
title: Creating Observables — Exercise
layout: layouts/lesson.hbs
---

We have a set of tests in `exercises/creating-observables.test.js`. You can run just these tests using the the following.

`npm test creating` will scope Jest down to _just_ the appropriate tests.

**Your mission**: un-skip each test and make sure they pass.

Some things that you will want to keep in mind:

- `of` can be used for any set of values.
- `from` can only be used for iterable objects (e.g. arrays, generators) and observable-like objects (e.g. promises).
- Promises are asynchronous. So, we only want to run our expecations after the observable has completed.
