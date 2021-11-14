import { from } from 'rxjs';
import { take } from 'rxjs/operators';
import { fibonacci } from './fibonacci';

describe(fibonacci, () => {
  it('should generate a series of values following the fibonacci sequence', (done) => {
    const result = [];
    const fibonacci$ = from(fibonacci()).pipe(take(10));

    fibonacci$.subscribe({
      next: (value) => result.push(value),
      complete: () => {
        expect(result).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34]);
        done();
      },
    });
  });
});
