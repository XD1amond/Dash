/**
 * Data Configuration
 * 
 * This is the main entry point for the data configuration system.
 * It provides a comprehensive solution for integrating your e-commerce website
 * with the dashboard, with production-level features:
 * 
 * - Type definitions for all data structures
 * - Input and output validation
 * - Caching with TTL and memory management
 * - Error handling and logging
 * - Pagination and filtering
 * - Real-time data updates
 * - Flexible adapter system for different data sources
 * - Mock data generation for development and testing
 * 
 * INTEGRATION GUIDE:
 * 
 * 1. Import the data types you need:
 *    ```typescript
 *    import { RevenueDataPoint, Order, Product } from '@/config/data/types';
 *    ```
 * 
 * 2. Create data services with your preferred adapter:
 *    ```typescript
 *    import { createServices } from '@/config/data';
 *    
 *    const services = createServices({
 *      adapter: {
 *        type: 'rest',
 *        rest: {
 *          baseUrl: 'https://api.example.com',
 *          apiKey: process.env.API_KEY
 *        }
 *      }
 *    });
 *    ```
 * 
 * 3. Use the services to fetch data:
 *    ```typescript
 *    const revenueData = await services.analytics.fetchRevenueData(
 *      new Date('2024-01-01'),
 *      new Date('2024-12-31'),
 *      'month'
 *    );
 *    ```
 * 
 * 4. For real-time updates, subscribe to data changes:
 *    ```typescript
 *    const unsubscribe = services.analytics.subscribeToRevenueUpdates(
 *      (data) => {
 *        console.log('New revenue data:', data);
 *        // Update your UI
 *      }
 *    );
 *    
 *    // Later, when you're done:
 *    unsubscribe();
 *    ```
 * 
 * 5. For development and testing, use mock services:
 *    ```typescript
 *    import { createMockServices } from '@/config/data';
 *    
 *    const services = createMockServices();
 *    ```
 */

// Export all types
export * from './types';

// Export all validation utilities
export * from './validation';

// Export all adapters
export * from './adapters';

// Export all services
export * from './services';

// Export all utilities
export * from './utils/cache';

// Export all realtime utilities
export * from './realtime';

// Re-export the most commonly used functions for convenience
import { createServices, createMockServices } from './services';
export { createServices, createMockServices };