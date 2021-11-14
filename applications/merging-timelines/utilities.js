import { fromEvent, merge, NEVER } from 'rxjs';
import {
  mapTo,
  startWith,
  switchMap,
  tap,
  map,
  finalize,
} from 'rxjs/operators';

import {
  addElementToDOM,
  emptyElements,
} from '../../utilities/dom-manpulation';

export const startButton = document.getElementById('start');
export const pauseButton = document.getElementById('pause');
export const clearButton = document.getElementById('clear');
export const status = document.getElementById('status');

const outputs = {
  first: document.getElementById('first-output'),
  second: document.getElementById('second-output'),
  combined: document.getElementById('combined-output'),
};

export const setStatus = (isRunning) => {
  if (isRunning) {
    status.innerText = 'Running…';
    startButton.disabled = true;
    pauseButton.disabled = false;
  } else {
    status.innerText = 'Paused.';
    startButton.disabled = false;
    pauseButton.disabled = true;
  }
};

export const labelWith = (stream) => (value) => ({ stream, value });

export const addToOutput = (payload) => {
  if (Array.isArray(payload)) {
    const results = payload.map(({ metadata }) => metadata.value);

    return addToOutput({
      target: 'combined',
      metadata: {
        stream: 'combined',
        value: JSON.stringify(results),
      },
    });
  }

  const { target, metadata } = payload;
  const { stream, value } = metadata;

  addElementToDOM(outputs[target], String(value), {
    className: `stream-element stream-${stream.toLowerCase()}`,
  });
};

const start$ = fromEvent(startButton, 'click').pipe(mapTo(true));
const pause$ = fromEvent(pauseButton, 'click').pipe(mapTo(false));
const clear$ = fromEvent(clearButton, 'click');

const withMetadata = (target) => (metadata) => {
  if (Array.isArray(metadata)) return metadata.map(withMetadata(target));
  return { target, metadata };
};

export const bootstrap = ({ first$, second$, combined$ }) => {
  const first = first$.pipe(map(withMetadata('first')));
  const second = second$.pipe(map(withMetadata('second')));
  const combined = combined$.pipe(map(withMetadata('combined')));

  const run$ = merge(start$, pause$).pipe(
    startWith(false),
    switchMap((isRunning) =>
      isRunning
        ? merge(first, second, combined).pipe(finalize(() => setStatus(false)))
        : NEVER,
    ),
    tap(addToOutput),
  );

  return run$.subscribe();
};

clear$.subscribe(() => emptyElements(outputs));
