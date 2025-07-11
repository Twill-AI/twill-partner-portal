/**
 * Simple in-memory cache with TTL support
 */
export class Cache {
  /**
   * Create a new Cache instance
   * @param {Object} options - Cache options
   * @param {number} [options.defaultTTL=300000] - Default TTL in milliseconds (5 minutes)
   * @param {number} [options.maxSize=1000] - Maximum number of items to store in the cache
   */
  constructor({ defaultTTL = 300000, maxSize = 1000 } = {}) {
    this.store = new Map();
    this.defaultTTL = defaultTTL;
    this.maxSize = maxSize;
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000); // Clean up every minute
  }

  /**
   * Get a value from the cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or undefined if not found or expired
   */
  get(key) {
    const item = this.store.get(key);
    if (!item) return undefined;

    // Check if item has expired
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return undefined;
    }

    // Update last accessed time for LRU
    item.lastAccessed = Date.now();
    return item.value;
  }

  /**
   * Set a value in the cache
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} [ttl] - Time to live in milliseconds (overrides default)
   * @returns {boolean} True if the value was set
   */
  set(key, value, ttl) {
    // If we've reached max size, remove the least recently used item
    if (this.store.size >= this.maxSize) {
      const lruKey = this._findLRUKey();
      if (lruKey) {
        this.store.delete(lruKey);
      } else {
        // If we can't find an LRU key, delete the first item
        const firstKey = this.store.keys().next().value;
        if (firstKey) this.store.delete(firstKey);
      }
    }

    const now = Date.now();
    const expiresAt = ttl !== undefined ? now + ttl : now + this.defaultTTL;

    this.store.set(key, {
      value,
      expiresAt,
      lastAccessed: now,
    });

    return true;
  }

  /**
   * Delete a value from the cache
   * @param {string} key - Cache key
   * @returns {boolean} True if the key existed and was deleted
   */
  delete(key) {
    return this.store.delete(key);
  }

  /**
   * Clear all items from the cache
   */
  clear() {
    this.store.clear();
  }

  /**
   * Get the number of items in the cache
   * @returns {number} Number of items in the cache
   */
  size() {
    return this.store.size;
  }

  /**
   * Clean up expired items from the cache
   * @private
   */
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.store.entries()) {
      if (item.expiresAt && item.expiresAt <= now) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Find the least recently used key
   * @private
   * @returns {string|undefined} The LRU key or undefined if cache is empty
   */
  _findLRUKey() {
    let lruKey;
    let oldestAccess = Infinity;

    for (const [key, item] of this.store.entries()) {
      if (item.lastAccessed < oldestAccess) {
        oldestAccess = item.lastAccessed;
        lruKey = key;
      }
    }

    return lruKey;
  }

  /**
   * Clean up resources when the cache is no longer needed
   */
  destroy() {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

export default Cache;
