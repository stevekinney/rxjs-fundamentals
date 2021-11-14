---
title: Pixel Editor
layout: layouts/lesson.njk
---

```js
const isDrawingLine$ = mousedown$.pipe(
  switchMap(() => mousemove$.pipe(takeUntil(mouseup$))),
);
```

We can argue as to whether or not we want to do this in the individual mouse events or not.

```js
const isDrawingLine$ = mousedown$.pipe(
  switchMap(() =>
    mousemove$.pipe(
      map((points) => points.map(roundDown)),
      takeUntil(mouseup$),
    ),
  ),
);
```

And now, we want to actually draw the pixels.

```js
isDrawingLine$.subscribe(([x, y]) => {
  ctx.fillStyle = 'red';
  ctx.fillRect(x, y, 10, 10);
});
```

Now, drawing tot he canvas isn't super expensive, but other stuff is. Could we only emit values when they're different from the last one?

```js
const isDrawingLine$ = mousedown$.pipe(
  switchMap(() =>
    mousemove$.pipe(map(roundDownPoints), distinct(), takeUntil(mouseup$)),
  ),
);
```

This doesn't work. Why? Because each array is it's own special snowflake.

Let's figure out how to tell if they're really

```js
const pointsAreEqual = (previous, current) => {
  return previous[0] === current[0] && previous[1] === current[1];
};
```

And now we can put that in our pipe.

```js
const isDrawingLine$ = mousedown$.pipe(
  switchMap(() =>
    mousemove$.pipe(
      map(roundDownPoints),
      distinctUntilChanged(pointsAreEqual),
      takeUntil(mouseup$),
    ),
  ),
);
```

Okay, what if we want to know the current color?

```js
const color$ = fromEvent(color, 'change', (event) => event.target.value).pipe(
  startWith(color.value),
);
```

Now, we can combine the streams:

```js
const isDrawingLineWithColor$ = combineLatest([isDrawingLine$, color$]);

isDrawingLineWithColor$.subscribe(([point, color]) => {
  const [x, y] = point;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 10, 10);
});
```

There is a subtle bug here. We get a new pixel drawn when we change the color.

Okay, so we change that.

```js
const isDrawingLine$ = mousedown$.pipe(
  switchMap(() =>
    mousemove$.pipe(
      map(roundDownPoints),
      distinctUntilChanged(pointsAreEqual),
      takeUntil(mouseup$),
    ),
  ),
  withLatestFrom(color$),
);
```

Final Code:

```js
import { fromEvent } from 'rxjs';
import {
  switchMap,
  map,
  takeUntil,
  startWith,
  distinctUntilChanged,
  withLatestFrom,
} from 'rxjs/operators';
import './styles.css';

const canvas = document.getElementById('canvas');
const color = document.getElementById('color');
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'green';
ctx.fillRect(10, 10, 150, 100);

const roundDown = (n) => Math.floor(n / 10) * 10;
const roundDownPoints = (points) => points.map(roundDown);
const pointsAreEqual = (previous, current) => {
  return previous[0] === current[0] && previous[1] === current[1];
};

const getCoordinates = (event) => [event.offsetX, event.offsetY];

const mousedown$ = fromEvent(canvas, 'mousedown').pipe(map(getCoordinates));
const mousemove$ = fromEvent(canvas, 'mousemove').pipe(map(getCoordinates));
const mouseup$ = fromEvent(canvas, 'mouseup').pipe(map(getCoordinates));

const color$ = fromEvent(color, 'change', (event) => event.target.value).pipe(
  startWith(color.value),
);

const isDrawingLine$ = mousedown$.pipe(
  switchMap(() =>
    mousemove$.pipe(
      map(roundDownPoints),
      distinctUntilChanged(pointsAreEqual),
      takeUntil(mouseup$),
    ),
  ),
  withLatestFrom(color$),
);

isDrawingLine$.subscribe(([point, color]) => {
  const [x, y] = point;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 10, 10);
});

color$.subscribe(console.log);
```

### Add drag and drop to controls

```js
const panelstart$ = fromEvent(panel, 'mousedown');
const panelmove$ = fromEvent(document, 'mousemove');
const panelend$ = fromEvent(document, 'mouseup');

const isMovingPanel$ = panelstart$.pipe(
  switchMap(() =>
    panelmove$.pipe(
      map((event) => [event.x, event.y]),
      takeUntil(panelend$),
    ),
  ),
);

isMovingPanel$.subscribe(([x, y]) => {
  panel.style.top = y + 'px';
  panel.style.left = x + 'px';
});
```

We can make this a little better by adding some indiciation about what we're moving.

```js
const isMovingPanel$ = panelstart$.pipe(
  switchMap(() =>
    panelmove$.pipe(
      tap(() => panel.classList.add('moving')),
      map((event) => [event.x, event.y]),
      takeUntil(panelend$),
      finalize(() => panel.classList.remove('moving')),
    ),
  ),
);
```

