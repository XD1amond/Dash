/**
 * Analytics Data Service
 * 
 * This service provides methods for fetching analytics data with caching, validation, and error handling.
 * It implements the data fetching functions defined in the original data.config.ts but with
 * production-level features like:
 * 
 * - Input validation
 * - Response validation
 * - Caching
 * - Error handling
 * - Pagination
 * - Real-time updates
 */

import { z } from 'zod';
import {
  RevenueDataPoint,
  SalesDataPoint,
  VisitorsDataPoint,
  ConversionDataPoint,
  StatCardDataPoint,
  PaginatedResponse,
  FilterOptions
} from '../types/analytics.types';

import {
  validateRevenueData,
  validateSalesData,
  validateVisitorsData,
  validateConversionData,
  validateStatCardData,
  validateFilterOptions,
  paginatedRevenueDataSchema,
  paginatedSalesDataSchema,
  paginatedVisitorsDataSchema,
  paginatedConversionDataSchema,
  validateOrThrow
} from '../validation';

import { BaseAdapter } from '../adapters/base.adapter';
import { CacheManager } from '../utils/cache';
import { RealtimeManager } from '../realtime';

/**
 * Analytics Service Configuration
 */
export interface AnalyticsServiceConfig {
  /**
   * Cache TTL in seconds for different data types
   */
  cacheTTL?: {
    revenue?: number;
    sales?: number;
    visitors?: number;
    conversion?: number;
    statCard?: number;
  };
  
  /**
   * Default page size for paginated requests
   */
  defaultPageSize?: number;
  
  /**
   * Whether to enable real-time updates
   */
  enableRealtime?: boolean;
  
  /**
   * Whether to log performance metrics
   */
  logPerformance?: boolean;
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: AnalyticsServiceConfig = {
  cacheTTL: {
    revenue: 5 * 60, // 5 minutes
    sales: 5 * 60,
    visitors: 5 * 60,
    conversion: 5 * 60,
    statCard: 2 * 60 // 2 minutes
  },
  defaultPageSize: 20,
  enableRealtime: true,
  logPerformance: false
};

/**
 * Analytics Data Service
 * 
 * Provides methods for fetching analytics data with caching, validation, and error handling.
 */
export class AnalyticsService {
  private adapter: BaseAdapter;
  private cache: CacheManager;
  private realtime: RealtimeManager;
  private config: AnalyticsServiceConfig;
  
  /**
   * Create a new AnalyticsService
   * 
   * @param adapter - Data adapter for fetching data
   * @param config - Service configuration
   * @param cache - Cache manager (optional, will create one if not provided)
   * @param realtime - Realtime manager (optional, will create one if not provided)
   */
  constructor(
    adapter: BaseAdapter,
    config: AnalyticsServiceConfig = {},
    cache?: CacheManager,
    realtime?: RealtimeManager
  ) {
    this.adapter = adapter;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.cache = cache || new CacheManager();
    this.realtime = realtime || new RealtimeManager();
  }
  
