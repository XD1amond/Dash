/**
 * Order Data Type Definitions
 * 
 * This file defines all the TypeScript interfaces for order data used throughout the dashboard.
 * These types are used for type checking, validation, and documentation purposes.
 */

import { PaginatedResponse, FilterOptions } from './analytics.types';

/**
 * Order Status
 * Represents the possible statuses of an order
 */
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'on_hold' | 'failed' | 'returned';

/**
 * Order
 * Represents an order in the e-commerce system
 * 
 * @property id - Unique identifier
 * @property orderNumber - Human-readable order number
 * @property customer - Customer information
 * @property status - Order status
 * @property items - Order items
 * @property total - Order total
 * @property createdAt - When the order was created
 * @property updatedAt - When the order was last updated
 */
export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded' | 'partially_refunded';
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: string;
  notes?: string;
  tags?: string[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  fulfilledAt?: string; // ISO date string
  cancelledAt?: string; // ISO date string
  refundedAt?: string; // ISO date string
  trackingNumber?: string;
  trackingUrl?: string;
  currency: string;
  exchangeRate?: number;
}

/**
 * Order Item
 * Represents an item in an order
 * 
 * @property id - Unique identifier
 * @property productId - Product identifier
 * @property productName - Product name
 * @property quantity - Quantity ordered
 * @property price - Unit price
 * @property total - Total price (quantity * price)
 */
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  total: number;
  options?: Record<string, string>; // Product options (e.g., color, size)
  imageUrl?: string;
  weight?: number;
  weightUnit?: string;
  bundleItems?: OrderItem[]; // For bundled products
  isDigital?: boolean;
  downloadUrl?: string; // For digital products
  metadata?: Record<string, any>; // Additional metadata
}

/**
 * Address
 * Represents a shipping or billing address
 */
export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
  isDefault?: boolean;
  type?: 'shipping' | 'billing' | 'both';
}

/**
 * Order Summary
 * Represents a summary of orders for reporting
 * 
 * @property period - Time period
 * @property count - Number of orders
 * @property total - Total revenue
 * @property average - Average order value
 */
export interface OrderSummary {
  period: string;
  count: number;
  total: number;
  average: number;
  refunds: number;
  netTotal: number;
  previousPeriodCount?: number;
  previousPeriodTotal?: number;
  countChange?: number;
  totalChange?: number;
}

/**
 * Order Fulfillment
 * Represents fulfillment information for an order
 * 
 * @property orderId - Order identifier
 * @property status - Fulfillment status
 * @property trackingNumber - Shipping tracking number
 * @property trackingUrl - URL to track the shipment
 * @property carrier - Shipping carrier
 * @property method - Shipping method
 * @property items - Fulfilled items
 */
export interface OrderFulfillment {
  id: string;
  orderId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'failed';
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  method?: string;
  items: Array<{
    orderItemId: string;
    quantity: number;
  }>;
  shippedAt?: string; // ISO date string
  deliveredAt?: string; // ISO date string
  estimatedDelivery?: string; // ISO date string
  notes?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Order Refund
 * Represents a refund for an order
 * 
 * @property id - Unique identifier
 * @property orderId - Order identifier
 * @property amount - Refund amount
 * @property reason - Refund reason
 * @property items - Refunded items
 */
export interface OrderRefund {
  id: string;
  orderId: string;
  amount: number;
  reason: string;
  items?: Array<{
    orderItemId: string;
    quantity: number;
    amount: number;
  }>;
  status: 'pending' | 'processed' | 'failed';
  transactionId?: string;
  refundedAt: string; // ISO date string
  requestedBy: string;
  notes?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Order Filter Options
 * Extends the base filter options for order-specific filtering
 */
export interface OrderFilterOptions extends FilterOptions {
  status?: OrderStatus[];
  paymentStatus?: ('paid' | 'pending' | 'failed' | 'refunded' | 'partially_refunded')[];
  minTotal?: number;
  maxTotal?: number;
  customerId?: string;
  productId?: string;
  fulfillmentStatus?: ('unfulfilled' | 'partially_fulfilled' | 'fulfilled')[];
  tags?: string[];
  hasTrackingNumber?: boolean;
}

/**
 * Order Batch Action
 * Represents a batch action that can be performed on multiple orders
 */
export interface OrderBatchAction {
  action: 'update_status' | 'add_tag' | 'remove_tag' | 'export' | 'print' | 'delete' | 'fulfill' | 'refund';
  orderIds: string[];
  value?: string; // For actions that require a value (e.g., new status, tag)
  metadata?: Record<string, any>; // Additional action-specific data
}