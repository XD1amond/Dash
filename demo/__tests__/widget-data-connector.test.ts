import {
  createAnalyticsWidgetsWithDemoData,
  createBusinessWidgetsWithDemoData,
  createCustomerWidgetsWithDemoData,
  createForecastWidgetsWithDemoData
} from '../utils/widget-data-connector';

describe('Widget Data Connector', () => {
  it('should create analytics widgets with demo data', () => {
    const widgets = createAnalyticsWidgetsWithDemoData();
    expect(widgets).toBeDefined();
    expect(widgets.length).toBeGreaterThan(0);
    expect(widgets[0].id).toBeDefined();
    expect(widgets[0].component).toBeDefined();
  });

  it('should create business widgets with demo data', () => {
    const widgets = createBusinessWidgetsWithDemoData();
    expect(widgets).toBeDefined();
    expect(widgets.length).toBeGreaterThan(0);
    expect(widgets[0].id).toBeDefined();
    expect(widgets[0].component).toBeDefined();
  });

  it('should create customer widgets with demo data', () => {
    const widgets = createCustomerWidgetsWithDemoData();
    expect(widgets).toBeDefined();
    expect(widgets.length).toBeGreaterThan(0);
    expect(widgets[0].id).toBeDefined();
    expect(widgets[0].component).toBeDefined();
  });

  it('should create forecast widgets with demo data', () => {
    const widgets = createForecastWidgetsWithDemoData();
    expect(widgets).toBeDefined();
    expect(widgets.length).toBeGreaterThan(0);
    expect(widgets[0].id).toBeDefined();
    expect(widgets[0].component).toBeDefined();
  });
});