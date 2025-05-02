/**
 * Realtime Data Management
 * 
 * This module provides functionality for real-time data updates using various
 * transport mechanisms (WebSockets, SSE, polling).
 */

import { FilterOptions } from '../types/analytics.types';

/**
 * Realtime Update Transport
 * Defines the interface for different transport mechanisms
 */
export interface RealtimeTransport {
  /**
   * Connect to the realtime data source
   */
  connect(): Promise<void>;
  
  /**
   * Disconnect from the realtime data source
   */
  disconnect(): void;
  
  /**
   * Subscribe to a topic
   * 
   * @param topic - The topic to subscribe to
   * @param callback - Function to call when new data is available
   * @param options - Optional filter options
   * @returns Unsubscribe function
   */
  subscribe<T>(topic: string, callback: (data: T) => void, options?: any): () => void;
  
  /**
   * Check if the transport is connected
   */
  isConnected(): boolean;
}

/**
 * Realtime Manager Configuration
 */
export interface RealtimeManagerConfig {
  /**
   * Transport type to use
   */
  transport?: 'websocket' | 'sse' | 'polling';
  
  /**
   * WebSocket configuration
   */
  websocket?: {
    url: string;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
  };
  
  /**
   * Server-Sent Events configuration
   */
  sse?: {
    url: string;
    reconnectInterval?: number;
  };
  
  /**
   * Polling configuration
   */
  polling?: {
    interval: number;
    endpoints: Record<string, string>;
  };
  
  /**
   * Whether to automatically connect on initialization
   */
  autoConnect?: boolean;
  
  /**
   * Whether to log debug information
   */
  debug?: boolean;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: RealtimeManagerConfig = {
  transport: 'websocket',
  websocket: {
    url: '/api/realtime',
    reconnectInterval: 5000,
    maxReconnectAttempts: 10
  },
  autoConnect: true,
  debug: false
};

/**
 * Realtime Manager
 * Manages real-time data updates
 */
export class RealtimeManager {
  private transport: RealtimeTransport | null = null;
  private config: RealtimeManagerConfig;
  private subscriptions: Map<string, Set<(data: any) => void>> = new Map();
  private connected: boolean = false;
  private connecting: boolean = false;
  private reconnectAttempts: number = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  
  /**
   * Create a new RealtimeManager
   * 
   * @param config - Configuration options
   */
  constructor(config: RealtimeManagerConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Initialize transport based on configuration
    this.initializeTransport();
    
    // Auto-connect if configured
    if (this.config.autoConnect && this.transport) {
      this.connect();
    }
  }
  
  /**
   * Initialize the transport based on configuration
   */
  private initializeTransport(): void {
    switch (this.config.transport) {
      case 'websocket':
        if (this.config.websocket?.url) {
          this.transport = new WebSocketTransport(this.config.websocket);
        }
        break;
      case 'sse':
        if (this.config.sse?.url) {
          this.transport = new SSETransport(this.config.sse);
        }
        break;
      case 'polling':
        if (this.config.polling?.interval && this.config.polling?.endpoints) {
          this.transport = new PollingTransport(this.config.polling);
        }
        break;
      default:
        // Default to mock transport for development
        this.transport = new MockTransport();
        break;
    }
  }
  
  /**
   * Connect to the realtime data source
   * 
   * @returns Promise that resolves when connected
   */
  async connect(): Promise<void> {
    if (this.connected || this.connecting || !this.transport) {
      return;
    }
    
    this.connecting = true;
    
    try {
      await this.transport.connect();
      this.connected = true;
      this.reconnectAttempts = 0;
      
      if (this.config.debug) {
        console.log('Realtime connection established');
      }
    } catch (error) {
      this.connected = false;
      
      if (this.config.debug) {
        console.error('Failed to connect to realtime data source:', error);
      }
      
      // Attempt to reconnect
      this.scheduleReconnect();
    } finally {
      this.connecting = false;
    }
  }
  
  /**
   * Disconnect from the realtime data source
   */
  disconnect(): void {
    if (!this.connected || !this.transport) {
      return;
    }
    
    this.transport.disconnect();
    this.connected = false;
    
    // Clear any pending reconnect
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.config.debug) {
      console.log('Realtime connection closed');
    }
  }
  
