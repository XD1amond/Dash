// Mock UI components
jest.mock('./app/components/ui/card', () => ({}), { virtual: true });
jest.mock('./app/components/ui/button', () => ({}), { virtual: true });
jest.mock('./app/lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' ')
}), { virtual: true });

// Mock widget components
jest.mock('./app/components/dashboard/widgets/widget-components', () => ({
  WidgetWrapper: ({ children }) => children
}), { virtual: true });

// Mock widget creation functions
jest.mock('./app/components/dashboard/widgets/analytics-widgets', () => ({
  createAnalyticsWidgets: jest.fn(() => [
    { id: 'sales-funnel', name: 'Sales Funnel', component: jest.fn(), defaultSize: 'medium', category: 'Analytics', description: 'Sales Funnel' }
  ])
}), { virtual: true });

jest.mock('./app/components/dashboard/widgets/business-widgets', () => ({
  createBusinessWidgets: jest.fn(() => [
    { id: 'revenue-growth', name: 'Revenue Growth', component: jest.fn(), defaultSize: 'medium', category: 'Business', description: 'Revenue Growth' }
  ])
}), { virtual: true });

jest.mock('./app/components/dashboard/widgets/customer-widgets', () => ({
  createCustomerWidgets: jest.fn(() => [
    { id: 'customer-segments', name: 'Customer Segments', component: jest.fn(), defaultSize: 'medium', category: 'Customers', description: 'Customer Segments' }
  ])
}), { virtual: true });

jest.mock('./app/components/dashboard/widgets/forecast-widgets', () => ({
  createForecastWidgets: jest.fn(() => [
    { id: 'revenue-forecast', name: 'Revenue Forecast', component: jest.fn(), defaultSize: 'large', category: 'Forecast', description: 'Revenue Forecast' }
  ])
}), { virtual: true });

jest.mock('./app/components/dashboard/widgets/marketing-widgets', () => ({
  createMarketingWidgets: jest.fn(() => [
    { id: 'campaign-performance', name: 'Campaign Performance', component: jest.fn(), defaultSize: 'large', category: 'Marketing', description: 'Campaign Performance' }
  ])
}), { virtual: true });

jest.mock('./app/components/dashboard/widgets/website-widgets', () => ({
  createWebsiteWidgets: jest.fn(() => [
    { id: 'page-performance', name: 'Page Performance', component: jest.fn(), defaultSize: 'large', category: 'Website', description: 'Page Performance' }
  ])
}), { virtual: true });

jest.mock('./app/components/dashboard/widgets/product-widgets', () => ({
  createProductWidgets: jest.fn(() => [
    { id: 'top-products', name: 'Top Products', component: jest.fn(), defaultSize: 'medium', category: 'Products', description: 'Top Products' }
  ])
}), { virtual: true });

jest.mock('./app/components/dashboard/widgets/performance-widgets', () => ({
  createPerformanceWidgets: jest.fn(() => [
    { id: 'performance-overview', name: 'Performance Overview', component: jest.fn(), defaultSize: 'large', category: 'Performance', description: 'Performance Overview' }
  ])
}), { virtual: true });

// Mock widget data
jest.mock('../demo/data/widget-data', () => ({
  salesFunnelData: [
    { stage: 'Visits', count: 24500, percentage: 100 }
  ],
  cohortAnalysisData: [
    { cohort: 'Jan 2023', 'Month 0': '100%', 'Month 1': '64%' }
  ],
  abTestingData: [
    { test: 'Homepage Redesign', variant: 'A (Control)', metric: 'Conversion', value: '2.8%', change: '' }
  ],
  customerSegmentationData: [
    { segment: 'New Customers', count: '1,234', percentage: 28, value: '$98,765' }
  ],
  customerFeedbackData: [
    { category: 'Product Quality', positive: 87, neutral: 8, negative: 5 }
  ],
  revenueByChannelData: [
    { channel: 'Direct', revenue: '$345,678', percentage: 42 }
  ],
  customerLifetimeValueData: [
    { segment: 'VIP', value: '$1,245', orders: '12.3', retention: '87%' }
  ],
  salesForecastData: [
    { month: 'Jan', actual: 245000, forecast: 245000 }
  ],
  inventoryForecastData: [
    { product: 'Smartphone X', currentStock: 234, projectedDemand: 345, reorderPoint: 100, reorderQty: 200 }
  ],
  campaignPerformanceData: [
    { campaign: 'Summer Sale', spend: '$12,500', revenue: '$78,500', roi: '528%', status: 'active' }
  ],
  socialMediaPerformanceData: [
    { platform: 'Instagram', followers: '24.5K', engagement: '3.2%', clicks: '4,567', conversions: '234' }
  ],
  sitePerformanceData: [
    { metric: 'Page Load Time', value: '1.8s', benchmark: '2.5s', status: 'good' }
  ],
  topPagesData: [
    { page: 'Homepage', visits: '45,678', bounceRate: '32%', convRate: '3.2%' }
  ],
  topProductsData: [
    { product: 'Smartphone X', sales: '$123,456', units: '1,234', profit: '$45,678' }
  ],
  productInventoryData: [
    { category: 'Electronics', inStock: 234, lowStock: 45, outOfStock: 12 }
  ]
}), { virtual: true });