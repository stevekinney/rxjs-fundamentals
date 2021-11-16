import { fromEvent, interval } from 'rxjs';
import {
  throttleTime,
  debounceTime,
  delay,
  debounce,
  throttle,
  scan,
  map,
  tap,
} from 'rxjs/operators';

import { renderMarkdown, deepThoughtInput, setStatus } from './utilities';

const textAreaChanges$ = fromEvent(deepThoughtInput, 'input').pipe(
  map((event) => event.target.value),
  tap(() => setStatus('Rendering…')),
  debounceTime(2000),
  tap(renderMarkdown),
  tap(() => setStatus('')),
);

textAreaChanges$.subscribe();
