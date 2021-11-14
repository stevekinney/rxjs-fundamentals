---
title: Creating Observables — Solution
layout: layouts/lesson.njk
---

```js
import { from, of } from 'rxjs';

describe('Exercise: Creating Observables', () => {
  describe(of, () => {
    it('should create an observable out of a single value', () => {
      const example$ = of(1);
      const result = [];

      example$.subscribe((value) => result.push(value));

      expect(result).toEqual([1]);
    });

    it('should take a series of objects as arguments and create an observable', () => {
      const example$ = of(
        { type: 'INCREMENT', payload: 1 },
        { type: 'RESET' },
        { type: 'INCREMENT', payload: 2 },
        { type: 'DECREMENT', payload: 1 },
      );
      const result = [];

      example$.subscribe((value) => result.push(value));

      expect(result).toEqual([
        { type: 'INCREMENT', payload: 1 },
        { type: 'RESET' },
        { type: 'INCREMENT', payload: 2 },
        { type: 'DECREMENT', payload: 1 },
      ]);
    });
  });

  describe(from, () => {
    it('should take an array of objects as arguments and create an observable', () => {
      const example$ = from([
        { type: 'INCREMENT', payload: 1 },
        { type: 'RESET' },
        { type: 'INCREMENT', payload: 2 },
        { type: 'DECREMENT', payload: 1 },
      ]);
      const result = [];

      example$.subscribe((value) => result.push(value));

      expect(result).toEqual([
        { type: 'INCREMENT', payload: 1 },
        { type: 'RESET' },
        { type: 'INCREMENT', payload: 2 },
        { type: 'DECREMENT', payload: 1 },
      ]);
    });

    it('should create an observable from a generator', () => {
      function* values() {
        yield 1;
        yield 2;
        yield 3;
        return 4;
      }

      const example$ = from(values());
      const result = [];

      example$.subscribe((value) => result.push(value));

      expect(result).toEqual([1, 2, 3]);
    });

    it('should create an observable from a promise', (done) => {
      const example$ = from(Promise.resolve(1));
      const result = [];

      example$.subscribe({
        next: (value) => result.push(value),
        complete: () => {
          expect(result).toEqual([1]);
          done();
        },
      });
    });

    it('should create an observable from a promise that rejects', (done) => {
      const example$ = from(
        Promise.reject({ error: 'Something terrible happened' }),
      );

      example$.subscribe({
        error: (error) => {
          expect(error).toEqual({ error: 'Something terrible happened' });
          done();
        },
      });
    });
  });
});
```
