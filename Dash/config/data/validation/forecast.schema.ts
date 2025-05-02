/**
 * Forecast Data Validation Schemas
 * 
 * This file defines Zod validation schemas for forecast data types.
 * These schemas are used for runtime validation of data to ensure data integrity.
 */

import { z } from 'zod';
import { paginatedResponseSchema, filterOptionsSchema } from './analytics.schema';

/**
 * Sales Forecast Item Schema
 * Validates sales forecast data
 */
export const salesForecastItemSchema = z.object({
  month: z.string().min(1, 'Month or period name is required'),
  actual: z.number().nullable(),
  forecast: z.number(),
  lowerBound: z.number().optional(),
  upperBound: z.number().optional(),
  variance: z.number().optional(),
  confidenceLevel: z.number().min(0).max(100, 'Confidence level must be between 0 and 100').optional(),
}).refine(
  data => !data.lowerBound || !data.upperBound || data.lowerBound <= data.upperBound,
  { message: 'Lower bound must be less than or equal to upper bound', path: ['lowerBound'] }
);

/**
 * Inventory Forecast Item Schema
 * Validates inventory forecast data
 */
export const inventoryForecastItemSchema = z.object({
  product: z.string().min(1, 'Product name is required'),
  currentStock: z.number().int().nonnegative('Current stock must be a non-negative integer'),
  projectedDemand: z.number().nonnegative('Projected demand must be a non-negative number'),
  reorderPoint: z.number().int().nonnegative('Reorder point must be a non-negative integer'),
  reorderQty: z.number().int().positive('Reorder quantity must be a positive integer'),
  daysUntilReorder: z.number().int().nonnegative('Days until reorder must be a non-negative integer'),
  stockoutRisk: z.enum(['low', 'medium', 'high']),
  excessStock: z.number().int().nonnegative('Excess stock must be a non-negative integer').optional(),
  productId: z.string().min(1, 'Product ID is required'),
  category: z.string().optional(),
});

/**
 * Trend Prediction Item Schema
 * Validates trend prediction data
 */
export const trendPredictionItemSchema = z.object({
  trend: z.string().min(1, 'Trend name is required'),
  status: z.enum(['Rising', 'Stable', 'Declining']),
  growth: z.string().min(1, 'Growth percentage is required'),
  description: z.string().optional(),
  confidence: z.number().min(0).max(100, 'Confidence must be between 0 and 100'),
  impactLevel: z.enum(['low', 'medium', 'high']),
  timeFrame: z.enum(['short-term', 'medium-term', 'long-term']),
  relatedProducts: z.array(z.string()).optional(),
  relatedCategories: z.array(z.string()).optional(),
});

/**
 * Demand Forecast Period Schema
 * Validates demand forecast period data
 */
export const demandForecastPeriodSchema = z.object({
  period: z.string().min(1, 'Period name is required'),
  demand: z.number().nonnegative('Demand must be a non-negative number'),
  lowerBound: z.number().nonnegative('Lower bound must be a non-negative number'),
  upperBound: z.number().nonnegative('Upper bound must be a non-negative number'),
  previousYearDemand: z.number().nonnegative('Previous year demand must be a non-negative number').optional(),
  yearOverYearChange: z.number().optional(),
}).refine(
  data => data.lowerBound <= data.upperBound,
  { message: 'Lower bound must be less than or equal to upper bound', path: ['lowerBound'] }
);

/**
 * Demand Forecast Schema
 * Validates demand forecast data
 */
export const demandForecastSchema = z.object({
  item: z.string().min(1, 'Item name is required'),
  itemType: z.enum(['product', 'category']),
  itemId: z.string().min(1, 'Item ID is required'),
  periods: z.array(demandForecastPeriodSchema).min(1, 'At least one period is required'),
  seasonalityFactor: z.number().positive('Seasonality factor must be a positive number'),
  growthRate: z.number(),
  confidenceLevel: z.number().min(0).max(100, 'Confidence level must be between 0 and 100'),
});

/**
 * Price Optimization Forecast Schema
 * Validates price optimization forecast data
 */
