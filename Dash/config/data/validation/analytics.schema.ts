/**
 * Analytics Data Validation Schemas
 * 
 * This file defines Zod validation schemas for analytics data types.
 * These schemas are used for runtime validation of data to ensure data integrity.
 */

import { z } from 'zod';

/**
 * Pagination Response Schema
 * Validates the structure of paginated responses
 */
export const paginationSchema = z.object({
  total: z.number().int().nonnegative('Total count must be a non-negative integer'),
  page: z.number().int().positive('Page must be a positive integer'),
  pageSize: z.number().int().positive('Page size must be a positive integer'),
  totalPages: z.number().int().nonnegative('Total pages must be a non-negative integer'),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

/**
 * Paginated Response Schema
 * Generic schema for paginated responses
 */
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => 
  z.object({
    data: z.array(dataSchema),
    pagination: paginationSchema,
  });

/**
 * Filter Options Schema
 * Validates filter options for data fetching
 */
export const filterOptionsSchema = z.object({
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
}).optional();

/**
 * Revenue Data Point Schema
 * Validates revenue data points
 */
export const revenueDataPointSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, 'Date must be in YYYY-MM or YYYY-MM-DD format'),
  revenue: z.number().nonnegative('Revenue must be a non-negative number'),
});

/**
 * Sales Data Point Schema
 * Validates sales data points
 */
export const salesDataPointSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  value: z.number().nonnegative('Value must be a non-negative number'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex code').optional(),
});

/**
 * Visitors Data Point Schema
 * Validates visitors data points
 */
export const visitorsDataPointSchema = z.object({
  name: z.string().min(1, 'Traffic source name is required'),
  value: z.number().nonnegative('Value must be a non-negative number'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex code').optional(),
});

/**
 * Conversion Data Point Schema
 * Validates conversion data points
 */
export const conversionDataPointSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, 'Date must be in YYYY-MM or YYYY-MM-DD format'),
  conversion: z.number().nonnegative('Conversion rate must be a non-negative number'),
});

/**
 * Stat Card Data Point Schema
 * Validates stat card data points
 */
export const statCardDataPointSchema = z.object({
  title: z.string().min(1, 'Metric name is required'),
  value: z.string().min(1, 'Formatted value is required'),
  change: z.number(),
  changeType: z.enum(['increase', 'decrease']),
});

/**
 * Sales Funnel Data Point Schema
 * Validates sales funnel data points
 */
export const salesFunnelDataPointSchema = z.object({
  stage: z.string().min(1, 'Stage name is required'),
  count: z.number().int().nonnegative('Count must be a non-negative integer'),
  percentage: z.number().min(0).max(100, 'Percentage must be between 0 and 100'),
});

/**
 * Cohort Analysis Data Point Schema
 * Validates cohort analysis data points
 */
export const cohortAnalysisDataPointSchema = z.object({
  cohort: z.string().min(1, 'Cohort identifier is required'),
}).and(
  z.record(z.string(), z.string())
);

/**
 * A/B Testing Result Schema
 * Validates A/B testing results
 */
export const abTestingResultSchema = z.object({
  test: z.string().min(1, 'Test name is required'),
  variant: z.string().min(1, 'Variant identifier is required'),
  metric: z.string().min(1, 'Metric name is required'),
  value: z.string().min(1, 'Result value is required'),
  change: z.string(),
  isWinner: z.boolean().optional(),
});

/**
 * Paginated Revenue Data Schema
 * Validates paginated revenue data responses
 */
export const paginatedRevenueDataSchema = paginatedResponseSchema(revenueDataPointSchema);

/**
 * Paginated Sales Data Schema
 * Validates paginated sales data responses
 */
export const paginatedSalesDataSchema = paginatedResponseSchema(salesDataPointSchema);

/**
 * Paginated Visitors Data Schema
 * Validates paginated visitors data responses
 */
export const paginatedVisitorsDataSchema = paginatedResponseSchema(visitorsDataPointSchema);

/**
 * Paginated Conversion Data Schema
 * Validates paginated conversion data responses
 */
export const paginatedConversionDataSchema = paginatedResponseSchema(conversionDataPointSchema);

/**
 * Validate Revenue Data
 * Function to validate revenue data
 */
export function validateRevenueData(data: unknown): asserts data is z.infer<typeof paginatedRevenueDataSchema> {
  const result = paginatedRevenueDataSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid revenue data: ${result.error.message}`);
  }
}

/**
 * Validate Sales Data
 * Function to validate sales data
 */
export function validateSalesData(data: unknown): asserts data is z.infer<typeof paginatedSalesDataSchema> {
  const result = paginatedSalesDataSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid sales data: ${result.error.message}`);
  }
}

/**
 * Validate Visitors Data
 * Function to validate visitors data
 */
export function validateVisitorsData(data: unknown): asserts data is z.infer<typeof paginatedVisitorsDataSchema> {
  const result = paginatedVisitorsDataSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid visitors data: ${result.error.message}`);
  }
}

/**
 * Validate Conversion Data
 * Function to validate conversion data
 */
export function validateConversionData(data: unknown): asserts data is z.infer<typeof paginatedConversionDataSchema> {
  const result = paginatedConversionDataSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid conversion data: ${result.error.message}`);
  }
}

/**
 * Validate Stat Card Data
 * Function to validate stat card data
 */
export function validateStatCardData(data: unknown): asserts data is Array<z.infer<typeof statCardDataPointSchema>> {
  const statCardArraySchema = z.array(statCardDataPointSchema);
  const result = statCardArraySchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid stat card data: ${result.error.message}`);
  }
}

/**
 * Validate Filter Options
 * Function to validate filter options
 */
export function validateFilterOptions(options: unknown): asserts options is z.infer<typeof filterOptionsSchema> {
  const result = filterOptionsSchema.safeParse(options);
  if (!result.success) {
    throw new Error(`Invalid filter options: ${result.error.message}`);
  }
}