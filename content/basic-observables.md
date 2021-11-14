---
title: Basic Observables
layout: layouts/lesson.hbs
---

Use write some tests to wrap our head around how the two, most basic ways to create observables work.

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
