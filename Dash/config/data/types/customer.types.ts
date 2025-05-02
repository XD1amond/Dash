/**
 * Customer Data Type Definitions
 * 
 * This file defines all the TypeScript interfaces for customer data used throughout the dashboard.
 * These types are used for type checking, validation, and documentation purposes.
 */

import { PaginatedResponse, FilterOptions } from './analytics.types';

/**
 * Customer
 * Represents a customer in the e-commerce system
 * 
 * @property id - Unique identifier
 * @property firstName - Customer's first name
 * @property lastName - Customer's last name
 * @property email - Customer's email address
 * @property phone - Customer's phone number
 * @property address - Customer's address information
 * @property createdAt - When the customer account was created
 * @property lastActive - When the customer was last active
 * @property totalSpent - Total amount spent by the customer
 * @property totalOrders - Total number of orders placed by the customer
 * @property segment - Customer segment classification
 * @property tags - Custom tags associated with the customer
 */
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string; // ISO date string
  lastActive: string; // ISO date string
  totalSpent: number;
  totalOrders: number;
  segment: string;
  tags: string[];
  notes?: string;
  avatarUrl?: string;
  status: 'active' | 'inactive' | 'blocked';
}

/**
 * Customer Segment
 * Represents a customer segment for targeted marketing
 * 
 * @property id - Unique identifier
 * @property name - Segment name
 * @property description - Segment description
 * @property criteria - Criteria used to define the segment
 * @property customerCount - Number of customers in the segment
 * @property totalValue - Total value of customers in the segment
 * @property createdAt - When the segment was created
 * @property updatedAt - When the segment was last updated
 */
export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria[];
  customerCount: number;
  totalValue: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  isAutomatic: boolean; // Whether the segment is automatically updated
  color?: string; // Optional color for visualization
}

/**
 * Segment Criteria
 * Represents a single criterion for defining a customer segment
 * 
 * @property field - The customer field to evaluate
 * @property operator - The comparison operator
 * @property value - The value to compare against
 */
export interface SegmentCriteria {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains' | 'starts_with' | 'ends_with' | 'between';
  value: string | number | boolean | Array<string | number>;
}

/**
 * Customer Segment Item
 * Represents summary data for a customer segment
 * 
 * @property segment - Segment name
 * @property count - Formatted count of customers
 * @property percentage - Percentage of total customers
 * @property value - Formatted total value
 */
export interface CustomerSegmentItem {
  segment: string;     // Segment name
  count: string;       // Formatted count
  percentage: number;  // Percentage of total
  value: string;       // Formatted value
  rawCount?: number;   // Raw count for calculations
  rawValue?: number;   // Raw value for calculations
}

/**
 * Customer Feedback Item
 * Represents customer feedback data for a specific category
 * 
 * @property category - Feedback category
 * @property positive - Positive percentage
 * @property neutral - Neutral percentage
 * @property negative - Negative percentage
 */
export interface CustomerFeedbackItem {
  category: string;    // Feedback category
  positive: number;    // Positive percentage
  neutral: number;     // Neutral percentage
  negative: number;    // Negative percentage
  total?: number;      // Optional total feedback count
}

/**
 * Customer Journey Stage
 * Represents a stage in the customer journey
 * 
 * @property stage - The stage name
 * @property count - Number of customers at this stage
 * @property conversionRate - Conversion rate to the next stage
 * @property averageDuration - Average time spent in this stage
 */
export interface CustomerJourneyStage {
  stage: string;
  count: number;
  conversionRate: number;
  averageDuration: string; // Formatted duration (e.g., "3 days")
  dropoffRate: number;
  previousStage?: string;
  nextStage?: string;
}

/**
 * Customer Acquisition Cost
 * Represents customer acquisition cost data by channel
 * 
 * @property channel - The acquisition channel
 * @property cost - The average acquisition cost
 * @property customers - Number of customers acquired
 * @property totalSpent - Total spent on acquisition
 */
export interface CustomerAcquisitionCost {
  channel: string;
  cost: number;
  customers: number;
  totalSpent: number;
  roi: number; // Return on investment
  previousCost?: number; // For comparison
  changePercentage?: number; // Change from previous period
}

/**
 * Customer Retention Data
 * Represents customer retention data over time
 * 
 * @property period - The time period
 * @property rate - The retention rate
 * @property newCustomers - Number of new customers
 * @property lostCustomers - Number of lost customers
 */
export interface CustomerRetentionData {
  period: string;
  rate: number;
  newCustomers: number;
  lostCustomers: number;
  totalCustomers: number;
  churnRate: number;
}

/**
 * Customer Filter Options
 * Extends the base filter options for customer-specific filtering
 */
export interface CustomerFilterOptions extends FilterOptions {
  segments?: string[];
  spendRange?: {
    min: number;
    max: number;
  };
  orderCountRange?: {
    min: number;
    max: number;
  };
  status?: ('active' | 'inactive' | 'blocked')[];
  tags?: string[];
  joinDateRange?: {
    from: Date;
    to: Date;
  };
}