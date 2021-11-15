---
title: Basic Operators (Solution)
layout: layouts/lesson.njk
---

Here is the solution to the suite of tests where we explored how to use some basic operators.

```js
describe('Basic Operators', () => {
  it('should take the first 5 values and map them to the word "DINOSAUR"', async () => {
    const observable$ = of(1, 2, 3, 4, 5, 6, 7).pipe(
      take(5),
      mapTo('DINOSAUR'),
    );

    return expect(await getResult(observable$)).toEqual([
      'DINOSAUR',
      'DINOSAUR',
      'DINOSAUR',
      'DINOSAUR',
      'DINOSAUR',
    ]);
  });

  it('should skip the first 5 values and double last two', async () => {
    const observable$ = of(1, 2, 3, 4, 5, 6, 7).pipe(
      skip(5),
      map((n) => n * 2),
    );

    return expect(await getResult(observable$)).toEqual([12, 14]);
  });

  it('should emit the square of every even number in the stream', async () => {
    const observable$ = of(1, 2, 3, 4, 5, 6, 7).pipe(
      filter((x) => x % 2 === 0),
      map((n) => n * n),
    );

    return expect(await getResult(observable$)).toEqual([4, 16, 36]);
  });

  it('should sum of the total of all of the Fibonacci numbers under 200', async () => {
    const observable$ = from(fibonacci()).pipe(
      takeWhile((n) => n < 200),
      reduce((total, n) => total + n, 0),
    );

    expect(await getResult(observable$)).toEqual([376]);
  });

  it('should merge each object emited into a single object, emitting each state along the way', async () => {
    const observable$ = of(
      { isRunning: true },
      { currentSpeed: 100 },
      { currentSpeed: 200 },
      { distance: 500 },
    ).pipe(scan((state, next) => ({ ...state, ...next }), {}));

    expect(await getResult(observable$)).toEqual([
      { isRunning: true },
      { isRunning: true, currentSpeed: 100 },
      { isRunning: true, currentSpeed: 200 },
      { isRunning: true, currentSpeed: 200, distance: 500 },
    ]);
  });
});
```
