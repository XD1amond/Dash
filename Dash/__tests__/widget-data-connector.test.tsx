// Import the widget data connector
import {
  createAnalyticsWidgetsWithDemoData,
  createBusinessWidgetsWithDemoData,
  createCustomerWidgetsWithDemoData,
  createForecastWidgetsWithDemoData,
  createMarketingWidgetsWithDemoData,
  createWebsiteWidgetsWithDemoData,
  createProductWidgetsWithDemoData,
  createPerformanceWidgetsWithDemoData
} from '../../demo/utils/widget-data-connector';

// Note: All mocks are set up in jest.setup.mock.js

describe('Widget Data Connector', () => {
  it('creates analytics widgets with demo data', () => {
    const widgets = createAnalyticsWidgetsWithDemoData();
    expect(widgets).toBeDefined();
    expect(widgets.length).toBeGreaterThan(0);
    expect(widgets[0].id).toBeDefined();
    expect(widgets[0].component).toBeDefined();
    expect(widgets[0].category).toBe('Analytics');
  });

  it('creates business widgets with demo data', () => {
    const widgets = createBusinessWidgetsWithDemoData();
    expect(widgets).toBeDefined();
    expect(widgets.length).toBeGreaterThan(0);
    expect(widgets[0].id).toBeDefined();
    expect(widgets[0].component).toBeDefined();
    expect(widgets[0].category).toBe('Business');
  });

  it('creates customer widgets with demo data', () => {
    const widgets = createCustomerWidgetsWithDemoData();
    expect(widgets).toBeDefined();
    expect(widgets.length).toBeGreaterThan(0);
    expect(widgets[0].id).toBeDefined();
    expect(widgets[0].component).toBeDefined();
    expect(widgets[0].category).toBe('Customers');
  });

  it('creates forecast widgets with demo data', () => {
    const widgets = createForecastWidgetsWithDemoData();
    expect(widgets).toBeDefined();
    expect(widgets.length).toBeGreaterThan(0);
    expect(widgets[0].id).toBeDefined();
    expect(widgets[0].component).toBeDefined();
    expect(widgets[0].category).toBe('Forecast');
  });

  it('creates marketing widgets with demo data', () => {
    const widgets = createMarketingWidgetsWithDemoData();
    expect(widgets).toBeDefined();
    expect(widgets.length).toBeGreaterThan(0);
    expect(widgets[0].id).toBeDefined();
    expect(widgets[0].component).toBeDefined();
    expect(widgets[0].category).toBe('Marketing');
  });

  it('creates website widgets with demo data', () => {
    const widgets = createWebsiteWidgetsWithDemoData();
    expect(widgets).toBeDefined();
    expect(widgets.length).toBeGreaterThan(0);
    expect(widgets[0].id).toBeDefined();
    expect(widgets[0].component).toBeDefined();
    expect(widgets[0].category).toBe('Website');
  });

  it('creates product widgets with demo data', () => {
    const widgets = createProductWidgetsWithDemoData();
    expect(widgets).toBeDefined();
    expect(widgets.length).toBeGreaterThan(0);
    expect(widgets[0].id).toBeDefined();
    expect(widgets[0].component).toBeDefined();
    expect(widgets[0].category).toBe('Products');
  });

  it('creates performance widgets with demo data', () => {
    const widgets = createPerformanceWidgetsWithDemoData();
    expect(widgets).toBeDefined();
    expect(widgets.length).toBeGreaterThan(0);
    expect(widgets[0].id).toBeDefined();
    expect(widgets[0].component).toBeDefined();
    expect(widgets[0].category).toBe('Performance');
  });
});