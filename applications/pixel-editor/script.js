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
      finalize(() => panel.classList.remove('moving'))
    )
  )
);

const mousedown$ = fromEvent(canvas, 'mousedown').pipe(map(getCoordinates));
const mousemove$ = fromEvent(canvas, 'mousemove').pipe(map(getCoordinates));
const mouseup$ = fromEvent(canvas, 'mouseup').pipe(map(getCoordinates));

const color$ = fromEvent(color, 'change', (event) => event.target.value).pipe(
  startWith(color.value)
);

const isDrawingLine$ = mousedown$.pipe(
  switchMap(() =>
    mousemove$.pipe(
      map(roundDownPoints),
      distinctUntilChanged(pointsAreEqual),
      takeUntil(mouseup$)
    )
  ),
  withLatestFrom(color$)
);

const isDrawingBox$ = mousedown$.pipe(
  switchMap((start) =>
    mousemove$.pipe(
      map((current) => ({
        start,
        current,
      })),
      takeUntil(mouseup$)
    )
  ),
  withLatestFrom(color$)
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

  ctx.beginPath();
  ctx.arc(
    startX,
    startY,
    Math.abs(Math.ceil(startX - currentX, startY - currentY)),
    0,
    2 * Math.PI,
    false
  );
  ctx.fill();
});
