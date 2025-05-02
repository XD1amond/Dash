/**
 * REST API Adapter
 * 
 * This adapter implements the BaseAdapter interface for REST APIs.
 * It provides methods for fetching, creating, updating, and deleting data from a REST API.
 */

import { BaseAdapter } from './base.adapter';

/**
 * REST Adapter Configuration
 */
export interface RestAdapterConfig {
  /**
   * Base URL for the API
   */
  baseUrl: string;
  
  /**
   * API key for authentication
   */
  apiKey?: string;
  
  /**
   * Additional headers to include in requests
   */
  headers?: Record<string, string>;
  
  /**
   * Timeout for requests in milliseconds
   */
  timeout?: number;
  
  /**
   * Whether to retry failed requests
   */
  retry?: {
    /**
     * Maximum number of retry attempts
     */
    maxRetries: number;
    
    /**
     * Base delay between retries in milliseconds
     */
    baseDelay: number;
    
    /**
     * Maximum delay between retries in milliseconds
     */
    maxDelay: number;
  };
  
  /**
   * Whether to log requests and responses
   */
  debug?: boolean;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: RestAdapterConfig = {
  baseUrl: '/api',
  timeout: 30000, // 30 seconds
  retry: {
    maxRetries: 3,
    baseDelay: 1000, // 1 second
    maxDelay: 10000 // 10 seconds
  },
  debug: false
};

/**
 * REST API Adapter
 * Implements the BaseAdapter interface for REST APIs
 */
export class RestAdapter implements BaseAdapter {
  private config: RestAdapterConfig;
  
  /**
   * Create a new RestAdapter
   * 
   * @param config - Configuration options
   */
  constructor(config: Partial<RestAdapterConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }
  
  /**
   * Fetch data from the API
   * 
   * @param endpoint - API endpoint
   * @param params - Query parameters
   * @returns Promise with the fetched data
   */
  async fetchData<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    
    if (this.config.debug) {
      console.log(`[RestAdapter] GET ${url}`);
    }
    
    try {
      const response = await this.fetchWithRetry(url, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (this.config.debug) {
        console.log(`[RestAdapter] Response:`, data);
      }
      
      return data as T;
    } catch (error) {
      if (this.config.debug) {
        console.error(`[RestAdapter] Error fetching data from ${url}:`, error);
      }
      throw this.formatError(error, `Error fetching data from ${endpoint}`);
    }
  }
  
