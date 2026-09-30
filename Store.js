/**
 * LAB 4 — Store class hierarchy.
 * Uses private fields (#), a getter, a static method, and inheritance with super.
 */

export class Store {
  // Private field — not accessible from outside the class.
  #items;

  /**
   * @param {Array<{id: string|number, name: string, price: number}>} [initial=[]]
   */
  constructor(initial = []) {
    if (!Array.isArray(initial)) {
      throw new TypeError('Store: initial must be an array');
    }
    this.#items = [...initial];
  }

  /** Getter — read-only view of items. */
  get size() {
    return this.#items.length;
  }

  /** Getter — snapshot of items (defensive copy). */
  get items() {
    return [...this.#items];
  }

  /**
   * Add an item. Throws if id is duplicated or missing.
   * @param {{id: string|number, name: string, price: number}} item
   * @returns {this}
   */
  add(item) {
    if (!item || typeof item !== 'object') {
      throw new TypeError('Store.add: item must be an object');
    }
    if (item.id === undefined) {
      throw new TypeError('Store.add: item must have an id');
    }
    if (this.#items.some((i) => i.id === item.id)) {
      throw new Error(`Store.add: item with id "${item.id}" already exists`);
    }
    this.#items.push({ ...item });
    return this;
  }

  /**
   * Remove an item by id.
   * @param {string|number} id
   * @returns {boolean} true if removed, false if not found
   */
  remove(id) {
    const index = this.#items.findIndex((i) => i.id === id);
    if (index === -1) return false;
    this.#items.splice(index, 1);
    return true;
  }

  /**
   * Find an item by id.
   * @param {string|number} id
   * @returns {object|undefined}
   */
  find(id) {
    return this.#items.find((i) => i.id === id);
  }

  /**
   * Sum of all prices.
   * @returns {number}
   */
  total() {
    return this.#items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  /**
   * Static factory — create a Store from an array of items.
   * @param {Array} items
   * @returns {Store}
   */
  static from(items) {
    return new Store(items);
  }
}

/**
 * SortedStore — extends Store and keeps items sorted by price.
 * Overrides `add` and calls super.add, then re-sorts.
 */
export class SortedStore extends Store {
  /**
   * @param {Array} [initial=[]]
   * @param {'asc'|'desc'} [order='asc']
   */
  constructor(initial = [], order = 'asc') {
    super(initial); // call parent constructor
    if (order !== 'asc' && order !== 'desc') {
      throw new RangeError('SortedStore: order must be "asc" or "desc"');
    }
    this.order = order;
    this.#sort();
  }

  #sort() {
    const dir = this.order === 'asc' ? 1 : -1;
    // We cannot touch #items directly (it's private to Store).
    // So we use the public snapshot + internal rebuild via super methods.
    const sorted = this.items.sort((a, b) => (a.price - b.price) * dir);
    // Clear via remove() loop, then add back through super.add to skip re-sort
    for (const item of this.items) {
      this.remove(item.id);
    }
    for (const item of sorted) {
      super.add(item);
    }
  }

  /**
   * Override add — insert then keep sorted.
   * @param {object} item
   * @returns {this}
   */
  add(item) {
    super.add(item);
    this.#sort();
    return this;
  }
}