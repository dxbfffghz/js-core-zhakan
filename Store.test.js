import { describe, it, expect } from 'vitest';
import { Store, SortedStore } from '../src/Store.js';

describe('Store', () => {
  const sample = [
    { id: 1, name: 'Book', price: 10 },
    { id: 2, name: 'Pen', price: 2 },
  ];

  it('starts empty by default', () => {
    const s = new Store();
    expect(s.size).toBe(0);
    expect(s.total()).toBe(0);
  });

  it('accepts an initial array and exposes size', () => {
    const s = new Store(sample);
    expect(s.size).toBe(2);
  });

  it('adds an item and returns this (chainable)', () => {
    const s = new Store();
    const returned = s.add({ id: 1, name: 'A', price: 5 });
    expect(returned).toBe(s);
    expect(s.size).toBe(1);
  });

  it('throws on a duplicate id', () => {
    const s = new Store(sample);
    expect(() => s.add({ id: 1, name: 'X', price: 1 })).toThrow();
  });

  it('removes an item by id', () => {
    const s = new Store(sample);
    expect(s.remove(1)).toBe(true);
    expect(s.size).toBe(1);
    expect(s.find(1)).toBeUndefined();
  });

  it('returns false when removing a non-existent id', () => {
    const s = new Store(sample);
    expect(s.remove(999)).toBe(false);
  });

  it('finds an item by id', () => {
    const s = new Store(sample);
    expect(s.find(2)).toEqual({ id: 2, name: 'Pen', price: 2 });
  });

  it('computes the total price', () => {
    const s = new Store(sample);
    expect(s.total()).toBe(12);
  });

  it('static from() creates a store from an array', () => {
    const s = Store.from(sample);
    expect(s).toBeInstanceOf(Store);
    expect(s.size).toBe(2);
  });

  it('returns a defensive copy via items getter', () => {
    const s = new Store(sample);
    const copy = s.items;
    copy.push({ id: 99, name: 'Hack', price: 0 });
    expect(s.size).toBe(2);
  });
});

describe('SortedStore', () => {
  const unsorted = [
    { id: 1, name: 'A', price: 30 },
    { id: 2, name: 'B', price: 10 },
    { id: 3, name: 'C', price: 20 },
  ];

  it('sorts items ascending on construction', () => {
    const s = new SortedStore(unsorted, 'asc');
    expect(s.items.map((i) => i.price)).toEqual([10, 20, 30]);
  });

  it('sorts items descending on construction', () => {
    const s = new SortedStore(unsorted, 'desc');
    expect(s.items.map((i) => i.price)).toEqual([30, 20, 10]);
  });

  it('keeps order after add (calls super.add internally)', () => {
    const s = new SortedStore(unsorted, 'asc');
    s.add({ id: 4, name: 'D', price: 15 });
    expect(s.items.map((i) => i.price)).toEqual([10, 15, 20, 30]);
  });

  it('inherits total() from Store', () => {
    const s = new SortedStore(unsorted, 'asc');
    expect(s.total()).toBe(60);
  });

  it('is an instance of Store (inheritance chain)', () => {
    const s = new SortedStore(unsorted);
    expect(s).toBeInstanceOf(Store);
    expect(s).toBeInstanceOf(SortedStore);
  });

  it('throws on an invalid order', () => {
    expect(() => new SortedStore(unsorted, 'random')).toThrow(RangeError);
  });
});