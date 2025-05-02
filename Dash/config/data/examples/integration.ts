/**
 * Data Configuration Integration Example
 *
 * This file demonstrates how to integrate the data configuration system
 * with a real application. It shows how to:
 *
 * 1. Create data services with a REST adapter
 * 2. Fetch data from the services
 * 3. Subscribe to real-time updates
 * 4. Handle errors and edge cases
 */

import React from 'react';
import { createServices, createMockServices } from '../services';
import { RevenueDataPoint, SalesDataPoint, VisitorsDataPoint, ConversionDataPoint } from '../types';

/**
 * Example: Create services with a REST adapter
 */
function createProductionServices() {
  return createServices({
    adapter: {
      type: 'rest',
      rest: {
        baseUrl: process.env.API_URL || 'https://api.example.com',
        apiKey: process.env.API_KEY,
        timeout: 10000, // 10 seconds
        retry: {
          maxRetries: 3,
          baseDelay: 1000,
          maxDelay: 5000
        },
        debug: process.env.NODE_ENV === 'development'
      }
    },
    analytics: {
      cacheTTL: {
        revenue: 5 * 60, // 5 minutes
        sales: 5 * 60,
        visitors: 5 * 60,
        conversion: 5 * 60,
        statCard: 2 * 60 // 2 minutes
      },
      defaultPageSize: 20,
      enableRealtime: true,
      logPerformance: process.env.NODE_ENV === 'development'
    },
    cache: {
      maxSize: 50 * 1024 * 1024 // 50MB
    },
    realtime: {
      enabled: true,
      transport: 'websocket',
      websocketUrl: process.env.WEBSOCKET_URL || 'wss://api.example.com/realtime'
    }
  });
}

/**
 * Example: Create services for development
 */
function createDevelopmentServices() {
  return createMockServices(500); // 500ms delay
}

/**
 * Example: Create services based on environment
 */
export function createAppServices() {
  if (process.env.NODE_ENV === 'production') {
    return createProductionServices();
  } else {
    return createDevelopmentServices();
  }
}

/**
 * Example: Fetch dashboard data
 */
export async function fetchDashboardData(from: Date, to: Date) {
  const services = createAppServices();
  
  try {
    // Fetch all data in parallel
    const [revenue, sales, visitors, conversion, stats] = await Promise.all([
      services.analytics.fetchRevenueData(from, to, 'month'),
      services.analytics.fetchSalesByCategory(from, to),
      services.analytics.fetchVisitorsBySource(from, to),
      services.analytics.fetchConversionData(from, to, 'month'),
      services.analytics.fetchStatCardData()
    ]);
    
    return {
      revenue: revenue.data,
      sales: sales.data,
      visitors: visitors.data,
      conversion: conversion.data,
      stats
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw new Error(`Failed to fetch dashboard data: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Example: Subscribe to real-time updates
 */
export function subscribeToRealtimeUpdates(
  onRevenueUpdate: (data: RevenueDataPoint) => void,
  onConversionUpdate: (data: ConversionDataPoint) => void
) {
  const services = createAppServices();
  
  // Subscribe to revenue updates
  const unsubscribeRevenue = services.analytics.subscribeToRevenueUpdates(onRevenueUpdate);
  
  // Subscribe to conversion updates
  const unsubscribeConversion = services.analytics.subscribeToConversionUpdates(onConversionUpdate);
  
  // Return a function to unsubscribe from all updates
  return () => {
    unsubscribeRevenue();
    unsubscribeConversion();
  };
}

/**
 * Example: React hook for dashboard data
 */
export function useDashboardData(from: Date, to: Date) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [data, setData] = React.useState<{
    revenue: RevenueDataPoint[];
    sales: SalesDataPoint[];
    visitors: VisitorsDataPoint[];
    conversion: ConversionDataPoint[];
    stats: any[];
  } | null>(null);
  
  React.useEffect(() => {
    let isMounted = true;
    
    async function loadData() {
      try {
        setLoading(true);
        const result = await fetchDashboardData(from, to);
        
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    loadData();
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToRealtimeUpdates(
      (revenueData) => {
        if (isMounted && data) {
          // Update revenue data
          setData(prevData => ({
            ...prevData!,
            revenue: [
              revenueData,
              ...prevData!.revenue.filter(item => item.date !== revenueData.date)
            ]
          }));
        }
      },
      (conversionData) => {
        if (isMounted && data) {
          // Update conversion data
          setData(prevData => ({
            ...prevData!,
            conversion: [
              conversionData,
              ...prevData!.conversion.filter(item => item.date !== conversionData.date)
            ]
          }));
        }
      }
    );
    
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [from, to]);
  
  return { loading, error, data };
}

/**
 * Example: Next.js API route for dashboard data
 */
export async function dashboardApiHandler(req: any, res: any) {
  // Parse query parameters
  const { from, to } = req.query;
  
  if (!from || !to) {
    return res.status(400).json({ error: 'Missing required parameters: from, to' });
  }
  
  try {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    
    // Validate dates
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }
    
    // Fetch dashboard data
    const data = await fetchDashboardData(fromDate, toDate);
    
    // Return the data
    return res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
}