### Making the dragging a little better

It turns out that `switchMap` takes an argument of the original value.

```js
const isMovingPanel$ = panelstart$.pipe(
  switchMap((start) =>
    panelmove$.pipe(
      tap(() => panel.classList.add('moving')),
      map((event) => [event.x - start.offsetX, event.y - start.offsetY]),
      takeUntil(panelend$),
      finalize(() => panel.classList.remove('moving')),
    ),
  ),
);
```

## Drawing Boxes

What about drawing boxes?

```js
const isDrawingBox$ = mousedown$.pipe(
  switchMap((start) =>
    mousemove$.pipe(
      map((current) => ({
        start: roundDownPoints(start),
        current: roundDownPoints(current),
      })),
      takeUntil(mouseup$),
    ),
  ),
  withLatestFrom(color$),
);

isDrawingBox$.subscribe(([points, color]) => {
  ctx.fillStyle = color;
  const [startX, startY] = points.start;
  const [currentX, currentY] = points.current;

  ctx.fillRect(startX, startY, currentX - startX, currentY - startY);
});
```

## Make a Circle Instead

```js
isDrawingBox$.subscribe(([points, color]) => {
  ctx.fillStyle = color;
  const [startX, startY] = points.start;
  const [currentX, currentY] = points.current;

  ctx.beginPath();
  ctx.arc(
    startX,
    startY,
    Math.abs(Math.ceil(startX - currentX, startY - currentY)),
    0,
    2 * Math.PI,
    false,
  );
  ctx.fill();

  // ctx.fillRect(startX, startY, currentX - startX, currentY - startY);
});
```

TODO: Make a helper function for making circles.

## Extension: Add Controls

It could be cool to toggle between the controls for pixels and boxes

## Final Code

https://codesandbox.io/s/pixel-painter-wnypk

```js
import { fromEvent } from 'rxjs';
import {
  switchMap,
  map,
  takeUntil,
  startWith,
  distinctUntilChanged,
  withLatestFrom,
  tap,
  finalize,
} from 'rxjs/operators';
import './styles.css';

const canvas = document.getElementById('canvas');
const color = document.getElementById('color');
const panel = document.getElementById('panel');

const ctx = canvas.getContext('2d');

ctx.fillStyle = 'green';
ctx.fillRect(10, 10, 150, 100);

const roundDown = (n) => Math.floor(n / 10) * 10;
const roundDownPoints = (points) => points.map(roundDown);
const pointsAreEqual = (previous, current) => {
  return previous[0] === current[0] && previous[1] === current[1];
};

const getCoordinates = (event) => [event.offsetX, event.offsetY];

const panelstart$ = fromEvent(panel, 'mousedown');
const panelmove$ = fromEvent(document, 'mousemove');
const panelend$ = fromEvent(document, 'mouseup');

const isMovingPanel$ = panelstart$.pipe(
  switchMap((start) =>
    panelmove$.pipe(
      tap(() => panel.classList.add('moving')),
      map((event) => [event.x - start.offsetX, event.y - start.offsetY]),
      takeUntil(panelend$),
      finalize(() => panel.classList.remove('moving')),
    ),
  ),
);

const mousedown$ = fromEvent(canvas, 'mousedown').pipe(map(getCoordinates));
const mousemove$ = fromEvent(canvas, 'mousemove').pipe(map(getCoordinates));
const mouseup$ = fromEvent(canvas, 'mouseup').pipe(map(getCoordinates));

const color$ = fromEvent(color, 'change', (event) => event.target.value).pipe(
  startWith(color.value),
);

const isDrawingLine$ = mousedown$.pipe(
  switchMap(() =>
    mousemove$.pipe(
      map(roundDownPoints),
      distinctUntilChanged(pointsAreEqual),
      takeUntil(mouseup$),
    ),
  ),
  withLatestFrom(color$),
);

const isDrawingBox$ = mousedown$.pipe(
  switchMap((start) =>
    mousemove$.pipe(
      map((current) => ({
        start: roundDownPoints(start),
        current: roundDownPoints(current),
      })),
      takeUntil(mouseup$),
    ),
  ),
  withLatestFrom(color$),
);

// isDrawingLine$.subscribe(([point, color]) => {
//   const [x, y] = point;
//   ctx.fillStyle = color;
//   ctx.fillRect(x, y, 10, 10);
// });

isMovingPanel$.subscribe(([x, y]) => {
  panel.style.top = y + 'px';
  panel.style.left = x + 'px';
});

isDrawingBox$.subscribe(([points, color]) => {
  ctx.fillStyle = color;
  const [startX, startY] = points.start;
  const [currentX, currentY] = points.current;

  ctx.fillRect(startX, startY, currentX - startX, currentY - startY);
});
```
