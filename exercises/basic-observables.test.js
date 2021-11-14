import { from, of } from 'rxjs';

describe('Basic Observables', () => {
  describe(of, () => {
    it.skip('should create an observable from its arguments', () => {
      const result = [];

      expect(result).toEqual([1, 2, 3, 4]);
    });
  });

  describe(from, () => {
    it.skip('should create an observable', () => {
      const result = [];

      expect(result).toEqual([1, 2, 3, 4]);
    });
  });
});