  /**
   * Schedule a reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    const maxAttempts = this.config.websocket?.maxReconnectAttempts || 10;
    
    if (this.reconnectAttempts >= maxAttempts) {
      if (this.config.debug) {
        console.error(`Maximum reconnect attempts (${maxAttempts}) reached`);
      }
      return;
    }
    
    const interval = this.config.websocket?.reconnectInterval || 5000;
    const delay = interval * Math.pow(1.5, this.reconnectAttempts);
    
    this.reconnectAttempts++;
    
    if (this.config.debug) {
      console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);
    }
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }
  
  /**
   * Subscribe to a topic
   * 
   * @param topic - The topic to subscribe to
   * @param callback - Function to call when new data is available
   * @param options - Optional filter options
   * @returns Unsubscribe function
   */
  subscribe<T>(topic: string, callback: (data: T) => void, options?: FilterOptions): () => void {
    // Ensure we're connected
    if (!this.connected && !this.connecting && this.transport) {
      this.connect();
    }
    
    // Register the callback
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, new Set());
    }
    
    this.subscriptions.get(topic)!.add(callback);
    
    // Subscribe via transport if available
    if (this.transport) {
      return this.transport.subscribe<T>(topic, callback, options);
    }
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.subscriptions.get(topic);
      if (callbacks) {
        callbacks.delete(callback);
        
        if (callbacks.size === 0) {
          this.subscriptions.delete(topic);
        }
      }
    };
  }
  
  /**
   * Check if the manager is connected
   * 
   * @returns True if connected
   */
  isConnected(): boolean {
    return this.connected;
  }
}

/**
 * WebSocket Transport
 * Implements real-time updates using WebSockets
 */
class WebSocketTransport implements RealtimeTransport {
  private ws: WebSocket | null = null;
  private config: RealtimeManagerConfig['websocket'];
  private subscriptions: Map<string, Set<(data: any) => void>> = new Map();
  
  constructor(config: RealtimeManagerConfig['websocket']) {
    this.config = config;
  }
  
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.config!.url);
        
        this.ws.onopen = () => {
          resolve();
        };
        
        this.ws.onerror = (error) => {
          reject(error);
        };
        
        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            const { topic, data } = message;
            
            if (topic && this.subscriptions.has(topic)) {
              const callbacks = this.subscriptions.get(topic)!;
              callbacks.forEach(callback => callback(data));
            }
          } catch (error) {
            console.error('Error processing WebSocket message:', error);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }
  
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
  
  subscribe<T>(topic: string, callback: (data: T) => void, options?: any): () => void {
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, new Set());
      
      // Send subscription message to server
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'subscribe',
          topic,
          options
        }));
      }
    }
    
    this.subscriptions.get(topic)!.add(callback);
    
    return () => {
      const callbacks = this.subscriptions.get(topic);
      if (callbacks) {
        callbacks.delete(callback);
        
        if (callbacks.size === 0) {
          this.subscriptions.delete(topic);
          
          // Send unsubscribe message to server
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
              type: 'unsubscribe',
              topic
            }));
          }
        }
      }
    };
  }
  
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

/**
 * Server-Sent Events Transport
 * Implements real-time updates using Server-Sent Events (SSE)
 */
class SSETransport implements RealtimeTransport {
  private eventSource: EventSource | null = null;
  private config: RealtimeManagerConfig['sse'];
  private subscriptions: Map<string, Set<(data: any) => void>> = new Map();
  
  constructor(config: RealtimeManagerConfig['sse']) {
    this.config = config;
  }
  
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.eventSource = new EventSource(this.config!.url);
        
        this.eventSource.onopen = () => {
          resolve();
        };
        
        this.eventSource.onerror = (error) => {
          reject(error);
        };
        
        this.eventSource.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            const { topic, data } = message;
            
            if (topic && this.subscriptions.has(topic)) {
              const callbacks = this.subscriptions.get(topic)!;
              callbacks.forEach(callback => callback(data));
            }
          } catch (error) {
            console.error('Error processing SSE message:', error);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }
  
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
  
  subscribe<T>(topic: string, callback: (data: T) => void, options?: any): () => void {
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, new Set());
      
      // For SSE, we need to add event listeners for specific topics
      if (this.eventSource) {
        this.eventSource.addEventListener(topic, (event: any) => {
          try {
            const data = JSON.parse(event.data);
            const callbacks = this.subscriptions.get(topic);
            if (callbacks) {
              callbacks.forEach(callback => callback(data));
            }
          } catch (error) {
            console.error(`Error processing SSE event for topic ${topic}:`, error);
          }
        });
      }
    }
    
    this.subscriptions.get(topic)!.add(callback);
    
    return () => {
      const callbacks = this.subscriptions.get(topic);
      if (callbacks) {
        callbacks.delete(callback);
        
        if (callbacks.size === 0) {
          this.subscriptions.delete(topic);
          // Note: SSE doesn't have a built-in way to unsubscribe from specific events
        }
      }
    };
  }
  
  isConnected(): boolean {
    return this.eventSource !== null && this.eventSource.readyState === EventSource.OPEN;
  }
}

/**
 * Polling Transport
 * Implements real-time updates using polling
 */
