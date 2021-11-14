import { fromEvent, merge, interval, concat, race, forkJoin } from 'rxjs';
import { mapTo, startWith, take, map } from 'rxjs/operators';
import { labelWith } from './utilities';

import { startButton, pauseButton, setStatus, bootstrap } from './utilities';
