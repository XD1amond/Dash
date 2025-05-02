/**
 * Business Data Validation Schemas
 * 
 * This file defines Zod validation schemas for business data types.
 * These schemas are used for runtime validation of data to ensure data integrity.
 */

import { z } from 'zod';
import { paginatedResponseSchema, filterOptionsSchema } from './analytics.schema';

/**
 * Revenue By Channel Item Schema
 * Validates revenue by channel data
 */
export const revenueByChannelItemSchema = z.object({
  channel: z.string().min(1, 'Channel name is required'),
  revenue: z.string().min(1, 'Formatted revenue is required'),
  percentage: z.number().min(0).max(100, 'Percentage must be between 0 and 100'),
  rawRevenue: z.number().nonnegative('Raw revenue must be a non-negative number').optional(),
});

/**
 * Customer Lifetime Value Item Schema
 * Validates customer lifetime value data
 */
export const customerLifetimeValueItemSchema = z.object({
  segment: z.string().min(1, 'Segment name is required'),
  value: z.string().min(1, 'Formatted value is required'),
  orders: z.string().min(1, 'Average orders is required'),
  retention: z.string().min(1, 'Retention rate is required'),
  rawValue: z.number().nonnegative('Raw value must be a non-negative number').optional(),
});

/**
 * Business Performance Metric Schema
 * Validates business performance metrics
 */
export const businessPerformanceMetricSchema = z.object({
  metric: z.string().min(1, 'Metric name is required'),
  value: z.number(),
  previousValue: z.number(),
  change: z.number(),
  target: z.number(),
  unit: z.string(),
  isPositive: z.boolean(),
});

/**
 * Market Share Item Schema
 * Validates market share data
 */
export const marketShareItemSchema = z.object({
  name: z.string().min(1, 'Competitor name is required'),
  share: z.number().min(0).max(100, 'Share must be between 0 and 100'),
  change: z.number(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex code').optional(),
});

/**
 * Business Goal Schema
 * Validates business goal data
 */
export const businessGoalSchema = z.object({
  id: z.string().min(1, 'Goal ID is required'),
  name: z.string().min(1, 'Goal name is required'),
  target: z.number(),
  current: z.number(),
  unit: z.string(),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z)?$/, 'Deadline must be a valid ISO date string'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z)?$/, 'Start date must be a valid ISO date string'),
  progress: z.number().min(0).max(100, 'Progress must be between 0 and 100'),
  status: z.enum(['on-track', 'at-risk', 'behind', 'completed']),
});

/**
 * Expense Category Schema
 * Validates expense category data
 */
export const expenseCategorySchema = z.object({
  category: z.string().min(1, 'Category name is required'),
  amount: z.number().nonnegative('Amount must be a non-negative number'),
  budget: z.number().nonnegative('Budget must be a non-negative number'),
  percentage: z.number().min(0).max(100, 'Percentage must be between 0 and 100'),
  variance: z.number(),
});

/**
 * Profit Margin Data Schema
 * Validates profit margin data
 */
export const profitMarginDataSchema = z.object({
  item: z.string().min(1, 'Item name is required'),
  revenue: z.number().nonnegative('Revenue must be a non-negative number'),
  cost: z.number().nonnegative('Cost must be a non-negative number'),
  margin: z.number(),
  previousMargin: z.number().optional(),
  marginChange: z.number().optional(),
});

/**
 * Business Forecast Schema
 * Validates business forecast data
 */
export const businessForecastSchema = z.object({
  metric: z.string().min(1, 'Metric name is required'),
  current: z.number(),
  forecast: z.number(),
  bestCase: z.number(),
  worstCase: z.number(),
  confidence: z.number().min(0).max(100, 'Confidence must be between 0 and 100'),
  unit: z.string(),
});

/**
 * Paginated Revenue By Channel Schema
 * Validates paginated revenue by channel responses
 */
export const paginatedRevenueByChannelSchema = paginatedResponseSchema(revenueByChannelItemSchema);

/**
 * Paginated Customer Lifetime Value Schema
 * Validates paginated customer lifetime value responses
 */
export const paginatedCustomerLifetimeValueSchema = paginatedResponseSchema(customerLifetimeValueItemSchema);

/**
 * Paginated Business Goals Schema
 * Validates paginated business goals responses
 */
export const paginatedBusinessGoalsSchema = paginatedResponseSchema(businessGoalSchema);

/**
 * Validate Revenue By Channel Data
 * Function to validate revenue by channel data
 */
export function validateRevenueByChannelData(data: unknown): asserts data is Array<z.infer<typeof revenueByChannelItemSchema>> {
  const revenueByChannelArraySchema = z.array(revenueByChannelItemSchema);
  const result = revenueByChannelArraySchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid revenue by channel data: ${result.error.message}`);
  }
}

/**
 * Validate Customer Lifetime Value Data
 * Function to validate customer lifetime value data
 */
export function validateCustomerLifetimeValueData(data: unknown): asserts data is Array<z.infer<typeof customerLifetimeValueItemSchema>> {
  const customerLifetimeValueArraySchema = z.array(customerLifetimeValueItemSchema);
  const result = customerLifetimeValueArraySchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid customer lifetime value data: ${result.error.message}`);
  }
}

/**
 * Validate Business Performance Metrics
 * Function to validate business performance metrics
 */
export function validateBusinessPerformanceMetrics(data: unknown): asserts data is Array<z.infer<typeof businessPerformanceMetricSchema>> {
  const businessPerformanceMetricsArraySchema = z.array(businessPerformanceMetricSchema);
  const result = businessPerformanceMetricsArraySchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid business performance metrics: ${result.error.message}`);
  }
}

/**
 * Validate Business Goals
 * Function to validate business goals
 */
export function validateBusinessGoals(data: unknown): asserts data is Array<z.infer<typeof businessGoalSchema>> {
  const businessGoalsArraySchema = z.array(businessGoalSchema);
  const result = businessGoalsArraySchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid business goals: ${result.error.message}`);
  }
}

/**
 * Validate Expense Categories
 * Function to validate expense categories
 */
export function validateExpenseCategories(data: unknown): asserts data is Array<z.infer<typeof expenseCategorySchema>> {
  const expenseCategoriesArraySchema = z.array(expenseCategorySchema);
  const result = expenseCategoriesArraySchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid expense categories: ${result.error.message}`);
  }
}