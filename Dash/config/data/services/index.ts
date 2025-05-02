/**
 * Data Services Index
 * 
 * This file exports all data services and related types.
 * Services are responsible for fetching, caching, and validating data from various sources.
 */

// Export the analytics service
export * from './analytics.service';

// Export the business service
export * from './business.service';

// Factory function to create services with consistent configuration
import { BaseAdapter, createAdapter, AdapterConfig } from '../adapters';
import { CacheManager } from '../utils/cache';
import { Logger } from '../utils/logger';
import { RealtimeManager } from '../realtime';
import { AnalyticsService, AnalyticsServiceConfig } from './analytics.service';
import { BusinessService, BusinessServiceConfig } from './business.service';

/**
 * Services Configuration
 * Configuration for creating services
 */
export interface ServicesConfig {
  /**
   * Adapter configuration
   */
  adapter: AdapterConfig;
  
  /**
   * Analytics service configuration
   */
  analytics?: AnalyticsServiceConfig;
  
  /**
   * Business service configuration
   */
  business?: BusinessServiceConfig;
  
  /**
   * Cache configuration
   */
  cache?: {
    /**
     * Maximum cache size in bytes
     */
    maxSize?: number;
  };
  
  /**
   * Realtime configuration
   */
  realtime?: {
    /**
     * Whether to enable realtime updates
     */
    enabled?: boolean;
    
    /**
     * Transport type
     */
    transport?: 'websocket' | 'sse' | 'polling';
    
    /**
     * WebSocket URL
     */
    websocketUrl?: string;
  };
  
  /**
   * Logging configuration
   */
  logging?: {
    /**
     * Log level
     */
    level?: 'debug' | 'info' | 'warn' | 'error';
    
    /**
     * Whether to include timestamps in log messages
     */
    timestamps?: boolean;
  };
}

/**
 * Data Services
 * Container for all data services
 */
export interface DataServices {
  /**
   * Analytics service
   */
  analytics: AnalyticsService;
  
  /**
   * Business service
   */
  business: BusinessService;
  
  /**
   * Cache manager
   */
  cache: CacheManager;
  
  /**
   * Realtime manager
   */
  realtime: RealtimeManager;
  
  /**
   * Data adapter
   */
  adapter: BaseAdapter;
}

/**
 * Create data services with consistent configuration
 *
 * @param config - Services configuration
 * @returns Data services
 */
export function createServices(config: ServicesConfig): DataServices {
  // Create adapter
  const adapter = createAdapter(config.adapter);
  
  // Create cache manager
  const cache = new CacheManager(config.cache?.maxSize);
  
  // Create realtime manager
  const realtime = new RealtimeManager({
    transport: config.realtime?.transport,
    websocket: config.realtime?.websocketUrl ? {
      url: config.realtime.websocketUrl
    } : undefined,
    autoConnect: config.realtime?.enabled
  });
  
  // Create logger
  const logger = new Logger({
    level: config.logging?.level || 'info',
    timestamps: config.logging?.timestamps !== false,
    context: 'DataServices'
  });
  
  // Create analytics service
  const analytics = new AnalyticsService(
    adapter,
    config.analytics,
    cache,
    realtime
  );
  
  // Create business service
  const business = new BusinessService(
    adapter,
    config.business,
    cache,
    realtime,
    logger.createChild('Business')
  );
  
  return {
    analytics,
    business,
    cache,
    realtime,
    adapter
  };
}

/**
 * Create data services with mock data
 *
 * @param delay - Delay in milliseconds before returning mock data
 * @returns Data services
 */
export function createMockServices(delay: number = 500): DataServices {
  return createServices({
    adapter: {
      type: 'mock',
      mockDelay: delay
    },
    analytics: {
      cacheTTL: {
        revenue: 60, // 1 minute
        sales: 60,
        visitors: 60,
        conversion: 60,
        statCard: 60
      },
      logPerformance: true
    },
    business: {
      cacheTTL: {
        revenueByChannel: 60,
        customerLifetimeValue: 60,
        businessPerformance: 60,
        marketShare: 60,
        businessGoals: 60,
        expenses: 60,
        profitMargin: 60,
        businessForecast: 60
      },
      logPerformance: true
    },
    realtime: {
      enabled: true
    },
    logging: {
      level: 'debug',
      timestamps: true
    }
  });
}