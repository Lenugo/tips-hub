interface CacheEntry<T> {
  value: T
  cachedAt: number
}

export class FeedCache<T> {
  private store = new Map<string, CacheEntry<T>>()

  constructor(
    private ttlMs: number,
    private maxEntries = 40
  ) {}

  get(key: string, now: number = Date.now()): T | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined
    if (now - entry.cachedAt > this.ttlMs) {
      this.store.delete(key)
      return undefined
    }
    return entry.value
  }

  getStale(key: string): T | undefined {
    return this.store.get(key)?.value
  }

  set(key: string, value: T, now: number = Date.now()): void {
    this.store.set(key, { value, cachedAt: now })
    this.trim()
  }

  delete(key: string): void {
    this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }

  updateAll(mutator: (value: T) => T | undefined): void {
    for (const [key, entry] of this.store) {
      const next = mutator(entry.value)
      if (next !== undefined) {
        this.store.set(key, { value: next, cachedAt: entry.cachedAt })
      }
    }
  }

  private trim(): void {
    if (this.store.size <= this.maxEntries) return
    const oldest = [...this.store.entries()]
      .sort((a, b) => a[1].cachedAt - b[1].cachedAt)
      .slice(0, this.store.size - this.maxEntries)
    for (const [key] of oldest) {
      this.store.delete(key)
    }
  }
}