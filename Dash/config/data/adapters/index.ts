/**
 * Data Adapters Index
 * 
 * This file exports all data adapters and related types.
 * Adapters are responsible for fetching data from various sources (REST API, GraphQL, etc.)
 * and returning it in a consistent format.
 */

// Export the base adapter interface
export * from './base.adapter';

// Export the REST adapter
export * from './rest.adapter';

// Factory function to create an adapter based on configuration
import { BaseAdapter } from './base.adapter';
import { RestAdapter, RestAdapterConfig } from './rest.adapter';

/**
 * Adapter Type
 * Supported adapter types
 */
export type AdapterType = 'rest' | 'mock';

/**
 * Adapter Configuration
 * Configuration for creating an adapter
 */
export interface AdapterConfig {
  /**
   * Adapter type
   */
  type: AdapterType;
  
  /**
   * REST adapter configuration
   * Only used when type is 'rest'
   */
  rest?: RestAdapterConfig;
  
  /**
   * Whether to use mock data
   * Only used when type is 'mock'
   */
  mockDelay?: number;
}

/**
 * Create an adapter based on configuration
 * 
 * @param config - Adapter configuration
 * @returns Adapter instance
 */
export function createAdapter(config: AdapterConfig): BaseAdapter {
  switch (config.type) {
    case 'rest':
      return new RestAdapter(config.rest);
    case 'mock':
      return createMockAdapter(config.mockDelay);
    default:
      throw new Error(`Unsupported adapter type: ${(config as any).type}`);
  }
}

/**
 * Create a mock adapter for development and testing
 * 
 * @param delay - Delay in milliseconds before returning mock data
 * @returns Mock adapter
 */
function createMockAdapter(delay: number = 500): BaseAdapter {
  return {
    async fetchData<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Generate mock data based on endpoint
      return generateMockData(endpoint, params) as T;
    },
    
    async createData<T>(endpoint: string, data: any): Promise<T> {
      await new Promise(resolve => setTimeout(resolve, delay));
      return { id: generateId(), ...data } as T;
    },
    
    async updateData<T>(endpoint: string, id: string, data: any): Promise<T> {
      await new Promise(resolve => setTimeout(resolve, delay));
      return { id, ...data } as T;
    },
    
    async deleteData(endpoint: string, id: string): Promise<boolean> {
      await new Promise(resolve => setTimeout(resolve, delay));
      return true;
    },
    
    async batchFetch<T>(endpoint: string, ids: string[]): Promise<T[]> {
      await new Promise(resolve => setTimeout(resolve, delay));
      return ids.map(id => ({ id, ...generateMockData(endpoint) }) as T);
    }
  };
}

/**
 * Generate a random ID
 * 
 * @returns Random ID
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Generate mock data based on endpoint
 * 
 * @param endpoint - API endpoint
 * @param params - Query parameters
 * @returns Mock data
 */
function generateMockData(endpoint: string, params?: Record<string, any>): any {
  // Extract the base endpoint without query parameters or IDs
  const baseEndpoint = endpoint.split('/')[0];
  
  switch (baseEndpoint) {
    case 'analytics':
      return generateAnalyticsMockData(endpoint, params);
    case 'products':
      return generateProductsMockData(endpoint, params);
    case 'orders':
      return generateOrdersMockData(endpoint, params);
    case 'customers':
      return generateCustomersMockData(endpoint, params);
    default:
      return { message: 'Mock data not implemented for this endpoint' };
  }
}

/**
 * Generate mock analytics data
 * 
 * @param endpoint - API endpoint
 * @param params - Query parameters
 * @returns Mock analytics data
 */
