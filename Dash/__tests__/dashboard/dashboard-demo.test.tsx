import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the UI components
jest.mock('../../app/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

jest.mock('../../app/components/ui/tabs', () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

jest.mock('../../app/components/ui/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) =>
    <button onClick={onClick}>{children}</button>
}));

jest.mock('../../app/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' ')
}));

// Mock the DashboardOverview component to avoid import issues
jest.mock('../../app/components/dashboard/dashboard-overview', () => ({
  DashboardOverview: () => <div data-testid="dashboard-overview">Dashboard Overview</div>
}));

// Mock the other components
jest.mock('../../app/components/cms/cms-dashboard', () => ({
  CMSDashboard: () => <div>CMS Dashboard</div>
}));

jest.mock('../../app/components/orders/order-management', () => ({
  OrderManagement: () => <div>Order Management</div>
}));

jest.mock('../../app/components/crm/customer-management', () => ({
  CustomerManagement: () => <div>Customer Management</div>
}));

jest.mock('../../app/components/products/product-management', () => ({
  ProductManagement: () => <div>Product Management</div>
}));

jest.mock('../../app/components/settings/system-config', () => ({
  SystemConfig: () => <div>System Config</div>
}));

// Mock the data services
jest.mock('../../config/data', () => ({
  createMockServices: jest.fn(() => ({
    analytics: {
      fetchRevenueData: jest.fn().mockResolvedValue({ data: [] }),
      fetchSalesByCategory: jest.fn().mockResolvedValue({ data: [] }),
      fetchVisitorsBySource: jest.fn().mockResolvedValue({ data: [] }),
      fetchConversionData: jest.fn().mockResolvedValue({ data: [] }),
      fetchStatCardData: jest.fn().mockResolvedValue([])
    }
  }))
}));

// Import the DashboardDemo component after all mocks are set up
import { DashboardDemo } from '../../../demo/implementation/DashboardDemo';

// Mock the widget data connector
jest.mock('../../../demo/utils/widget-data-connector', () => ({
  createAnalyticsWidgetsWithDemoData: jest.fn(() => [
    { id: 'sales-funnel', name: 'Sales Funnel', component: () => <div>Sales Funnel</div>, defaultSize: 'medium', category: 'Analytics', description: 'Sales Funnel' }
  ]),
  createBusinessWidgetsWithDemoData: jest.fn(() => [
    { id: 'revenue-growth', name: 'Revenue Growth', component: () => <div>Revenue Growth</div>, defaultSize: 'medium', category: 'Business', description: 'Revenue Growth' }
  ]),
  createCustomerWidgetsWithDemoData: jest.fn(() => [
    { id: 'customer-segments', name: 'Customer Segments', component: () => <div>Customer Segments</div>, defaultSize: 'medium', category: 'Customers', description: 'Customer Segments' }
  ]),
  createForecastWidgetsWithDemoData: jest.fn(() => [
    { id: 'revenue-forecast', name: 'Revenue Forecast', component: () => <div>Revenue Forecast</div>, defaultSize: 'large', category: 'Forecast', description: 'Revenue Forecast' }
  ])
}));

// Mock the widget data
jest.mock('../../../demo/data/widget-data', () => ({
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
  ]
}));

// Mock the analytics data generators
jest.mock('../../../demo/data/analytics-data', () => ({
  generateRevenueData: jest.fn(() => [{ name: 'Jan', revenue: 5000 }]),
  generateSalesData: jest.fn(() => [{ name: 'Electronics', value: 35, color: '#10b981' }]),
  generateVisitorsData: jest.fn(() => [{ name: 'Direct', value: 40, color: '#3b82f6' }]),
  generateConversionData: jest.fn(() => [{ name: 'Jan', conversion: 2.5 }]),
  generateStatCardData: jest.fn(() => [
    { title: 'Total Revenue', value: '$124,568.32', change: 12.5, changeType: 'increase' }
  ]),
  generateAllAnalyticsData: jest.fn()
}));

// Mock the mock data generators
jest.mock('../../../demo/data/mock-data', () => ({
  generateOrders: jest.fn(() => []),
  generateCustomers: jest.fn(() => []),
  generateCustomerSegments: jest.fn(() => []),
  generateProducts: jest.fn(() => []),
  generateProductCategories: jest.fn(() => []),
  generatePages: jest.fn(() => []),
  generateTemplates: jest.fn(() => []),
  generateMediaItems: jest.fn(() => []),
  generateSystemConfig: jest.fn(() => ({}))
}));

describe('DashboardDemo', () => {
  it('renders without crashing', () => {
    render(<DashboardDemo />);
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  });

  it('uses demo data for widgets', async () => {
    render(<DashboardDemo />);
    
    // Wait for data to load
    await screen.findByText('Analytics Dashboard');
    
    // Check if the component renders without errors
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });
});