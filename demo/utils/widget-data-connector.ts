import {
  salesFunnelData,
  cohortAnalysisData,
  abTestingData,
  customerSegmentationData,
  customerFeedbackData,
  revenueByChannelData,
  customerLifetimeValueData,
  salesForecastData,
  inventoryForecastData,
  campaignPerformanceData,
  socialMediaPerformanceData,
  sitePerformanceData,
  topPagesData,
  topProductsData,
  productInventoryData,
  performanceOverviewData,
  marketingRoiData,
  productPerformanceData
} from '../data/widget-data';

import { createAnalyticsWidgets } from '../../Dash/app/components/dashboard/widgets/analytics-widgets';
import { createBusinessWidgets } from '../../Dash/app/components/dashboard/widgets/business-widgets';
import { createCustomerWidgets } from '../../Dash/app/components/dashboard/widgets/customer-widgets';
import { createForecastWidgets } from '../../Dash/app/components/dashboard/widgets/forecast-widgets';
import { createMarketingWidgets } from '../../Dash/app/components/dashboard/widgets/marketing-widgets';
import { createWebsiteWidgets } from '../../Dash/app/components/dashboard/widgets/website-widgets';
import { createProductWidgets } from '../../Dash/app/components/dashboard/widgets/product-widgets';
import { createPerformanceWidgets } from '../../Dash/app/components/dashboard/widgets/performance-widgets';

/**
 * Creates analytics widgets with demo data
 */
export const createAnalyticsWidgetsWithDemoData = () => {
  return createAnalyticsWidgets(
    salesFunnelData,
    cohortAnalysisData,
    abTestingData
  );
};

/**
 * Creates business widgets with demo data
 */
export const createBusinessWidgetsWithDemoData = () => {
  // Create a revenue growth data object
  const revenueGrowthData = {
    growthPercentage: '+15.2%',
    comparisonPeriod: 'Compared to last year'
  };

  // Create a customer acquisition data object
  const customerAcquisitionData = {
    cac: '$42.50',
    change: '-5.3%',
    period: 'from last quarter'
  };

  return createBusinessWidgets(
    revenueGrowthData,
    revenueByChannelData,
    customerAcquisitionData,
    customerLifetimeValueData
  );
};

/**
 * Creates customer widgets with demo data
 */
export const createCustomerWidgetsWithDemoData = () => {
  // Create a customer satisfaction data object
  const customerSatisfactionData = {
    rating: '4.2/5.0',
    reviewCount: '1,245',
    change: '+0.3',
    period: 'from last quarter'
  };

  return createCustomerWidgets(
    customerSegmentationData,
    customerSatisfactionData,
    customerFeedbackData
  );
};

/**
 * Creates forecast widgets with demo data
 */
export const createForecastWidgetsWithDemoData = () => {
  // Create stock summary data
  const stockSummary = {
    lowStock: 12,
    reorderSoon: 23,
    adequateStock: 45,
    overstocked: 15
  };

  // Enhance inventory forecast data to match the required interface
  const enhancedInventoryData = inventoryForecastData.map(item => ({
    ...item,
    daysUntilReorder: Math.floor(Math.random() * 30),
    stockoutRisk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
    productId: `prod-${Math.floor(Math.random() * 1000)}`
  }));

  // Create trend prediction data
  const trendPredictionData = [
    {
      trend: 'Mobile Shopping',
      status: 'Rising' as const,
      growth: '+15%',
      confidence: 85,
      impactLevel: 'high' as const,
      timeFrame: 'short-term' as const
    },
    {
      trend: 'Sustainable Products',
      status: 'Rising' as const,
      growth: '+22%',
      confidence: 78,
      impactLevel: 'medium' as const,
      timeFrame: 'medium-term' as const
    },
    {
      trend: 'Physical Stores',
      status: 'Declining' as const,
      growth: '-8%',
      confidence: 65,
      impactLevel: 'medium' as const,
      timeFrame: 'long-term' as const
    }
  ];

  return createForecastWidgets(
    salesForecastData,
    enhancedInventoryData,
    trendPredictionData,
    'Jun',
    '$312,000',
    '+4.7%',
    stockSummary
  );
};

/**
 * Creates marketing widgets with demo data
 */
export const createMarketingWidgetsWithDemoData = () => {
  // Create email metrics data
  const emailMetricsData = [
    { metric: 'Open Rate', value: '24.8%', change: '+1.2%' },
    { metric: 'Click Rate', value: '3.6%', change: '+0.5%' },
    { metric: 'Conversion Rate', value: '2.1%', change: '+0.3%' },
    { metric: 'Unsubscribe Rate', value: '0.4%', change: '-0.1%' }
  ];

  return createMarketingWidgets(
    campaignPerformanceData,
    socialMediaPerformanceData,
    emailMetricsData
  );
};

/**
 * Creates website widgets with demo data
 */
export const createWebsiteWidgetsWithDemoData = () => {
  // Create user behavior data
  const userBehaviorData = [
    { metric: 'Time on Page', value: '2:34', change: '+12%' },
    { metric: 'Pages per Session', value: '3.2', change: '+8%' },
    { metric: 'Bounce Rate', value: '42%', change: '-3%' },
    { metric: 'Returning Visitors', value: '38%', change: '+5%' }
  ];

  // Create device breakdown data
  const deviceBreakdownData = [
    { device: 'Mobile', percentage: 58 },
    { device: 'Desktop', percentage: 32 },
    { device: 'Tablet', percentage: 8 },
    { device: 'Other', percentage: 2 }
  ];

  return createWebsiteWidgets(
    sitePerformanceData,
    topPagesData,
    userBehaviorData,
    deviceBreakdownData
  );
};

/**
 * Creates product widgets with demo data
 */
export const createProductWidgetsWithDemoData = () => {
  // Create product returns data
  const productReturnsData = [
    { category: 'Electronics', rate: '5.2%' },
    { category: 'Clothing', rate: '8.7%' },
    { category: 'Home & Kitchen', rate: '4.3%' },
    { category: 'Beauty', rate: '3.1%' },
    { category: 'Sports', rate: '2.8%' }
  ];

  return createProductWidgets(
    topProductsData,
    productInventoryData,
    productReturnsData
  );
};

/**
 * Creates performance widgets with demo data
 */
export const createPerformanceWidgetsWithDemoData = () => {
  // The data is already in the correct format from widget-data.ts
  return createPerformanceWidgets(
    performanceOverviewData,
    marketingRoiData,
    productPerformanceData
  );
};