  /**
   * Fetch revenue data for a specified date range with pagination
   * 
   * @param from - Start date for the data range
   * @param to - End date for the data range
   * @param interval - Data aggregation interval (day, week, month)
   * @param page - Page number for pagination (1-based)
   * @param pageSize - Number of items per page
   * @returns Promise with paginated revenue data
   */
  async fetchRevenueData(
    from: Date,
    to: Date,
    interval: 'day' | 'week' | 'month' = 'month',
    page: number = 1,
    pageSize: number = this.config.defaultPageSize || 20
  ): Promise<PaginatedResponse<RevenueDataPoint>> {
    try {
      // Start performance measurement if enabled
      const startTime = this.config.logPerformance ? performance.now() : 0;
      
      // Validate inputs
      if (from > to) {
        throw new Error('Start date must be before or equal to end date');
      }
      
      // Check cache first
      const cacheKey = `revenue-${from.toISOString()}-${to.toISOString()}-${interval}-${page}-${pageSize}`;
      const cachedData = this.cache.get<PaginatedResponse<RevenueDataPoint>>(cacheKey);
      
      if (cachedData) {
        if (this.config.logPerformance) {
          console.log(`Cache hit for ${cacheKey}, returned in ${performance.now() - startTime}ms`);
        }
        return cachedData;
      }
      
      // Fetch data from adapter
      const result = await this.adapter.fetchData<unknown>(
        'analytics/revenue',
        {
          from: from.toISOString(),
          to: to.toISOString(),
          interval,
          page,
          pageSize
        }
      );
      
      // Validate response data
      const validatedData = validateOrThrow<PaginatedResponse<RevenueDataPoint>>(
        paginatedRevenueDataSchema,
        result,
        'Invalid revenue data from adapter'
      );
      
      // Cache the result
      const cacheTTL = this.config.cacheTTL?.revenue || DEFAULT_CONFIG.cacheTTL?.revenue;
      if (cacheTTL) {
        this.cache.set(cacheKey, validatedData, cacheTTL);
      }
      
      // Log performance if enabled
      if (this.config.logPerformance) {
        console.log(`Fetched revenue data in ${performance.now() - startTime}ms`);
      }
      
      return validatedData;
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      throw new Error(`Failed to fetch revenue data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Fetch sales data by category
   * 
   * @param from - Start date for the data range
   * @param to - End date for the data range
   * @param page - Page number for pagination (1-based)
   * @param pageSize - Number of items per page
   * @returns Promise with paginated sales data
   */
  async fetchSalesByCategory(
    from: Date,
    to: Date,
    page: number = 1,
    pageSize: number = this.config.defaultPageSize || 20
  ): Promise<PaginatedResponse<SalesDataPoint>> {
    try {
      // Start performance measurement if enabled
      const startTime = this.config.logPerformance ? performance.now() : 0;
      
      // Validate inputs
      if (from > to) {
        throw new Error('Start date must be before or equal to end date');
      }
      
      // Check cache first
      const cacheKey = `sales-${from.toISOString()}-${to.toISOString()}-${page}-${pageSize}`;
      const cachedData = this.cache.get<PaginatedResponse<SalesDataPoint>>(cacheKey);
      
      if (cachedData) {
        if (this.config.logPerformance) {
          console.log(`Cache hit for ${cacheKey}, returned in ${performance.now() - startTime}ms`);
        }
        return cachedData;
      }
      
      // Fetch data from adapter
      const result = await this.adapter.fetchData<unknown>(
        'analytics/sales',
        {
          from: from.toISOString(),
          to: to.toISOString(),
          page,
          pageSize
        }
      );
      
      // Validate response data
      const validatedData = validateOrThrow<PaginatedResponse<SalesDataPoint>>(
        paginatedSalesDataSchema,
        result,
        'Invalid sales data from adapter'
      );
      
      // Cache the result
      const cacheTTL = this.config.cacheTTL?.sales || DEFAULT_CONFIG.cacheTTL?.sales;
      if (cacheTTL) {
        this.cache.set(cacheKey, validatedData, cacheTTL);
      }
      
      // Log performance if enabled
      if (this.config.logPerformance) {
        console.log(`Fetched sales data in ${performance.now() - startTime}ms`);
      }
      
      return validatedData;
    } catch (error) {
      console.error('Error fetching sales data:', error);
      throw new Error(`Failed to fetch sales data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Fetch visitors data by source
   * 
   * @param from - Start date for the data range
   * @param to - End date for the data range
   * @param page - Page number for pagination (1-based)
   * @param pageSize - Number of items per page
   * @returns Promise with paginated visitors data
   */
  async fetchVisitorsBySource(
    from: Date,
    to: Date,
    page: number = 1,
    pageSize: number = this.config.defaultPageSize || 20
  ): Promise<PaginatedResponse<VisitorsDataPoint>> {
    try {
      // Start performance measurement if enabled
      const startTime = this.config.logPerformance ? performance.now() : 0;
      
      // Validate inputs
      if (from > to) {
        throw new Error('Start date must be before or equal to end date');
      }
      
      // Check cache first
      const cacheKey = `visitors-${from.toISOString()}-${to.toISOString()}-${page}-${pageSize}`;
      const cachedData = this.cache.get<PaginatedResponse<VisitorsDataPoint>>(cacheKey);
      
      if (cachedData) {
        if (this.config.logPerformance) {
          console.log(`Cache hit for ${cacheKey}, returned in ${performance.now() - startTime}ms`);
        }
        return cachedData;
      }
      
      // Fetch data from adapter
      const result = await this.adapter.fetchData<unknown>(
        'analytics/visitors',
        {
          from: from.toISOString(),
          to: to.toISOString(),
          page,
          pageSize
        }
      );
      
      // Validate response data
      const validatedData = validateOrThrow<PaginatedResponse<VisitorsDataPoint>>(
        paginatedVisitorsDataSchema,
        result,
        'Invalid visitors data from adapter'
      );
      
      // Cache the result
      const cacheTTL = this.config.cacheTTL?.visitors || DEFAULT_CONFIG.cacheTTL?.visitors;
      if (cacheTTL) {
        this.cache.set(cacheKey, validatedData, cacheTTL);
      }
      
      // Log performance if enabled
      if (this.config.logPerformance) {
        console.log(`Fetched visitors data in ${performance.now() - startTime}ms`);
      }
      
      return validatedData;
    } catch (error) {
      console.error('Error fetching visitors data:', error);
      throw new Error(`Failed to fetch visitors data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Fetch conversion rate data
   * 
   * @param from - Start date for the data range
   * @param to - End date for the data range
   * @param interval - Data aggregation interval (day, week, month)
   * @param page - Page number for pagination (1-based)
   * @param pageSize - Number of items per page
   * @returns Promise with paginated conversion data
   */
  async fetchConversionData(
    from: Date,
    to: Date,
    interval: 'day' | 'week' | 'month' = 'month',
    page: number = 1,
    pageSize: number = this.config.defaultPageSize || 20
  ): Promise<PaginatedResponse<ConversionDataPoint>> {
    try {
      // Start performance measurement if enabled
      const startTime = this.config.logPerformance ? performance.now() : 0;
      
      // Validate inputs
      if (from > to) {
        throw new Error('Start date must be before or equal to end date');
      }
      
      // Check cache first
      const cacheKey = `conversion-${from.toISOString()}-${to.toISOString()}-${interval}-${page}-${pageSize}`;
      const cachedData = this.cache.get<PaginatedResponse<ConversionDataPoint>>(cacheKey);
      
      if (cachedData) {
        if (this.config.logPerformance) {
          console.log(`Cache hit for ${cacheKey}, returned in ${performance.now() - startTime}ms`);
        }
        return cachedData;
      }
      
      // Fetch data from adapter
      const result = await this.adapter.fetchData<unknown>(
        'analytics/conversion',
        {
          from: from.toISOString(),
          to: to.toISOString(),
          interval,
          page,
          pageSize
        }
      );
      
      // Validate response data
      const validatedData = validateOrThrow<PaginatedResponse<ConversionDataPoint>>(
        paginatedConversionDataSchema,
        result,
        'Invalid conversion data from adapter'
      );
      
      // Cache the result
      const cacheTTL = this.config.cacheTTL?.conversion || DEFAULT_CONFIG.cacheTTL?.conversion;
      if (cacheTTL) {
        this.cache.set(cacheKey, validatedData, cacheTTL);
      }
      
      // Log performance if enabled
      if (this.config.logPerformance) {
        console.log(`Fetched conversion data in ${performance.now() - startTime}ms`);
      }
      
      return validatedData;
    } catch (error) {
      console.error('Error fetching conversion data:', error);
      throw new Error(`Failed to fetch conversion data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Fetch key stat metrics
   * 
   * @returns Promise with stat card data
   */
  async fetchStatCardData(): Promise<StatCardDataPoint[]> {
    try {
      // Start performance measurement if enabled
      const startTime = this.config.logPerformance ? performance.now() : 0;
      
      // Check cache first
      const cacheKey = 'stat-cards';
      const cachedData = this.cache.get<StatCardDataPoint[]>(cacheKey);
      
      if (cachedData) {
        if (this.config.logPerformance) {
          console.log(`Cache hit for ${cacheKey}, returned in ${performance.now() - startTime}ms`);
        }
        return cachedData;
      }
      
      // Fetch data from adapter
      const result = await this.adapter.fetchData<unknown>('analytics/stats');
      
      // Validate response data
      const validatedData = validateOrThrow<StatCardDataPoint[]>(
        z.array(z.object({
          title: z.string().min(1),
          value: z.string().min(1),
          change: z.number(),
          changeType: z.enum(['increase', 'decrease'])
        })),
        result,
        'Invalid stat card data from adapter'
      );
      
      // Cache the result
      const cacheTTL = this.config.cacheTTL?.statCard || DEFAULT_CONFIG.cacheTTL?.statCard;
      if (cacheTTL) {
        this.cache.set(cacheKey, validatedData, cacheTTL);
      }
      
      // Log performance if enabled
      if (this.config.logPerformance) {
        console.log(`Fetched stat card data in ${performance.now() - startTime}ms`);
      }
      
      return validatedData;
    } catch (error) {
      console.error('Error fetching stat card data:', error);
      throw new Error(`Failed to fetch stat card data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Subscribe to real-time revenue updates
   * 
   * @param callback - Function to call when new data is available
   * @param options - Filter options for the subscription
   * @returns Unsubscribe function
   */
  subscribeToRevenueUpdates(
    callback: (data: RevenueDataPoint) => void,
    options?: FilterOptions
  ): () => void {
    if (!this.config.enableRealtime) {
      console.warn('Real-time updates are disabled in the configuration');
      return () => {}; // No-op unsubscribe function
    }
    
    return this.realtime.subscribe('analytics/revenue', callback, options);
  }
  
  /**
   * Subscribe to real-time conversion updates
   * 
   * @param callback - Function to call when new data is available
   * @param options - Filter options for the subscription
   * @returns Unsubscribe function
   */
  subscribeToConversionUpdates(
    callback: (data: ConversionDataPoint) => void,
    options?: FilterOptions
  ): () => void {
    if (!this.config.enableRealtime) {
      console.warn('Real-time updates are disabled in the configuration');
      return () => {}; // No-op unsubscribe function
    }
    
    return this.realtime.subscribe('analytics/conversion', callback, options);
  }
  
  /**
   * Clear all analytics data from cache
   */
  clearCache(): void {
    this.cache.clear(/^(revenue|sales|visitors|conversion|stat-cards)/);
  }
}