class PollingTransport implements RealtimeTransport {
  private config: RealtimeManagerConfig['polling'];
  private subscriptions: Map<string, Set<(data: any) => void>> = new Map();
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();
  private connected: boolean = false;
  
  constructor(config: RealtimeManagerConfig['polling']) {
    this.config = config;
  }
  
  async connect(): Promise<void> {
    this.connected = true;
    return Promise.resolve();
  }
  
  disconnect(): void {
    this.connected = false;
    
    // Clear all polling intervals
    this.pollingIntervals.forEach((interval) => {
      clearInterval(interval);
    });
    
    this.pollingIntervals.clear();
  }
  
  subscribe<T>(topic: string, callback: (data: T) => void, options?: any): () => void {
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, new Set());
      
      // Start polling for this topic if we have an endpoint for it
      if (this.config?.endpoints[topic]) {
        const endpoint = this.config.endpoints[topic];
        const interval = this.config.interval;
        
        // Set up polling
        const pollingInterval = setInterval(async () => {
          if (!this.connected) return;
          
          try {
            const response = await fetch(endpoint, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            if (!response.ok) {
              throw new Error(`HTTP error: ${response.status}`);
            }
            
            const data = await response.json();
            const callbacks = this.subscriptions.get(topic);
            
            if (callbacks) {
              callbacks.forEach(callback => callback(data));
            }
          } catch (error) {
            console.error(`Error polling endpoint ${endpoint}:`, error);
          }
        }, interval);
        
        this.pollingIntervals.set(topic, pollingInterval);
      }
    }
    
    this.subscriptions.get(topic)!.add(callback);
    
    return () => {
      const callbacks = this.subscriptions.get(topic);
      if (callbacks) {
        callbacks.delete(callback);
        
        if (callbacks.size === 0) {
          this.subscriptions.delete(topic);
          
          // Stop polling for this topic
          const interval = this.pollingIntervals.get(topic);
          if (interval) {
            clearInterval(interval);
            this.pollingIntervals.delete(topic);
          }
        }
      }
    };
  }
  
  isConnected(): boolean {
    return this.connected;
  }
}

/**
 * Mock Transport
 * Provides mock data for development and testing
 */
class MockTransport implements RealtimeTransport {
  private subscriptions: Map<string, Set<(data: any) => void>> = new Map();
  private mockIntervals: Map<string, NodeJS.Timeout> = new Map();
  private connected: boolean = false;
  
  async connect(): Promise<void> {
    this.connected = true;
    return Promise.resolve();
  }
  
  disconnect(): void {
    this.connected = false;
    
    // Clear all mock intervals
    this.mockIntervals.forEach((interval) => {
      clearInterval(interval);
    });
    
    this.mockIntervals.clear();
  }
  
  subscribe<T>(topic: string, callback: (data: T) => void, options?: any): () => void {
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, new Set());
      
      // Set up mock data generation
      const mockInterval = setInterval(() => {
        if (!this.connected) return;
        
        const mockData = this.generateMockData(topic);
        const callbacks = this.subscriptions.get(topic);
        
        if (callbacks && mockData) {
          callbacks.forEach(callback => callback(mockData as T));
        }
      }, 5000); // Generate mock data every 5 seconds
      
      this.mockIntervals.set(topic, mockInterval);
    }
    
    this.subscriptions.get(topic)!.add(callback);
    
    return () => {
      const callbacks = this.subscriptions.get(topic);
      if (callbacks) {
        callbacks.delete(callback);
        
        if (callbacks.size === 0) {
          this.subscriptions.delete(topic);
          
          // Stop generating mock data for this topic
          const interval = this.mockIntervals.get(topic);
          if (interval) {
            clearInterval(interval);
            this.mockIntervals.delete(topic);
          }
        }
      }
    };
  }
  
  isConnected(): boolean {
    return this.connected;
  }
  
  /**
   * Generate mock data for a specific topic
   * 
   * @param topic - The topic to generate mock data for
   * @returns Mock data
   */
  private generateMockData(topic: string): any {
    const now = new Date();
    
    switch (topic) {
      case 'analytics/revenue':
        return {
          date: now.toISOString().substring(0, 10),
          revenue: Math.floor(Math.random() * 10000) + 5000
        };
      
      case 'analytics/conversion':
        return {
          date: now.toISOString().substring(0, 10),
          conversion: (Math.random() * 5) + 1
        };
      
      case 'analytics/visitors':
        const sources = ['Direct', 'Social', 'Organic', 'Referral', 'Email'];
        const source = sources[Math.floor(Math.random() * sources.length)];
        return {
          name: source,
          value: Math.floor(Math.random() * 100) + 50
        };
      
      default:
        return null;
    }
  }
}