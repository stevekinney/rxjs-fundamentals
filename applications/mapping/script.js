import { of, from, interval, fromEvent, merge, NEVER } from 'rxjs';
import { pluck, concatMap, take, map } from 'rxjs/operators';

import {
  getCharacter,
  render,
  startButton,
  pauseButton,
  setStatus,
} from './utilities';

const character$ = from(getCharacter(1)).pipe(pluck('name'));

character$.subscribe(render);
