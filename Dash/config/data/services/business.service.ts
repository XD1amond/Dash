/**
 * Business Data Service
 * 
 * This service provides methods for fetching business data with caching, validation, and error handling.
 * It implements production-level features like:
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
  RevenueByChannelItem,
  CustomerLifetimeValueItem,
  BusinessPerformanceMetric,
  MarketShareItem,
  BusinessGoal,
  ExpenseCategory,
  ProfitMarginData,
  BusinessForecast,
  BusinessFilterOptions,
  PaginatedRevenueByChannelResponse,
  PaginatedCustomerLifetimeValueResponse,
  PaginatedBusinessGoalsResponse
} from '../types/business.types';

import { PaginatedResponse } from '../types/analytics.types';

import {
  validateRevenueByChannelData,
  validateCustomerLifetimeValueData,
  validateBusinessPerformanceMetrics,
  validateBusinessGoals,
  validateExpenseCategories,
  paginatedRevenueByChannelSchema,
  paginatedCustomerLifetimeValueSchema,
  paginatedBusinessGoalsSchema,
  validateOrThrow
} from '../validation';

import { BaseAdapter } from '../adapters/base.adapter';
import { CacheManager } from '../utils/cache';
import { RealtimeManager } from '../realtime';
import { Logger } from '../utils/logger';

/**
 * Business Service Configuration
 */
