/**
 * Simple LRU Cache implementation for server-side caching
 */
interface CacheEntry<T> {
  value: T
  expiry: number
}

export class LRUCache<T> {
  private cache: Map<string, CacheEntry<T>>
  private maxSize: number
  private defaultTTL: number

  constructor(options: { maxSize?: number; defaultTTL: number }) {
    this.cache = new Map()
    this.maxSize = options.maxSize || 100
    this.defaultTTL = options.defaultTTL
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key)

    if (!entry) {
      return undefined
    }

    // Check if entry has expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key)
      return undefined
    }

    // Move to end (most recently used)
    this.cache.delete(key)
    this.cache.set(key, entry)

    return entry.value
  }

  set(key: string, value: T, ttl?: number): void {
    // Remove if exists (to update LRU order)
    if (this.cache.has(key)) {
      this.cache.delete(key)
    }

    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey !== undefined) {
        this.cache.delete(firstKey)
      }
    }

    const expiry = Date.now() + (ttl || this.defaultTTL)
    this.cache.set(key, { value, expiry })
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}
