/**
 * Business Data Types
 * 
 * This file defines TypeScript interfaces for business data types.
 * These types are used throughout the application to ensure type safety.
 */

import { PaginatedResponse, PaginationInfo, FilterOptions } from './analytics.types';

/**
 * Revenue By Channel Item
 * Represents revenue data broken down by channel
 */
export interface RevenueByChannelItem {
  /**
   * Channel name (e.g., "Direct", "Organic", "Social")
   */
  channel: string;
  
  /**
   * Formatted revenue (e.g., "$12,345.67")
   */
  revenue: string;
  
  /**
   * Percentage of total revenue
   */
  percentage: number;
  
  /**
   * Raw revenue amount (unformatted)
   */
  rawRevenue?: number;
}

/**
 * Customer Lifetime Value Item
 * Represents customer lifetime value data by segment
 */
export interface CustomerLifetimeValueItem {
  /**
   * Customer segment name
   */
  segment: string;
  
  /**
   * Formatted lifetime value (e.g., "$1,234.56")
   */
  value: string;
  
  /**
   * Average number of orders
   */
  orders: string;
  
  /**
   * Retention rate
   */
  retention: string;
  
  /**
   * Raw lifetime value (unformatted)
   */
  rawValue?: number;
}

/**
 * Business Performance Metric
 * Represents a business performance metric
 */
export interface BusinessPerformanceMetric {
  /**
   * Metric name
   */
  metric: string;
  
  /**
   * Current value
   */
  value: number;
  
  /**
   * Previous value
   */
  previousValue: number;
  
  /**
   * Change from previous value
   */
  change: number;
  
  /**
   * Target value
   */
  target: number;
  
  /**
   * Unit of measurement
   */
  unit: string;
  
  /**
   * Whether the change is positive
   */
  isPositive: boolean;
}

/**
 * Market Share Item
 * Represents market share data for a competitor
 */
export interface MarketShareItem {
  /**
   * Competitor name
   */
  name: string;
  
  /**
   * Market share percentage
   */
  share: number;
  
  /**
   * Change in market share
   */
  change: number;
  
  /**
   * Color for the competitor (hex code)
   */
  color?: string;
}

/**
 * Business Goal
 * Represents a business goal or KPI
 */
export interface BusinessGoal {
  /**
   * Goal ID
   */
  id: string;
  
  /**
   * Goal name
   */
  name: string;
  
  /**
   * Target value
   */
  target: number;
  
  /**
   * Current value
   */
  current: number;
  
  /**
   * Unit of measurement
   */
  unit: string;
  
  /**
   * Deadline date (ISO string)
   */
  deadline: string;
  
  /**
   * Start date (ISO string)
   */
  startDate: string;
  
  /**
   * Progress percentage
   */
  progress: number;
  
  /**
   * Goal status
   */
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
}

/**
 * Expense Category
 * Represents an expense category
 */
export interface ExpenseCategory {
  /**
   * Category name
   */
  category: string;
  
  /**
   * Expense amount
   */
  amount: number;
  
  /**
   * Budget amount
   */
  budget: number;
  
  /**
   * Percentage of total expenses
   */
  percentage: number;
  
  /**
   * Variance from budget
   */
  variance: number;
}

/**
 * Profit Margin Data
 * Represents profit margin data for a product or category
 */
export interface ProfitMarginData {
  /**
   * Item name (product or category)
   */
  item: string;
  
  /**
   * Revenue amount
   */
  revenue: number;
  
  /**
   * Cost amount
   */
  cost: number;
  
  /**
   * Profit margin percentage
   */
  margin: number;
  
  /**
   * Previous period margin
   */
  previousMargin?: number;
  
  /**
   * Change in margin
   */
  marginChange?: number;
}

/**
 * Business Forecast
 * Represents a business forecast for a metric
 */
export interface BusinessForecast {
  /**
   * Metric name
   */
  metric: string;
  
  /**
   * Current value
   */
  current: number;
  
  /**
   * Forecasted value
   */
  forecast: number;
  
  /**
   * Best case scenario
   */
  bestCase: number;
  
  /**
   * Worst case scenario
   */
  worstCase: number;
  
  /**
   * Confidence level percentage
   */
  confidence: number;
  
  /**
   * Unit of measurement
   */
  unit: string;
}

/**
 * Business Filter Options
 * Options for filtering business data
 */
export interface BusinessFilterOptions extends FilterOptions {
  /**
   * Product IDs to filter by
   */
  productIds?: string[];
  
  /**
   * Minimum margin percentage
   */
  minMargin?: number;
  
  /**
   * Maximum margin percentage
   */
  maxMargin?: number;
  
  /**
   * Goal status to filter by
   */
  goalStatus?: 'on-track' | 'at-risk' | 'behind' | 'completed';
}

/**
 * Paginated Revenue By Channel Response
 */
export type PaginatedRevenueByChannelResponse = PaginatedResponse<RevenueByChannelItem>;

/**
 * Paginated Customer Lifetime Value Response
 */
export type PaginatedCustomerLifetimeValueResponse = PaginatedResponse<CustomerLifetimeValueItem>;

/**
 * Paginated Business Goals Response
 */
export type PaginatedBusinessGoalsResponse = PaginatedResponse<BusinessGoal>;