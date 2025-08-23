'use client'

/**
 * Offline Cache Service
 * Handles caching strategies for offline functionality
 */

interface CacheItem {
  key: string
  value: any
  timestamp: number
  ttl?: number // time to live in milliseconds
}

class OfflineCacheService {
  private cache = new Map<string, CacheItem>()
  private storageKey = 'flowsync_offline_cache'

  constructor() {
    this.loadFromStorage()
    this.startCleanupTimer()
  }

  set(key: string, value: any, ttl?: number): void {
    const item: CacheItem = {
      key,
      value,
      timestamp: Date.now(),
      ttl
    }
    
    this.cache.set(key, item)
    this.saveToStorage()
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null

    // Check if item has expired
    if (item.ttl && Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      this.saveToStorage()
      return null
    }

    return item.value
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key)
    if (deleted) {
      this.saveToStorage()
    }
    return deleted
  }

  clear(): void {
    this.cache.clear()
    this.saveToStorage()
  }

  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false

    // Check if item has expired
    if (item.ttl && Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      this.saveToStorage()
      return false
    }

    return true
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        const items = JSON.parse(stored) as CacheItem[]
        items.forEach(item => {
          this.cache.set(item.key, item)
        })
      }
    } catch (error) {
      console.error('Failed to load offline cache from storage:', error)
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const items = Array.from(this.cache.values())
      localStorage.setItem(this.storageKey, JSON.stringify(items))
    } catch (error) {
      console.error('Failed to save offline cache to storage:', error)
    }
  }

  private startCleanupTimer(): void {
    if (typeof window === 'undefined') return

    // Clean expired items every 5 minutes
    setInterval(() => {
      const now = Date.now()
      let hasExpired = false

      for (const [key, item] of Array.from(this.cache.entries())) {
        if (item.ttl && now - item.timestamp > item.ttl) {
          this.cache.delete(key)
          hasExpired = true
        }
      }

      if (hasExpired) {
        this.saveToStorage()
      }
    }, 5 * 60 * 1000)
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

// Create singleton instance
export const offlineCache = new OfflineCacheService()

// Hook for React components
export function useOfflineCache() {
  return {
    set: offlineCache.set.bind(offlineCache),
    get: offlineCache.get.bind(offlineCache),
    delete: offlineCache.delete.bind(offlineCache),
    clear: offlineCache.clear.bind(offlineCache),
    has: offlineCache.has.bind(offlineCache),
    getStats: offlineCache.getStats.bind(offlineCache)
  }
}

// Additional system functions
export function getCacheSystem() {
  return {
    cache: offlineCache,
    stats: offlineCache.getStats(),
    isAvailable: typeof window !== 'undefined' && 'localStorage' in window
  }
}

export default offlineCache