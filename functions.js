/**
 * LAB 4 — a set of pure utility functions.
 * Each function is exported and covered by tests in tests/functions.test.js.
 */

/**
 * 1. Remove duplicates from an array.
 * Uses Set — the simplest and most readable way.
 * @param {Array} arr
 * @returns {Array}
 */
export function unique(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('unique: expected an array');
  }
  return [...new Set(arr)];
}

/**
 * 2. Group items of an array by a computed key.
 * Uses reduce to accumulate into an object.
 * @param {Array} arr
 * @param {(item: any) => string|number} keyFn
 * @returns {Object}
 */
export function groupBy(arr, keyFn) {
  if (!Array.isArray(arr)) {
    throw new TypeError('groupBy: expected an array');
  }
  if (typeof keyFn !== 'function') {
    throw new TypeError('groupBy: keyFn must be a function');
  }
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] ??= []).push(item);
    return acc;
  }, {});
}

/**
 * 3. Split an array into chunks of a given size.
 * @param {Array} arr
 * @param {number} size
 * @returns {Array<Array>}
 */
export function chunk(arr, size) {
  if (!Array.isArray(arr)) {
    throw new TypeError('chunk: expected an array');
  }
  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError('chunk: size must be a positive integer');
  }
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/**
 * 4. Deep clone any value (objects, arrays, Date, Map, Set, primitives).
 * Does NOT use JSON.parse(JSON.stringify(...)).
 * Uses recursion + instanceof checks.
 * @param {*} value
 * @returns {*}
 */
export function deepClone(value) {
  // Primitives and functions — return as is
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // Date
  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  // Map
  if (value instanceof Map) {
    const copy = new Map();
    for (const [k, v] of value) {
      copy.set(deepClone(k), deepClone(v));
    }
    return copy;
  }

  // Set
  if (value instanceof Set) {
    const copy = new Set();
    for (const v of value) {
      copy.add(deepClone(v));
    }
    return copy;
  }

  // Array
  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item));
  }

  // Plain object — clone own enumerable props
  const copy = {};
  for (const key of Object.keys(value)) {
    copy[key] = deepClone(value[key]);
  }
  return copy;
}

/**
 * 5. Memoize a function's result, built on a closure.
 * The returned function keeps a private `cache` variable alive
 * between calls. Only single-argument functions are supported.
 * @param {(arg: any) => any} fn
 * @returns {(arg: any) => any}
 */
export function memoize(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('memoize: expected a function');
  }
  // The `cache` variable lives in the closure — nobody outside can touch it.
  const cache = new Map();
  return function memoized(arg) {
    if (cache.has(arg)) {
      return cache.get(arg);
    }
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

/**
 * 6. Counter factory — returns inc, dec, value, reset.
 * All methods share a private `count` variable via closure.
 * @param {number} [start=0]
 * @returns {{ inc: (n?: number) => number, dec: (n?: number) => number, value: () => number, reset: () => number }}
 */
export function counter(start = 0) {
  if (typeof start !== 'number' || Number.isNaN(start)) {
    throw new TypeError('counter: start must be a number');
  }
  let count = start;
  return {
    inc(step = 1) {
      count += step;
      return count;
    },
    dec(step = 1) {
      count -= step;
      return count;
    },
    value() {
      return count;
    },
    reset() {
      count = start;
      return count;
    },
  };
}