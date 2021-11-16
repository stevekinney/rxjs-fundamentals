import { of } from 'rxjs';
import { mergeMap, delay } from 'rxjs/operators';
import './playground';

export const example$ = of(1, 2, 3, 4).pipe(
  mergeMap((value) => of(value).pipe(delay(value * 1000))),
);
