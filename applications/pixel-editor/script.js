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

import {
  canvas,
  color,
  panel,
  roundDown,
  roundDownPoints,
  pointsAreEqual,
  getCoordinates,
  drawLine,
} from './utilities';

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

isDrawingLine$.subscribe(drawLine);

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

isMovingPanel$.subscribe(([x, y]) => {
  panel.style.top = y + 'px';
  panel.style.left = x + 'px';
});
