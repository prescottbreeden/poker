const { both, eq, keys, length, match, pipe } = require('../utils');

describe('utility functions', () => {
  describe('both', () => {
    // test helpers
    const isDingo = (string) => string === 'dingo';
    const isBob = (string) => string === 'bob';
    const isLower = (word) => word.toLowerCase() === word;
    it('returns a function for the first two arguments supplied', () => {
      const arity2 = both(isDingo);
      const arity1 = both(isBob)(isLower);
      expect(typeof arity2).toBe('function');
      expect(typeof arity1).toBe('function');
    });
    it('evalutes two predicate fns with an argument and returns true if both are truthy', () => {
      expect(both(isDingo)(isLower)('dingo')).toBe(true); // true && true
      expect(both(isDingo)(isLower)('DINGO')).toBe(false); // true && false
      expect(both(isBob)(isLower)('dingo')).toBe(false); // false && true
      expect(both(isBob)(isLower)('DINGO')).toBe(false); // false && false
    });
  });

  describe('eq', () => {
    it('returns a function when given one argument', () => {
      expect(typeof eq(1)).toBe('function');
    });
    it('retusn true when two arguments share equality', () => {
      expect(eq('dingo')('dingo')).toBe(true);
      expect(eq(42)(42)).toBe(true);
      expect(eq(42)('dingo')).toBe(false);
      expect(eq({ name: 'bob' })({ name: 'bob' })).toBe(true);
    });
  });

  describe('length', () => {
    it('returns the length value of an object with a length property', () => {
      expect(length([1, 2, 3])).toBe(3);
      expect(length('dingo')).toBe(5);
      expect(length({ length: 42 })).toBe(42);
    });
  });

  describe('keys', () => {
    it('returns the keys of an object in a list', () => {
      expect(keys({ name: 'bob', age: 42 })).toStrictEqual(['name', 'age']);
    });
  });

  describe('pipe', () => {
    // test helper
    const add = (a) => (b) => a + b;
    it('takes n-length functions with arity of 1 and returns a fn with arity 1', () => {
      const arity1 = pipe(add(1), add(2), add(3), add(4));
      expect(typeof arity1).toBe('function');
      expect(typeof arity1(10)).toBe('number');
    });
    it('takes a second argument and passes it sequentially through all fns', () => {
      const addTen = pipe(add(1), add(2), add(3), add(4));
      expect(addTen(42)).toBe(52);
    });
  });

  describe('match', () => {
    // test helper
    const waterAt = match([
      [eq(0), (temp) => `Water freezes at ${temp}C.`],
      [eq(100), (temp) => `Water boils at ${temp}C.`],
      [() => true, (temp) => `Water does nothing fancy at ${temp}C.`],
    ]);
    it('takes a list of predicate/function tuples and returns a function', () => {
      expect(typeof waterAt).toBe('function');
    });
    it('evalues a list of predicates and returns the matching function', () => {
      expect(waterAt(0)).toBe('Water freezes at 0C.');
      expect(waterAt(100)).toBe('Water boils at 100C.');
      expect(waterAt(42)).toBe('Water does nothing fancy at 42C.');
    });
    it('throws an exception if no match case is found', () => {
      const waterAt = match([
        [eq(0), (temp) => `Water freezes at ${temp}C.`],
        [eq(100), (temp) => `Water boils at ${temp}C.`],
      ]);
      expect(() => waterAt(42)).toThrowError('Missing match case');
    });
  });
});
