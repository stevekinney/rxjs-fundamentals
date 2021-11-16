import { fromEvent, merge, NEVER } from 'rxjs';
import { mapTo, switchMap } from 'rxjs/operators';
import { addElementToDOM, emptyElement } from '../../utilities/dom-manpulation';
import { example$ } from './script';

const play = document.getElementById('play');
const pause = document.getElementById('pause');
const clear = document.getElementById('clear');
const output = document.getElementById('output');

const play$ = fromEvent(play, 'click').pipe(mapTo(true));
const pause$ = fromEvent(pause, 'click').pipe(mapTo(false));
const clear$ = fromEvent(clear, 'click');

const playground$ = merge(play$, pause$).pipe(
  switchMap((isRunning) => {
    return isRunning ? example$ : NEVER;
  }),
);

playground$.subscribe((value) => {
  addElementToDOM(output, value, { classList: ['playground-event'] });
});

clear$.subscribe(() => emptyElement(output));