export const priceOptimizationForecastSchema = z.object({
  product: z.string().min(1, 'Product name is required'),
  productId: z.string().min(1, 'Product ID is required'),
  currentPrice: z.number().nonnegative('Current price must be a non-negative number'),
  recommendedPrice: z.number().nonnegative('Recommended price must be a non-negative number'),
  projectedRevenue: z.number().nonnegative('Projected revenue must be a non-negative number'),
  projectedProfit: z.number(),
  currentRevenue: z.number().nonnegative('Current revenue must be a non-negative number'),
  currentProfit: z.number(),
  revenueIncrease: z.number(),
  profitIncrease: z.number(),
  elasticity: z.number(),
  confidence: z.number().min(0).max(100, 'Confidence must be between 0 and 100'),
});

/**
 * Cash Flow Forecast Schema
 * Validates cash flow forecast data
 */
export const cashFlowForecastSchema = z.object({
  period: z.string().min(1, 'Period name is required'),
  inflow: z.number().nonnegative('Inflow must be a non-negative number'),
  outflow: z.number().nonnegative('Outflow must be a non-negative number'),
  netFlow: z.number(),
  runningBalance: z.number(),
  inflowSources: z.record(z.string(), z.number().nonnegative()).optional(),
  outflowCategories: z.record(z.string(), z.number().nonnegative()).optional(),
});

/**
 * Seasonal Forecast Schema
 * Validates seasonal forecast data
 */
export const seasonalForecastSchema = z.object({
  period: z.string().min(1, 'Period name is required'),
  factor: z.number().positive('Seasonal factor must be a positive number'),
  impact: z.enum(['positive', 'negative', 'neutral']),
  historicalAverage: z.number(),
  confidence: z.number().min(0).max(100, 'Confidence must be between 0 and 100'),
  events: z.array(z.string()).optional(),
});

/**
 * Forecast Filter Options Schema
 * Validates forecast filter options
 */
export const forecastFilterOptionsSchema = z.object({
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }).optional().refine(
    data => !data || data.from <= data.to,
    { message: 'Start date must be before or equal to end date' }
  ),
  categories: z.array(z.string()).optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  // Forecast-specific filters
  productIds: z.array(z.string()).optional(),
  timeFrame: z.enum(['short', 'medium', 'long']).optional(),
  confidenceThreshold: z.number().min(0).max(100).optional(),
  includeHistorical: z.boolean().optional(),
}).optional();

/**
 * Paginated Sales Forecast Schema
 * Validates paginated sales forecast responses
 */
export const paginatedSalesForecastSchema = paginatedResponseSchema(salesForecastItemSchema);

/**
 * Paginated Inventory Forecast Schema
 * Validates paginated inventory forecast responses
 */
export const paginatedInventoryForecastSchema = paginatedResponseSchema(inventoryForecastItemSchema);

/**
 * Paginated Trend Prediction Schema
 * Validates paginated trend prediction responses
 */
export const paginatedTrendPredictionSchema = paginatedResponseSchema(trendPredictionItemSchema);

/**
 * Validate Sales Forecast Data
 * Function to validate sales forecast data
 */
export function validateSalesForecastData(data: unknown): asserts data is Array<z.infer<typeof salesForecastItemSchema>> {
  const salesForecastArraySchema = z.array(salesForecastItemSchema);
  const result = salesForecastArraySchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid sales forecast data: ${result.error.message}`);
  }
}

/**
 * Validate Inventory Forecast Data
 * Function to validate inventory forecast data
 */
export function validateInventoryForecastData(data: unknown): asserts data is Array<z.infer<typeof inventoryForecastItemSchema>> {
  const inventoryForecastArraySchema = z.array(inventoryForecastItemSchema);
  const result = inventoryForecastArraySchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid inventory forecast data: ${result.error.message}`);
  }
}

/**
 * Validate Trend Prediction Data
 * Function to validate trend prediction data
 */
export function validateTrendPredictionData(data: unknown): asserts data is Array<z.infer<typeof trendPredictionItemSchema>> {
  const trendPredictionArraySchema = z.array(trendPredictionItemSchema);
  const result = trendPredictionArraySchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid trend prediction data: ${result.error.message}`);
  }
}

/**
 * Validate Demand Forecast Data
 * Function to validate demand forecast data
 */
export function validateDemandForecastData(data: unknown): asserts data is Array<z.infer<typeof demandForecastSchema>> {
  const demandForecastArraySchema = z.array(demandForecastSchema);
  const result = demandForecastArraySchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid demand forecast data: ${result.error.message}`);
  }
}