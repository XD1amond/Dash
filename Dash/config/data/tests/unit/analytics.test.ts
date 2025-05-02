/**
 * Analytics Service Tests
 * 
 * This file contains unit tests for the analytics service.
 * It demonstrates how to use the data configuration system in a real application.
 */

import { createMockServices } from '../../services';
import { RevenueDataPoint, PaginatedResponse } from '../../types';

describe('AnalyticsService', () => {
  // Create mock services for testing
  const services = createMockServices(0); // No delay for tests
  
  describe('fetchRevenueData', () => {
    it('should fetch revenue data with pagination', async () => {
      // Define test parameters
      const from = new Date('2024-01-01');
      const to = new Date('2024-12-31');
      const interval = 'month';
      const page = 1;
      const pageSize = 10;
      
      // Call the service
      const result = await services.analytics.fetchRevenueData(
        from,
        to,
        interval,
        page,
        pageSize
      );
      
      // Assert the result structure
      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Array);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.page).toBe(page);
      expect(result.pagination.pageSize).toBe(pageSize);
      
      // Assert the data structure
      if (result.data.length > 0) {
        const item = result.data[0];
        expect(item).toHaveProperty('date');
        expect(item).toHaveProperty('revenue');
        expect(typeof item.date).toBe('string');
        expect(typeof item.revenue).toBe('number');
      }
    });
    
    it('should throw an error if start date is after end date', async () => {
      // Define test parameters with invalid date range
      const from = new Date('2024-12-31');
      const to = new Date('2024-01-01');
      
      // Assert that the service throws an error
      await expect(
        services.analytics.fetchRevenueData(from, to)
      ).rejects.toThrow('Start date must be before or equal to end date');
    });
    
    it('should use cache for repeated calls with same parameters', async () => {
      // Define test parameters
      const from = new Date('2024-01-01');
      const to = new Date('2024-12-31');
      
      // Spy on the adapter's fetchData method
      const fetchDataSpy = jest.spyOn(services.adapter, 'fetchData');
      
      // First call should use the adapter
      await services.analytics.fetchRevenueData(from, to);
      expect(fetchDataSpy).toHaveBeenCalledTimes(1);
      
      // Second call with same parameters should use cache
      await services.analytics.fetchRevenueData(from, to);
      expect(fetchDataSpy).toHaveBeenCalledTimes(1); // Still 1, not 2
      
      // Restore the spy
      fetchDataSpy.mockRestore();
    });
  });
  
  describe('fetchSalesByCategory', () => {
    it('should fetch sales data by category', async () => {
      // Define test parameters
      const from = new Date('2024-01-01');
      const to = new Date('2024-12-31');
      
      // Call the service
      const result = await services.analytics.fetchSalesByCategory(from, to);
      
      // Assert the result structure
      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Array);
      
      // Assert the data structure
      if (result.data.length > 0) {
        const item = result.data[0];
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('value');
        expect(typeof item.name).toBe('string');
        expect(typeof item.value).toBe('number');
      }
    });
  });
  
  describe('fetchVisitorsBySource', () => {
    it('should fetch visitors data by source', async () => {
      // Define test parameters
      const from = new Date('2024-01-01');
      const to = new Date('2024-12-31');
      
      // Call the service
      const result = await services.analytics.fetchVisitorsBySource(from, to);
      
      // Assert the result structure
      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Array);
      
      // Assert the data structure
      if (result.data.length > 0) {
        const item = result.data[0];
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('value');
        expect(typeof item.name).toBe('string');
        expect(typeof item.value).toBe('number');
      }
    });
  });
  
  describe('fetchConversionData', () => {
    it('should fetch conversion rate data', async () => {
      // Define test parameters
      const from = new Date('2024-01-01');
      const to = new Date('2024-12-31');
      const interval = 'month';
      
      // Call the service
      const result = await services.analytics.fetchConversionData(from, to, interval);
      
      // Assert the result structure
      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Array);
      
      // Assert the data structure
      if (result.data.length > 0) {
        const item = result.data[0];
        expect(item).toHaveProperty('date');
        expect(item).toHaveProperty('conversion');
        expect(typeof item.date).toBe('string');
        expect(typeof item.conversion).toBe('number');
      }
    });
  });
  
  describe('fetchStatCardData', () => {
    it('should fetch stat card data', async () => {
      // Call the service
      const result = await services.analytics.fetchStatCardData();
      
      // Assert the result structure
      expect(result).toBeInstanceOf(Array);
      
      // Assert the data structure
      if (result.length > 0) {
        const item = result[0];
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('value');
        expect(item).toHaveProperty('change');
        expect(item).toHaveProperty('changeType');
        expect(typeof item.title).toBe('string');
        expect(typeof item.value).toBe('string');
        expect(typeof item.change).toBe('number');
        expect(['increase', 'decrease']).toContain(item.changeType);
      }
    });
  });
  
  describe('subscribeToRevenueUpdates', () => {
    it('should subscribe to revenue updates', () => {
      // Create a mock callback
      const callback = jest.fn();
      
      // Subscribe to updates
      const unsubscribe = services.analytics.subscribeToRevenueUpdates(callback);
      
      // Assert that the subscription was created
      expect(typeof unsubscribe).toBe('function');
      
      // Unsubscribe
      unsubscribe();
    });
  });
  
  describe('clearCache', () => {
    it('should clear the cache', async () => {
      // Define test parameters
      const from = new Date('2024-01-01');
      const to = new Date('2024-12-31');
      
      // Spy on the adapter's fetchData method
      const fetchDataSpy = jest.spyOn(services.adapter, 'fetchData');
      
      // First call should use the adapter
      await services.analytics.fetchRevenueData(from, to);
      expect(fetchDataSpy).toHaveBeenCalledTimes(1);
      
      // Clear the cache
      services.analytics.clearCache();
      
      // Second call should use the adapter again
      await services.analytics.fetchRevenueData(from, to);
      expect(fetchDataSpy).toHaveBeenCalledTimes(2);
      
      // Restore the spy
      fetchDataSpy.mockRestore();
    });
  });
});