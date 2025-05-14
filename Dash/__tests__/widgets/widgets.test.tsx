import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import widget components
import { businessWidgets } from '../../app/components/dashboard/widgets/business-widgets';
import { forecastWidgets } from '../../app/components/dashboard/widgets/forecast-widgets';
import { customerWidgets } from '../../app/components/dashboard/widgets/customer-widgets';
import { analyticsWidgets } from '../../app/components/dashboard/widgets/analytics-widgets';
import { createStatCardWidgets } from '../../app/components/dashboard/widgets/stat-card-widgets';
import { createOverviewWidgets } from '../../app/components/dashboard/widgets/overview-widgets';

// Import demo data
import {
  revenueByChannelData,
  customerLifetimeValueData,
  salesFunnelData,
  cohortAnalysisData,
  abTestingData,
  customerSegmentationData,
  customerFeedbackData,
  salesForecastData,
  inventoryForecastData
} from '../../../demo/data/widget-data';

// Import analytics data generators
import {
  generateRevenueData,
  generateSalesData,
  generateVisitorsData,
  generateConversionData,
  generateStatCardData
} from '../../../demo/data/analytics-data';

// Mock the RestAdapter to prevent actual API calls
jest.mock('../../config/data/adapters/rest.adapter', () => {
  return {
    RestAdapter: jest.fn().mockImplementation(() => {
      return {
        fetchData: jest.fn().mockResolvedValue({ data: [] })
      };
    })
  };
});

describe('Widget Components', () => {
  // Test business widgets
  describe('Business Widgets', () => {
    it('should render RevenueByChannelWidget with provided data', async () => {
      const RevenueByChannelWidget = businessWidgets.find(w => w.id === 'revenue-by-channel')?.component;
      if (!RevenueByChannelWidget) throw new Error('Widget not found');
      
      render(RevenueByChannelWidget);
      
      // Wait for the component to render
      await waitFor(() => {
        // The component should not show loading state when data is provided
        expect(screen.queryByText('Loading revenue by channel data...')).not.toBeInTheDocument();
      });
    });
  });

  // Test forecast widgets
  describe('Forecast Widgets', () => {
    it('should render RevenueForecastWidget with provided data', async () => {
      const RevenueForecastWidget = forecastWidgets.find(w => w.id === 'revenue-forecast')?.component;
      if (!RevenueForecastWidget) throw new Error('Widget not found');
      
      render(RevenueForecastWidget);
      
      // Wait for the component to render
      await waitFor(() => {
        // The component should not show loading state when data is provided
        expect(screen.queryByText('Loading forecast data...')).not.toBeInTheDocument();
      });
    });
  });

  // Test customer widgets
  describe('Customer Widgets', () => {
    it('should render CustomerSegmentsWidget with provided data', async () => {
      const CustomerSegmentsWidget = customerWidgets.find(w => w.id === 'customer-segments')?.component;
      if (!CustomerSegmentsWidget) throw new Error('Widget not found');
      
      render(CustomerSegmentsWidget);
      
      // Wait for the component to render
      await waitFor(() => {
        // The component should not show loading state when data is provided
        expect(screen.queryByText('Loading segment data...')).not.toBeInTheDocument();
      });
    });
  });

  // Test analytics widgets
  describe('Analytics Widgets', () => {
    it('should render SalesFunnelWidget with provided data', async () => {
      const SalesFunnelWidget = analyticsWidgets.find(w => w.id === 'sales-funnel')?.component;
      if (!SalesFunnelWidget) throw new Error('Widget not found');
      
      render(SalesFunnelWidget);
      
      // Wait for the component to render
      await waitFor(() => {
        // The component should not show loading state when data is provided
        expect(screen.queryByText('Loading sales funnel data...')).not.toBeInTheDocument();
      });
    });
  });

  // Test stat card widgets
  describe('Stat Card Widgets', () => {
    it('should render StatCardWidget with provided data', async () => {
      const statCardData = generateStatCardData();
      const statCardWidgets = createStatCardWidgets(statCardData);
      const StatCardWidget = statCardWidgets[0]?.component;
      if (!StatCardWidget) throw new Error('Widget not found');
      
      render(StatCardWidget);
      
      // Wait for the component to render
      await waitFor(() => {
        // The component should not show loading state when data is provided
        expect(screen.queryByText('Loading stat card data...')).not.toBeInTheDocument();
      });
    });
  });

  // Test overview widgets
  describe('Overview Widgets', () => {
    it('should render RevenueChartWidget with provided data', async () => {
      // Convert the data to the expected format
      const revenueData = generateRevenueData().map(item => ({
        date: `2024-${item.name}`,
        revenue: item.revenue
      }));
      const salesData = generateSalesData();
      const visitorsData = generateVisitorsData();
      const conversionData = generateConversionData().map(item => ({
        date: `2024-${item.name}`,
        conversion: item.conversion
      }));
      
      const overviewWidgets = createOverviewWidgets(revenueData, salesData, visitorsData, conversionData);
      const RevenueChartWidget = overviewWidgets.find(w => w.id === 'revenue-chart')?.component;
      if (!RevenueChartWidget) throw new Error('Widget not found');
      
      render(RevenueChartWidget);
      
      // Wait for the component to render
      await waitFor(() => {
        // The component should not show loading state when data is provided
        expect(screen.queryByText('Loading revenue data...')).not.toBeInTheDocument();
      });
    });
  });
});