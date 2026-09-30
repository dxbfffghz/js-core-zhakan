import { describe, it, expect, vi } from 'vitest';
import {
  unique,
  groupBy,
  chunk,
  deepClone,
  memoize,
  counter,
} from '../src/functions.js';

describe('unique', () => {
  it('removes duplicates from an array of numbers', () => {
    expect(unique([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
  });

  it('removes duplicates from an array of strings', () => {
    expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
  });

  it('returns an empty array for an empty input', () => {
    expect(unique([])).toEqual([]);
  });

  it('throws on a non-array argument', () => {
    expect(() => unique('not an array')).toThrow(TypeError);
  });
});

describe('groupBy', () => {
  const people = [
    { name: 'Alice', age: 20 },
    { name: 'Bob', age: 20 },
    { name: 'Carol', age: 30 },
  ];

  it('groups objects by a numeric key', () => {
    const result = groupBy(people, (p) => p.age);
    expect(result).toEqual({
      20: [
        { name: 'Alice', age: 20 },
        { name: 'Bob', age: 20 },
      ],
      30: [{ name: 'Carol', age: 30 }],
    });
  });

  it('groups by a string key', () => {
    const result = groupBy(people, (p) => p.name[0]);
    expect(Object.keys(result)).toEqual(['A', 'B', 'C']);
  });

  it('returns an empty object for an empty array', () => {
    expect(groupBy([], (x) => x)).toEqual({});
  });

  it('throws if keyFn is not a function', () => {
    expect(() => groupBy(people, 'age')).toThrow(TypeError);
  });
});

describe('chunk', () => {
  it('splits an array into equal chunks', () => {
    expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
  });

  it('handles a remainder in the last chunk', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('returns an empty array for an empty input', () => {
    expect(chunk([], 3)).toEqual([]);
  });

  it('throws if size is zero or negative', () => {
    expect(() => chunk([1, 2, 3], 0)).toThrow(RangeError);
    expect(() => chunk([1, 2, 3], -1)).toThrow(RangeError);
  });
});

describe('deepClone', () => {
  it('clones a nested plain object deeply', () => {
    const original = { a: 1, b: { c: [1, 2, 3], d: { e: 4 } } };
    const copy = deepClone(original);
    expect(copy).toEqual(original);
    expect(copy).not.toBe(original);
    expect(copy.b).not.toBe(original.b);
    expect(copy.b.c).not.toBe(original.b.c);
  });

  it('clones a Date', () => {
    const d = new Date('2025-01-01');
    const copy = deepClone(d);
    expect(copy).toEqual(d);
    expect(copy).not.toBe(d);
  });

  it('clones a Map and a Set', () => {
    const map = new Map([['x', { y: 1 }]]);
    const set = new Set([1, 2, { z: 3 }]);
    const copyMap = deepClone(map);
    const copySet = deepClone(set);
    expect(copyMap.get('x')).toEqual({ y: 1 });
    expect(copyMap.get('x')).not.toBe(map.get('x'));
    expect([...copySet]).toEqual([...set]);
  });

  it('returns primitives as-is', () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone('hi')).toBe('hi');
    expect(deepClone(null)).toBe(null);
  });

  it('does not share references with the source (mutation isolation)', () => {
    const original = { list: [1, 2, 3] };
    const copy = deepClone(original);
    copy.list.push(4);
    expect(original.list).toEqual([1, 2, 3]);
  });
});

describe('memoize', () => {
  it('caches the result for the same argument', () => {
    const spy = vi.fn((n) => n * 2);
    const fast = memoize(spy);
    expect(fast(5)).toBe(10);
    expect(fast(5)).toBe(10);
    expect(fast(5)).toBe(10);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('computes again for a different argument', () => {
    const spy = vi.fn((n) => n * 2);
    const fast = memoize(spy);
    fast(5);
    fast(6);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('throws if passed a non-function', () => {
    expect(() => memoize(123)).toThrow(TypeError);
  });
});

describe('counter', () => {
  it('starts at the given value and increments', () => {
    const c = counter(10);
    expect(c.value()).toBe(10);
    expect(c.inc()).toBe(11);
    expect(c.inc(5)).toBe(16);
  });

  it('decrements correctly', () => {
    const c = counter(10);
    expect(c.dec()).toBe(9);
    expect(c.dec(4)).toBe(5);
  });

  it('resets back to the start value', () => {
    const c = counter(3);
    c.inc(10);
    expect(c.value()).toBe(13);
    expect(c.reset()).toBe(3);
  });

  it('keeps independent state for each instance (closure)', () => {
    const a = counter(0);
    const b = counter(100);
    a.inc(5);
    expect(a.value()).toBe(5);
    expect(b.value()).toBe(100);
  });
});