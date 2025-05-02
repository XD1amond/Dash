/**
 * Product Data Type Definitions
 * 
 * This file defines all the TypeScript interfaces for product data used throughout the dashboard.
 * These types are used for type checking, validation, and documentation purposes.
 */

import { PaginatedResponse, FilterOptions } from './analytics.types';

/**
 * Product
 * Represents a product in the e-commerce system
 * 
 * @property id - Unique identifier
 * @property name - Product name
 * @property description - Product description
 * @property price - Product price
 * @property inventory - Current inventory level
 * @property category - Product category
 * @property tags - Product tags
 * @property images - Product images
 * @property createdAt - When the product was created
 * @property updatedAt - When the product was last updated
 */
export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  inventory: number;
  lowStockThreshold?: number;
  category: string;
  subcategory?: string;
  brand?: string;
  tags: string[];
  attributes?: Record<string, string>;
  images: ProductImage[];
  status: 'active' | 'draft' | 'archived';
  featured: boolean;
  weight?: number;
  weightUnit?: 'kg' | 'g' | 'lb' | 'oz';
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  variants?: ProductVariant[];
  relatedProducts?: string[]; // IDs of related products
  taxable: boolean;
  taxClass?: string;
  shippingClass?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  publishedAt?: string; // ISO date string
  metadata?: Record<string, any>; // Additional metadata
}

/**
 * Product Image
 * Represents an image associated with a product
 * 
 * @property id - Unique identifier
 * @property url - Image URL
 * @property alt - Alternative text
 * @property position - Display position
 */
export interface ProductImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  position: number;
  width?: number;
  height?: number;
  size?: number; // In bytes
  type?: string; // MIME type
  tags?: string[];
}

/**
 * Product Variant
 * Represents a variant of a product
 * 
 * @property id - Unique identifier
 * @property sku - Stock keeping unit
 * @property name - Variant name
 * @property options - Variant options
 * @property price - Variant price
 * @property inventory - Variant inventory level
 * @property images - Variant images
 */
export interface ProductVariant {
  id: string;
  sku: string;
  name?: string;
  options: Record<string, string>; // e.g., { "Color": "Red", "Size": "Large" }
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  inventory: number;
  lowStockThreshold?: number;
  images: ProductImage[];
  weight?: number;
  weightUnit?: 'kg' | 'g' | 'lb' | 'oz';
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  barcode?: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Product Category
 * Represents a product category
 * 
 * @property id - Unique identifier
 * @property name - Category name
 * @property description - Category description
 * @property slug - URL-friendly name
 * @property parent - Parent category ID
 * @property image - Category image
 * @property productCount - Number of products in the category
 */
export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  parent?: string; // Parent category ID
  ancestors?: string[]; // Array of ancestor category IDs
  level: number; // Hierarchy level (0 for root)
  image?: ProductImage;
  productCount: number;
  subcategories?: ProductCategory[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  status: 'active' | 'draft' | 'archived';
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Product Inventory Item
 * Represents inventory data for a product category
 * 
 * @property category - Category name
 * @property inStock - Number of products in stock
 * @property lowStock - Number of products with low stock
 * @property outOfStock - Number of products out of stock
 */
export interface ProductInventoryItem {
  category: string;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalProducts: number;
  totalValue: number;
  averagePrice?: number;
}

/**
 * Top Product Item
 * Represents data for a top-performing product
 * 
 * @property product - Product name
 * @property sales - Formatted sales amount
 * @property units - Formatted units sold
 * @property profit - Formatted profit amount
 */
export interface TopProductItem {
  product: string;
  productId: string;
  sales: string;
  units: string;
  profit: string;
  rawSales: number;
  rawUnits: number;
  rawProfit: number;
  category?: string;
  trend?: 'up' | 'down' | 'stable';
  changePercentage?: number;
}

/**
 * Product Review
 * Represents a customer review for a product
 * 
 * @property id - Unique identifier
 * @property productId - Product identifier
 * @property customerId - Customer identifier
 * @property rating - Rating (1-5)
 * @property title - Review title
 * @property content - Review content
 * @property createdAt - When the review was created
 */
export interface ProductReview {
  id: string;
  productId: string;
  productName?: string;
  customerId: string;
  customerName: string;
  rating: number; // 1-5
  title?: string;
  content: string;
  images?: ProductImage[];
  verified: boolean; // Whether the reviewer purchased the product
  helpful: number; // Number of users who found this review helpful
  reported: number; // Number of users who reported this review
  status: 'pending' | 'approved' | 'rejected';
  response?: {
    content: string;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Product Performance
 * Represents performance metrics for a product
 * 
 * @property productId - Product identifier
 * @property views - Number of product views
 * @property addToCart - Number of add-to-cart actions
 * @property purchases - Number of purchases
 * @property conversionRate - Conversion rate
 */
export interface ProductPerformance {
  productId: string;
  productName: string;
  views: number;
  addToCart: number;
  purchases: number;
  conversionRate: number;
  revenue: number;
  profit: number;
  returnRate: number;
  averageRating: number;
  reviewCount: number;
  period: string; // Time period for these metrics
  previousPeriod?: {
    views: number;
    addToCart: number;
    purchases: number;
    conversionRate: number;
    revenue: number;
  };
  changePercentages?: {
    views: number;
    addToCart: number;
    purchases: number;
    conversionRate: number;
    revenue: number;
  };
}

/**
 * Product Filter Options
 * Extends the base filter options for product-specific filtering
 */
export interface ProductFilterOptions extends FilterOptions {
  categories?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
  status?: ('active' | 'draft' | 'archived')[];
  tags?: string[];
  brands?: string[];
  featured?: boolean;
  createdDateRange?: {
    from: Date;
    to: Date;
  };
}

/**
 * Product Batch Action
 * Represents a batch action that can be performed on multiple products
 */
export interface ProductBatchAction {
  action: 'update_status' | 'add_tag' | 'remove_tag' | 'update_category' | 'update_price' | 'update_inventory' | 'delete' | 'duplicate' | 'export';
  productIds: string[];
  value?: string | number; // For actions that require a value
  metadata?: Record<string, any>; // Additional action-specific data
}