/**
 * Analytics Data Types
 * 
 * This file defines TypeScript interfaces for analytics data types.
 * These types are used throughout the application to ensure type safety.
 */

/**
 * Revenue Data Point
 * Represents a single data point in a revenue chart
 */
export interface RevenueDataPoint {
  /**
   * Date in YYYY-MM or YYYY-MM-DD format
   */
  date: string;
  
  /**
   * Revenue amount
   */
  revenue: number;
}

/**
 * Sales Data Point
 * Represents a single data point in a sales by category chart
 */
export interface SalesDataPoint {
  /**
   * Category name
   */
  name: string;
  
  /**
   * Sales value
   */
  value: number;
  
  /**
   * Color for the category (hex code)
   */
  color?: string;
}

/**
 * Visitors Data Point
 * Represents a single data point in a visitors by source chart
 */
export interface VisitorsDataPoint {
  /**
   * Traffic source name
   */
  name: string;
  
  /**
   * Number of visitors
   */
  value: number;
  
  /**
   * Color for the source (hex code)
   */
  color?: string;
}

/**
 * Conversion Data Point
 * Represents a single data point in a conversion rate chart
 */
export interface ConversionDataPoint {
  /**
   * Date in YYYY-MM or YYYY-MM-DD format
   */
  date: string;
  
  /**
   * Conversion rate (percentage)
   */
  conversion: number;
}

/**
 * Stat Card Data Point
 * Represents a single stat card
 */
export interface StatCardDataPoint {
  /**
   * Metric name
   */
  title: string;
  
  /**
   * Formatted value (e.g. "$1,234.56")
   */
  value: string;
  
  /**
   * Percentage change
   */
  change: number;
  
  /**
   * Whether the change is an increase or decrease
   */
  changeType: 'increase' | 'decrease';
}

/**
 * Sales Funnel Data Point
 * Represents a single stage in a sales funnel
 */
export interface SalesFunnelDataPoint {
  /**
   * Stage name
   */
  stage: string;
  
  /**
   * Number of users/customers at this stage
   */
  count: number;
  
  /**
   * Percentage of users/customers at this stage relative to the first stage
   */
  percentage: number;
}

/**
 * Cohort Analysis Data Point
 * Represents a single cohort in a cohort analysis
 */
export interface CohortAnalysisDataPoint {
  /**
   * Cohort identifier (e.g. "Jan 2023")
   */
  cohort: string;
  
  /**
   * Retention rates for each month
   * Keys are "Month 0", "Month 1", etc.
   */
  [key: string]: string;
}

/**
 * A/B Testing Result
 * Represents the result of an A/B test
 */
export interface ABTestingResult {
  /**
   * Test name
   */
  test: string;
  
  /**
   * Variant identifier
   */
  variant: string;
  
  /**
   * Metric name
   */
  metric: string;
  
  /**
   * Result value
   */
  value: string;
  
  /**
   * Change from control
   */
  change: string;
  
  /**
   * Whether this variant is the winner
   */
  isWinner?: boolean;
}

/**
 * Pagination Information
 * Represents pagination metadata
 */
export interface PaginationInfo {
  /**
   * Total number of items
   */
  total: number;
  
  /**
   * Current page number (1-based)
   */
  page: number;
  
  /**
   * Number of items per page
   */
  pageSize: number;
  
  /**
   * Total number of pages
   */
  totalPages: number;
  
  /**
   * Whether there is a next page
   */
  hasNextPage: boolean;
  
  /**
   * Whether there is a previous page
   */
  hasPreviousPage: boolean;
}

/**
 * Paginated Response
 * Generic interface for paginated responses
 */
export interface PaginatedResponse<T> {
  /**
   * Array of data items
   */
  data: T[];
  
  /**
   * Pagination information
   */
  pagination: PaginationInfo;
}

/**
 * Filter Options
 * Options for filtering data
 */
export interface FilterOptions {
  /**
   * Date range
   */
  dateRange?: {
    from: Date;
    to: Date;
  };
  
  /**
   * Categories to filter by
   */
  categories?: string[];
  
  /**
   * Search query
   */
  search?: string;
  
  /**
   * Field to sort by
   */
  sortBy?: string;
  
  /**
   * Sort order
   */
  sortOrder?: 'asc' | 'desc';
}