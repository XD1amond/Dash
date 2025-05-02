/**
 * Data Validation Index
 *
 * This file exports all validation schemas and validation functions from the various domain-specific schema files.
 * This allows consumers to import validation utilities from a single location:
 *
 * import { validateRevenueData, validateSalesForecastData } from '@/config/data/validation';
 */

import { z } from 'zod';

// Export all validation schemas and functions from analytics
export * from './analytics.schema';

// Export all validation schemas and functions from business
export * from './business.schema';

// Export all validation schemas and functions from forecast
export * from './forecast.schema';

// Export utility functions for validation

/**
 * Validate data against a schema with detailed error reporting
 *
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @param errorPrefix - Prefix for error messages
 * @returns Validation result with parsed data or detailed error information
 */
export function validateWithDetails<T>(
  schema: z.ZodType<T>,
  data: unknown,
  errorPrefix: string = 'Validation error'
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  // Extract and format error messages
  const errors = result.error.errors.map((err: z.ZodIssue) => {
    const path = err.path.join('.');
    return `${path ? `${path}: ` : ''}${err.message}`;
  });
  
  return {
    success: false,
    errors: [`${errorPrefix}: ${errors.join('; ')}`]
  };
}

/**
 * Validate data against a schema and throw an error if invalid
 *
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @param errorPrefix - Prefix for error messages
 * @returns Validated and typed data
 * @throws Error if validation fails
 */
export function validateOrThrow<T>(
  schema: z.ZodType<T>,
  data: unknown,
  errorPrefix: string = 'Validation error'
): T {
  const result = validateWithDetails<T>(schema, data, errorPrefix);
  
  if (!result.success) {
    throw new Error(result.errors[0]);
  }
  
  return result.data;
}