function generateAnalyticsMockData(endpoint: string, params?: Record<string, any>): any {
  const subEndpoint = endpoint.split('/')[1];
  
  switch (subEndpoint) {
    case 'revenue':
      return generatePaginatedResponse(
        Array.from({ length: 12 }, (_, i) => ({
          date: `2024-${String(i + 1).padStart(2, '0')}`,
          revenue: Math.floor(Math.random() * 50000) + 10000
        })),
        params
      );
    
    case 'sales':
      return generatePaginatedResponse(
        [
          { name: "Electronics", value: 35, color: "#10b981" },
          { name: "Clothing", value: 25, color: "#3b82f6" },
          { name: "Home & Garden", value: 20, color: "#6366f1" },
          { name: "Sports", value: 15, color: "#8b5cf6" },
          { name: "Other", value: 5, color: "#ec4899" }
        ],
        params
      );
    
    case 'visitors':
      return generatePaginatedResponse(
        [
          { name: "Direct", value: 40, color: "#3b82f6" },
          { name: "Social", value: 25, color: "#8b5cf6" },
          { name: "Organic", value: 20, color: "#10b981" },
          { name: "Referral", value: 15, color: "#f59e0b" }
        ],
        params
      );
    
    case 'conversion':
      return generatePaginatedResponse(
        Array.from({ length: 12 }, (_, i) => ({
          date: `2024-${String(i + 1).padStart(2, '0')}`,
          conversion: (Math.random() * 3) + 1
        })),
        params
      );
    
    case 'stats':
      return [
        {
          title: "Total Revenue",
          value: "$124,568.32",
          change: 12.5,
          changeType: "increase"
        },
        {
          title: "Orders",
          value: "1,429",
          change: 8.2,
          changeType: "increase"
        },
        {
          title: "Customers",
          value: "9,324",
          change: 5.3,
          changeType: "increase"
        },
        {
          title: "Conversion Rate",
          value: "3.2%",
          change: 1.1,
          changeType: "increase"
        }
      ];
    
    default:
      return { message: 'Mock data not implemented for this analytics endpoint' };
  }
}

/**
 * Generate mock products data
 * 
 * @param endpoint - API endpoint
 * @param params - Query parameters
 * @returns Mock products data
 */
function generateProductsMockData(endpoint: string, params?: Record<string, any>): any {
  const products = Array.from({ length: 20 }, (_, i) => ({
    id: `prod-${i + 1}`,
    name: `Product ${i + 1}`,
    description: `Description for Product ${i + 1}`,
    price: Math.floor(Math.random() * 1000) + 10,
    inventory: Math.floor(Math.random() * 100),
    category: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Other'][Math.floor(Math.random() * 5)],
    tags: ['new', 'sale', 'featured', 'popular'].filter(() => Math.random() > 0.5),
    images: [`/images/product-${i + 1}.jpg`],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
  
  return generatePaginatedResponse(products, params);
}

/**
 * Generate mock orders data
 * 
 * @param endpoint - API endpoint
 * @param params - Query parameters
 * @returns Mock orders data
 */
function generateOrdersMockData(endpoint: string, params?: Record<string, any>): any {
  const orders = Array.from({ length: 20 }, (_, i) => ({
    id: `ord-${i + 1}`,
    orderNumber: `ORD-${1000 + i}`,
    customer: {
      id: `cust-${Math.floor(Math.random() * 100) + 1}`,
      name: `Customer ${Math.floor(Math.random() * 100) + 1}`,
      email: `customer${Math.floor(Math.random() * 100) + 1}@example.com`
    },
    status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'][Math.floor(Math.random() * 5)],
    items: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
      id: `item-${i}-${j}`,
      productId: `prod-${Math.floor(Math.random() * 20) + 1}`,
      productName: `Product ${Math.floor(Math.random() * 20) + 1}`,
      quantity: Math.floor(Math.random() * 5) + 1,
      price: Math.floor(Math.random() * 100) + 10,
      total: (Math.floor(Math.random() * 100) + 10) * (Math.floor(Math.random() * 5) + 1)
    })),
    total: Math.floor(Math.random() * 1000) + 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
  
  return generatePaginatedResponse(orders, params);
}

/**
 * Generate mock customers data
 * 
 * @param endpoint - API endpoint
 * @param params - Query parameters
 * @returns Mock customers data
 */
function generateCustomersMockData(endpoint: string, params?: Record<string, any>): any {
  const customers = Array.from({ length: 20 }, (_, i) => ({
    id: `cust-${i + 1}`,
    firstName: `First${i + 1}`,
    lastName: `Last${i + 1}`,
    email: `customer${i + 1}@example.com`,
    phone: `+1-555-${String(1000 + i).padStart(4, '0')}`,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    totalSpent: Math.floor(Math.random() * 10000),
    totalOrders: Math.floor(Math.random() * 50),
    segment: ['new', 'returning', 'loyal', 'vip', 'at-risk'][Math.floor(Math.random() * 5)],
    tags: ['high-value', 'frequent-buyer', 'discount-seeker'].filter(() => Math.random() > 0.5)
  }));
  
  return generatePaginatedResponse(customers, params);
}

/**
 * Generate a paginated response
 * 
 * @param data - Data to paginate
 * @param params - Query parameters
 * @returns Paginated response
 */
function generatePaginatedResponse<T>(data: T[], params?: Record<string, any>): { data: T[], pagination: any } {
  const page = params?.page ? Number(params.page) : 1;
  const pageSize = params?.pageSize ? Number(params.pageSize) : 20;
  const total = data.length;
  const totalPages = Math.ceil(total / pageSize);
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    pagination: {
      total,
      page,
      pageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
}