export interface BusinessServiceConfig {
  /**
   * Cache TTL in seconds for different data types
   */
  cacheTTL?: {
    revenueByChannel?: number;
    customerLifetimeValue?: number;
    businessPerformance?: number;
    marketShare?: number;
    businessGoals?: number;
    expenses?: number;
    profitMargin?: number;
    businessForecast?: number;
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
  
  /**
   * Log level
   */
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: BusinessServiceConfig = {
  cacheTTL: {
    revenueByChannel: 5 * 60, // 5 minutes
    customerLifetimeValue: 10 * 60, // 10 minutes
    businessPerformance: 5 * 60,
    marketShare: 30 * 60, // 30 minutes
    businessGoals: 15 * 60, // 15 minutes
    expenses: 10 * 60,
    profitMargin: 10 * 60,
    businessForecast: 30 * 60
  },
  defaultPageSize: 20,
  enableRealtime: true,
  logPerformance: false,
  logLevel: 'info'
};

/**
 * Business Data Service
 * 
 * Provides methods for fetching business data with caching, validation, and error handling.
 */
export class BusinessService {
  private adapter: BaseAdapter;
  private cache: CacheManager;
  private realtime: RealtimeManager;
  private config: BusinessServiceConfig;
  private logger: Logger;
  
  /**
   * Create a new BusinessService
   * 
   * @param adapter - Data adapter for fetching data
   * @param config - Service configuration
   * @param cache - Cache manager (optional, will create one if not provided)
   * @param realtime - Realtime manager (optional, will create one if not provided)
   * @param logger - Logger (optional, will create one if not provided)
   */
  constructor(
    adapter: BaseAdapter,
    config: BusinessServiceConfig = {},
    cache?: CacheManager,
    realtime?: RealtimeManager,
    logger?: Logger
  ) {
    this.adapter = adapter;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.cache = cache || new CacheManager();
    this.realtime = realtime || new RealtimeManager();
    this.logger = logger || new Logger(this.config.logLevel || 'info');
  }
  
  /**
   * Fetch revenue by channel data
   * 
   * @param from - Start date for the data range
   * @param to - End date for the data range
   * @param page - Page number for pagination (1-based)
   * @param pageSize - Number of items per page
   * @returns Promise with paginated revenue by channel data
   */
  async fetchRevenueByChannel(
    from: Date,
    to: Date,
    page: number = 1,
    pageSize: number = this.config.defaultPageSize || 20
  ): Promise<PaginatedResponse<RevenueByChannelItem>> {
    try {
      // Start performance measurement if enabled
      const startTime = this.config.logPerformance ? performance.now() : 0;
      
      // Validate inputs
      if (from > to) {
        const error = new Error('Start date must be before or equal to end date');
        this.logger.error('Input validation error in fetchRevenueByChannel:', error);
        throw error;
      }
      
      // Check cache first
      const cacheKey = `revenue-by-channel-${from.toISOString()}-${to.toISOString()}-${page}-${pageSize}`;
      const cachedData = this.cache.get<PaginatedResponse<RevenueByChannelItem>>(cacheKey);
      
      if (cachedData) {
        if (this.config.logPerformance) {
          this.logger.debug(`Cache hit for ${cacheKey}, returned in ${performance.now() - startTime}ms`);
        }
        return cachedData;
      }
      
      // Fetch data from adapter
      this.logger.info(`Fetching revenue by channel data from ${from.toISOString()} to ${to.toISOString()}`);
      const result = await this.adapter.fetchData<unknown>(
        'business/revenue-by-channel',
        {
          from: from.toISOString(),
          to: to.toISOString(),
          page,
          pageSize
        }
      );
      
      // Validate response data
      const validatedData = validateOrThrow<PaginatedResponse<RevenueByChannelItem>>(
        paginatedRevenueByChannelSchema,
        result,
        'Invalid revenue by channel data from adapter'
      );
      
      // Cache the result
      const cacheTTL = this.config.cacheTTL?.revenueByChannel || DEFAULT_CONFIG.cacheTTL?.revenueByChannel;
      if (cacheTTL) {
        this.cache.set(cacheKey, validatedData, cacheTTL);
      }
      
      // Log performance if enabled
      if (this.config.logPerformance) {
        this.logger.debug(`Fetched revenue by channel data in ${performance.now() - startTime}ms`);
      }
      
      return validatedData;
    } catch (error) {
      this.logger.error('Error fetching revenue by channel data:', error);
      throw new Error(`Failed to fetch revenue by channel data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Fetch customer lifetime value data
   * 
   * @param from - Start date for the data range
   * @param to - End date for the data range
   * @param page - Page number for pagination (1-based)
   * @param pageSize - Number of items per page
   * @returns Promise with paginated customer lifetime value data
   */
  async fetchCustomerLifetimeValue(
    from: Date,
    to: Date,
    page: number = 1,
    pageSize: number = this.config.defaultPageSize || 20
  ): Promise<PaginatedResponse<CustomerLifetimeValueItem>> {
    try {
      // Start performance measurement if enabled
      const startTime = this.config.logPerformance ? performance.now() : 0;
      
      // Validate inputs
      if (from > to) {
        const error = new Error('Start date must be before or equal to end date');
        this.logger.error('Input validation error in fetchCustomerLifetimeValue:', error);
        throw error;
      }
      
      // Check cache first
      const cacheKey = `customer-ltv-${from.toISOString()}-${to.toISOString()}-${page}-${pageSize}`;
      const cachedData = this.cache.get<PaginatedResponse<CustomerLifetimeValueItem>>(cacheKey);
      
      if (cachedData) {
        if (this.config.logPerformance) {
          this.logger.debug(`Cache hit for ${cacheKey}, returned in ${performance.now() - startTime}ms`);
        }
        return cachedData;
      }
      
      // Fetch data from adapter
      this.logger.info(`Fetching customer lifetime value data from ${from.toISOString()} to ${to.toISOString()}`);
      const result = await this.adapter.fetchData<unknown>(
        'business/customer-lifetime-value',
        {
          from: from.toISOString(),
          to: to.toISOString(),
          page,
          pageSize
        }
      );
      
      // Validate response data
      const validatedData = validateOrThrow<PaginatedResponse<CustomerLifetimeValueItem>>(
        paginatedCustomerLifetimeValueSchema,
        result,
        'Invalid customer lifetime value data from adapter'
      );
      
      // Cache the result
      const cacheTTL = this.config.cacheTTL?.customerLifetimeValue || DEFAULT_CONFIG.cacheTTL?.customerLifetimeValue;
      if (cacheTTL) {
        this.cache.set(cacheKey, validatedData, cacheTTL);
      }
      
      // Log performance if enabled
      if (this.config.logPerformance) {
        this.logger.debug(`Fetched customer lifetime value data in ${performance.now() - startTime}ms`);
      }
      
      return validatedData;
    } catch (error) {
      this.logger.error('Error fetching customer lifetime value data:', error);
      throw new Error(`Failed to fetch customer lifetime value data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Fetch business performance metrics
   * 
   * @param from - Start date for the data range
   * @param to - End date for the data range
   * @returns Promise with business performance metrics
   */
  async fetchBusinessPerformanceMetrics(
    from: Date,
    to: Date
  ): Promise<BusinessPerformanceMetric[]> {
    try {
      // Start performance measurement if enabled
      const startTime = this.config.logPerformance ? performance.now() : 0;
      
      // Validate inputs
      if (from > to) {
        const error = new Error('Start date must be before or equal to end date');
        this.logger.error('Input validation error in fetchBusinessPerformanceMetrics:', error);
        throw error;
      }
      
      // Check cache first
      const cacheKey = `business-performance-${from.toISOString()}-${to.toISOString()}`;
      const cachedData = this.cache.get<BusinessPerformanceMetric[]>(cacheKey);
      
      if (cachedData) {
        if (this.config.logPerformance) {
          this.logger.debug(`Cache hit for ${cacheKey}, returned in ${performance.now() - startTime}ms`);
        }
        return cachedData;
      }
      
      // Fetch data from adapter
      this.logger.info(`Fetching business performance metrics from ${from.toISOString()} to ${to.toISOString()}`);
      const result = await this.adapter.fetchData<unknown>(
        'business/performance-metrics',
        {
          from: from.toISOString(),
          to: to.toISOString()
        }
      );
      
      // Validate response data
      const validatedData = validateOrThrow<BusinessPerformanceMetric[]>(
        z.array(z.object({
          metric: z.string().min(1),
          value: z.number(),
          previousValue: z.number(),
          change: z.number(),
          target: z.number(),
          unit: z.string(),
          isPositive: z.boolean()
        })),
        result,
        'Invalid business performance metrics from adapter'
      );
      
      // Cache the result
      const cacheTTL = this.config.cacheTTL?.businessPerformance || DEFAULT_CONFIG.cacheTTL?.businessPerformance;
      if (cacheTTL) {
        this.cache.set(cacheKey, validatedData, cacheTTL);
      }
      
      // Log performance if enabled
      if (this.config.logPerformance) {
        this.logger.debug(`Fetched business performance metrics in ${performance.now() - startTime}ms`);
      }
      
      return validatedData;
    } catch (error) {
      this.logger.error('Error fetching business performance metrics:', error);
      throw new Error(`Failed to fetch business performance metrics: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Fetch business goals
   * 
   * @param status - Optional status filter
   * @param page - Page number for pagination (1-based)
   * @param pageSize - Number of items per page
   * @returns Promise with paginated business goals
   */
  async fetchBusinessGoals(
    status?: 'on-track' | 'at-risk' | 'behind' | 'completed',
    page: number = 1,
    pageSize: number = this.config.defaultPageSize || 20
  ): Promise<PaginatedResponse<BusinessGoal>> {
    try {
      // Start performance measurement if enabled
      const startTime = this.config.logPerformance ? performance.now() : 0;
      
      // Check cache first
      const cacheKey = `business-goals-${status || 'all'}-${page}-${pageSize}`;
      const cachedData = this.cache.get<PaginatedResponse<BusinessGoal>>(cacheKey);
      
      if (cachedData) {
        if (this.config.logPerformance) {
          this.logger.debug(`Cache hit for ${cacheKey}, returned in ${performance.now() - startTime}ms`);
        }
        return cachedData;
      }
      
      // Fetch data from adapter
      this.logger.info(`Fetching business goals with status ${status || 'all'}`);
      const result = await this.adapter.fetchData<unknown>(
        'business/goals',
        {
          status,
          page,
          pageSize
        }
      );
      
      // Validate response data
      const validatedData = validateOrThrow<PaginatedResponse<BusinessGoal>>(
        paginatedBusinessGoalsSchema,
        result,
        'Invalid business goals from adapter'
      );
      
      // Cache the result
      const cacheTTL = this.config.cacheTTL?.businessGoals || DEFAULT_CONFIG.cacheTTL?.businessGoals;
      if (cacheTTL) {
        this.cache.set(cacheKey, validatedData, cacheTTL);
      }
      
      // Log performance if enabled
      if (this.config.logPerformance) {
        this.logger.debug(`Fetched business goals in ${performance.now() - startTime}ms`);
      }
      
      return validatedData;
    } catch (error) {
      this.logger.error('Error fetching business goals:', error);
      throw new Error(`Failed to fetch business goals: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Subscribe to real-time business goal updates
   * 
   * @param callback - Function to call when new data is available
   * @param options - Filter options for the subscription
   * @returns Unsubscribe function
   */
  subscribeToBusinessGoalUpdates(
    callback: (data: BusinessGoal) => void,
    options?: BusinessFilterOptions
  ): () => void {
    if (!this.config.enableRealtime) {
      this.logger.warn('Real-time updates are disabled in the configuration');
      return () => {}; // No-op unsubscribe function
    }
    
    this.logger.info('Subscribing to business goal updates');
    return this.realtime.subscribe('business/goals', callback, options);
  }
  
  /**
   * Clear all business data from cache
   */
  clearCache(): void {
    this.logger.info('Clearing business data cache');
    this.cache.clear(/^(revenue-by-channel|customer-ltv|business-performance|business-goals)/);
  }
}