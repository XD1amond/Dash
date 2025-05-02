/**
 * Cache Manager
 * 
 * This utility provides caching functionality for data services.
 * It supports:
 * - Setting and getting cached data with TTL (Time To Live)
 * - Clearing cache entries by key or pattern
 * - Memory usage optimization
 * - Cache statistics
 */

/**
 * Cache Entry
 * Represents a single entry in the cache
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in seconds
  size: number; // Approximate size in bytes
}

/**
 * Cache Statistics
 * Provides statistics about the cache
 */
export interface CacheStats {
  entryCount: number;
  totalSize: number; // Approximate size in bytes
  oldestEntry: number; // Timestamp of oldest entry
  newestEntry: number; // Timestamp of newest entry
  hitCount: number;
  missCount: number;
  hitRate: number; // Hit rate as a percentage
}

/**
 * Cache Manager
 * Provides caching functionality for data services
 */
export class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private maxSize: number; // Maximum cache size in bytes
  private hitCount: number = 0;
  private missCount: number = 0;
  
  /**
   * Create a new CacheManager
   * 
   * @param maxSize - Maximum cache size in bytes (default: 100MB)
   */
  constructor(maxSize: number = 100 * 1024 * 1024) {
    this.maxSize = maxSize;
  }
  
  /**
   * Get data from cache
   * 
   * @param key - Cache key
   * @returns Cached data or undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    // Return undefined if entry doesn't exist
    if (!entry) {
      this.missCount++;
      return undefined;
    }
    
    // Check if entry has expired
    const now = Date.now();
    if (entry.ttl > 0 && now - entry.timestamp > entry.ttl * 1000) {
      this.cache.delete(key);
      this.missCount++;
      return undefined;
    }
    
    this.hitCount++;
    return entry.data as T;
  }
  
  /**
   * Set data in cache
   * 
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Time to live in seconds (0 for no expiration)
   * @returns True if data was cached successfully
   */
  set<T>(key: string, data: T, ttl: number = 0): boolean {
    try {
      // Calculate approximate size of data
      const jsonData = JSON.stringify(data);
      const size = jsonData.length * 2; // Approximate size in bytes (2 bytes per character)
      
      // Check if adding this entry would exceed the maximum cache size
      if (this.getTotalSize() + size > this.maxSize) {
        this.evictEntries(size);
      }
      
      // Store the entry
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl,
        size
      });
      
      return true;
    } catch (error) {
      console.error('Error setting cache entry:', error);
      return false;
    }
  }
  
  /**
   * Check if a key exists in the cache and is not expired
   * 
   * @param key - Cache key
   * @returns True if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }
    
    // Check if entry has expired
    const now = Date.now();
    if (entry.ttl > 0 && now - entry.timestamp > entry.ttl * 1000) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }
  
  /**
   * Delete a key from the cache
   * 
   * @param key - Cache key
   * @returns True if key was deleted
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
  
  /**
   * Clear all entries from the cache
   */
  clear(pattern?: RegExp): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    
    // Clear entries matching the pattern
    Array.from(this.cache.keys()).forEach(key => {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    });
  }
  
  /**
   * Get cache statistics
   * 
   * @returns Cache statistics
   */
  getStats(): CacheStats {
    let oldestEntry = Date.now();
    let newestEntry = 0;
    let totalSize = 0;
    
    Array.from(this.cache.values()).forEach(entry => {
      if (entry.timestamp < oldestEntry) {
        oldestEntry = entry.timestamp;
      }
      
      if (entry.timestamp > newestEntry) {
        newestEntry = entry.timestamp;
      }
      
      totalSize += entry.size;
    });
    
    const totalRequests = this.hitCount + this.missCount;
    const hitRate = totalRequests > 0 ? (this.hitCount / totalRequests) * 100 : 0;
    
    return {
      entryCount: this.cache.size,
      totalSize,
      oldestEntry,
      newestEntry,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate
    };
  }
  
  /**
   * Get the total size of all cache entries
   * 
   * @returns Total size in bytes
   */
  private getTotalSize(): number {
    let totalSize = 0;
    
    Array.from(this.cache.values()).forEach(entry => {
      totalSize += entry.size;
    });
    
    return totalSize;
  }
  
  /**
   * Evict entries to make room for a new entry
   * 
   * @param sizeNeeded - Size needed in bytes
   */
  private evictEntries(sizeNeeded: number): void {
    // Sort entries by timestamp (oldest first)
    const entries = Array.from(this.cache.entries()).sort((a, b) => {
      return a[1].timestamp - b[1].timestamp;
    });
    
    let sizeFreed = 0;
    
    // Evict entries until we have enough space
    for (const [key, entry] of entries) {
      this.cache.delete(key);
      sizeFreed += entry.size;
      
      if (sizeFreed >= sizeNeeded) {
        break;
      }
    }
  }
}