---
title: Creating Observables (Exercise)
layout: layouts/lesson.njk
---

We can write some tests to wrap our head around how the two, most basic ways to create observables work. Let's start with two incredibly simple tests.

Things to look out for here:

- We set up an empty array.
- We use our array to store all of the values that were emitted by our observable.
- We then verify that the contents of our array match what we're expecting.

```js
import { from, of } from 'rxjs';

describe('Basic Observables', () => {
  describe(of, () => {
    it('should create an observable from its arguments', () => {
      const example$ = of(1, 2, 3, 4);
      const result = [];

      example$.subscribe((value) => result.push(value));

      expect(result).toEqual([1, 2, 3, 4]);
    });
  });

  describe(from, () => {
    it('should create an observable', () => {
      const example$ = from([1, 2, 3, 4]);
      const result = [];

      example$.subscribe((value) => result.push(value));

      expect(result).toEqual([1, 2, 3, 4]);
    });
  });
});
```

## Exercise

We have a set of tests in [`exercises/creating-observables.test.js`][exercise]. You can run just these tests using the the following.

`npm test creating` will scope Jest down to _just_ the appropriate tests.

**Your Mission**: Un-skip each test and make sure they pass.

Some things that you will want to keep in mind:

- `of` can be used for any set of values.
- `from` can only be used for iterable objects (e.g. arrays, generators) and observable-like objects (e.g. promises).
- Promises are asynchronous. So, we only want to run our expecations after the observable has completed.

[exercise]: https://github.com/stevekinney/rxjs-fundamentals/blob/master/exercises/creating-observables.test.js