  /**
   * Create data in the API
   * 
   * @param endpoint - API endpoint
   * @param data - Data to create
   * @returns Promise with the created data
   */
  async createData<T>(endpoint: string, data: any): Promise<T> {
    const url = this.buildUrl(endpoint);
    
    if (this.config.debug) {
      console.log(`[RestAdapter] POST ${url}`, data);
    }
    
    try {
      const response = await this.fetchWithRetry(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const responseData = await response.json();
      
      if (this.config.debug) {
        console.log(`[RestAdapter] Response:`, responseData);
      }
      
      return responseData as T;
    } catch (error) {
      if (this.config.debug) {
        console.error(`[RestAdapter] Error creating data at ${url}:`, error);
      }
      throw this.formatError(error, `Error creating data at ${endpoint}`);
    }
  }
  
  /**
   * Update data in the API
   * 
   * @param endpoint - API endpoint
   * @param id - ID of the data to update
   * @param data - Data to update
   * @returns Promise with the updated data
   */
  async updateData<T>(endpoint: string, id: string, data: any): Promise<T> {
    const url = this.buildUrl(`${endpoint}/${id}`);
    
    if (this.config.debug) {
      console.log(`[RestAdapter] PUT ${url}`, data);
    }
    
    try {
      const response = await this.fetchWithRetry(url, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const responseData = await response.json();
      
      if (this.config.debug) {
        console.log(`[RestAdapter] Response:`, responseData);
      }
      
      return responseData as T;
    } catch (error) {
      if (this.config.debug) {
        console.error(`[RestAdapter] Error updating data at ${url}:`, error);
      }
      throw this.formatError(error, `Error updating data at ${endpoint}/${id}`);
    }
  }
  
  /**
   * Delete data from the API
   * 
   * @param endpoint - API endpoint
   * @param id - ID of the data to delete
   * @returns Promise indicating success or failure
   */
  async deleteData(endpoint: string, id: string): Promise<boolean> {
    const url = this.buildUrl(`${endpoint}/${id}`);
    
    if (this.config.debug) {
      console.log(`[RestAdapter] DELETE ${url}`);
    }
    
    try {
      const response = await this.fetchWithRetry(url, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      if (this.config.debug) {
        console.error(`[RestAdapter] Error deleting data at ${url}:`, error);
      }
      throw this.formatError(error, `Error deleting data at ${endpoint}/${id}`);
    }
  }
  
  /**
   * Batch fetch data from the API
   * 
   * @param endpoint - API endpoint
   * @param ids - IDs of the data to fetch
   * @returns Promise with the fetched data
   */
  async batchFetch<T>(endpoint: string, ids: string[]): Promise<T[]> {
    if (ids.length === 0) {
      return [];
    }
    
    const url = this.buildUrl(endpoint, { ids: ids.join(',') });
    
    if (this.config.debug) {
      console.log(`[RestAdapter] GET ${url} (batch)`);
    }
    
    try {
      const response = await this.fetchWithRetry(url, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (this.config.debug) {
        console.log(`[RestAdapter] Response:`, data);
      }
      
      return data as T[];
    } catch (error) {
      if (this.config.debug) {
        console.error(`[RestAdapter] Error batch fetching data from ${url}:`, error);
      }
      throw this.formatError(error, `Error batch fetching data from ${endpoint}`);
    }
  }
  
  /**
   * Stream data from the API
   * 
   * @param endpoint - API endpoint
   * @param params - Query parameters
   * @returns AsyncIterable with the streamed data
   */
  async *streamData<T>(endpoint: string, params?: Record<string, any>): AsyncIterable<T> {
    const url = this.buildUrl(endpoint, params);
    
    if (this.config.debug) {
      console.log(`[RestAdapter] GET ${url} (stream)`);
    }
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      if (!response.body) {
        throw new Error('Response body is null');
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        buffer += decoder.decode(value, { stream: true });
        
        // Process complete JSON objects
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              yield data as T;
            } catch (error) {
              console.error(`[RestAdapter] Error parsing JSON:`, error);
            }
          }
        }
      }
      
      // Process any remaining data
      if (buffer.trim()) {
        try {
          const data = JSON.parse(buffer);
          yield data as T;
        } catch (error) {
          console.error(`[RestAdapter] Error parsing JSON:`, error);
        }
      }
    } catch (error) {
      if (this.config.debug) {
        console.error(`[RestAdapter] Error streaming data from ${url}:`, error);
      }
      throw this.formatError(error, `Error streaming data from ${endpoint}`);
    }
  }
  
  /**
   * Build a URL with query parameters
   * 
   * @param endpoint - API endpoint
   * @param params - Query parameters
   * @returns URL string
   */
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.config.baseUrl);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }
  
  /**
   * Get headers for requests
   * 
   * @returns Headers object
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }
    
    if (this.config.headers) {
      Object.assign(headers, this.config.headers);
    }
    
    return headers;
  }
  
  /**
   * Format an error for consistent error handling
   * 
   * @param error - Original error
   * @param message - Error message prefix
   * @returns Formatted error
   */
  private formatError(error: any, message: string): Error {
    if (error instanceof Error) {
      error.message = `${message}: ${error.message}`;
      return error;
    }
    
    return new Error(`${message}: ${String(error)}`);
  }
  
  /**
   * Fetch with retry logic
   * 
   * @param url - URL to fetch
   * @param options - Fetch options
   * @returns Promise with the response
   */
  private async fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
    const { maxRetries, baseDelay, maxDelay } = this.config.retry || { maxRetries: 0, baseDelay: 0, maxDelay: 0 };
    
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Add timeout to fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
        
        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // Only retry on 5xx errors or network failures
        if (response.status < 500 || attempt === maxRetries) {
          return response;
        }
        
        lastError = new Error(`API error: ${response.status} ${response.statusText}`);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Don't retry if it's an abort error (timeout)
        if (error instanceof DOMException && error.name === 'AbortError') {
          throw new Error(`Request timeout after ${this.config.timeout}ms`);
        }
        
        // Don't retry on the last attempt
        if (attempt === maxRetries) {
          throw lastError;
        }
      }
      
      // Calculate exponential backoff delay
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      
      if (this.config.debug) {
        console.log(`[RestAdapter] Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    // This should never happen, but just in case
    throw lastError || new Error('Unknown error during fetch with retry');
  }
}