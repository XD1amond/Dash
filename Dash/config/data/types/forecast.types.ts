/**
 * Forecast Data Type Definitions
 * 
 * This file defines all the TypeScript interfaces for forecast data used throughout the dashboard.
 * These types are used for type checking, validation, and documentation purposes.
 */

import { PaginatedResponse, FilterOptions } from './analytics.types';

/**
 * Sales Forecast Item
 * Represents sales forecast data for a specific time period
 * 
 * @property month - Month or period name
 * @property actual - Actual sales (null for future periods)
 * @property forecast - Forecasted sales
 * @property lowerBound - Lower confidence bound (optional)
 * @property upperBound - Upper confidence bound (optional)
 */
export interface SalesForecastItem {
  month: string;           // Month name or period
  actual: number | null;   // Actual sales (null for future periods)
  forecast: number;        // Forecasted sales
  lowerBound?: number;     // Lower confidence bound
  upperBound?: number;     // Upper confidence bound
  variance?: number;       // Variance between actual and forecast (for past periods)
  confidenceLevel?: number; // Confidence level percentage
}

/**
 * Inventory Forecast Item
 * Represents inventory forecast data for a specific product
 * 
 * @property product - Product name
 * @property currentStock - Current inventory level
 * @property projectedDemand - Projected demand
 * @property reorderPoint - Reorder threshold
 * @property reorderQty - Recommended reorder quantity
 */
export interface InventoryForecastItem {
  product: string;         // Product name
  currentStock: number;    // Current inventory level
  projectedDemand: number; // Projected demand
  reorderPoint: number;    // Reorder threshold
  reorderQty: number;      // Recommended reorder quantity
  daysUntilReorder: number; // Days until reorder needed
  stockoutRisk: 'low' | 'medium' | 'high'; // Risk of stockout
  excessStock?: number;    // Amount of excess stock
  productId: string;       // Product ID for reference
  category?: string;       // Product category
}

/**
 * Trend Prediction Item
 * Represents a predicted trend
 * 
 * @property trend - Trend name
 * @property status - Trend status (Rising, Stable, Declining)
 * @property growth - Growth percentage
 * @property description - Detailed description
 * @property confidence - Confidence level
 */
export interface TrendPredictionItem {
  trend: string;
  status: "Rising" | "Stable" | "Declining";
  growth: string;
  description?: string;
  confidence: number; // 0-100 percentage
  impactLevel: 'low' | 'medium' | 'high';
  timeFrame: 'short-term' | 'medium-term' | 'long-term';
  relatedProducts?: string[];
  relatedCategories?: string[];
}

/**
 * Demand Forecast
 * Represents demand forecast for a specific product or category
 * 
 * @property item - Product or category name
 * @property periods - Array of forecast periods
 */
export interface DemandForecast {
  item: string;
  itemType: 'product' | 'category';
  itemId: string;
  periods: DemandForecastPeriod[];
  seasonalityFactor: number;
  growthRate: number;
  confidenceLevel: number;
}

/**
 * Demand Forecast Period
 * Represents a single period in a demand forecast
 * 
 * @property period - Period name
 * @property demand - Forecasted demand
 */
export interface DemandForecastPeriod {
  period: string;
  demand: number;
  lowerBound: number;
  upperBound: number;
  previousYearDemand?: number;
  yearOverYearChange?: number;
}

/**
 * Price Optimization Forecast
 * Represents price optimization recommendations
 * 
 * @property product - Product name
 * @property currentPrice - Current price
 * @property recommendedPrice - Recommended price
 * @property projectedRevenue - Projected revenue at recommended price
 * @property projectedProfit - Projected profit at recommended price
 */
export interface PriceOptimizationForecast {
  product: string;
  productId: string;
  currentPrice: number;
  recommendedPrice: number;
  projectedRevenue: number;
  projectedProfit: number;
  currentRevenue: number;
  currentProfit: number;
  revenueIncrease: number;
  profitIncrease: number;
  elasticity: number; // Price elasticity of demand
  confidence: number;
}

/**
 * Cash Flow Forecast
 * Represents cash flow forecast for a specific period
 * 
 * @property period - Period name
 * @property inflow - Projected cash inflow
 * @property outflow - Projected cash outflow
 * @property netFlow - Net cash flow
 * @property runningBalance - Running cash balance
 */
export interface CashFlowForecast {
  period: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  runningBalance: number;
  inflowSources?: Record<string, number>; // Breakdown of inflow sources
  outflowCategories?: Record<string, number>; // Breakdown of outflow categories
}

/**
 * Seasonal Forecast
 * Represents seasonal forecast factors
 * 
 * @property period - Period name
 * @property factor - Seasonal factor
 * @property impact - Impact on sales
 */
export interface SeasonalForecast {
  period: string;
  factor: number;
  impact: 'positive' | 'negative' | 'neutral';
  historicalAverage: number;
  confidence: number;
  events?: string[]; // Special events in this period
}

/**
 * Forecast Filter Options
 * Extends the base filter options for forecast-specific filtering
 */
export interface ForecastFilterOptions extends FilterOptions {
  productIds?: string[];
  categories?: string[];
  timeFrame?: 'short' | 'medium' | 'long';
  confidenceThreshold?: number;
  includeHistorical?: boolean;
}