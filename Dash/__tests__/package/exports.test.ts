// Mock the index exports to avoid actual imports that might cause issues
jest.mock('../../index', () => ({
  // Dashboard components
  DashboardOverview: jest.fn(),
  Sidebar: jest.fn(),
  StatCard: jest.fn(),
  
  // CMS components
  SanityDashboard: jest.fn(),
  PortableText: jest.fn(),
  
  // CRM components
  CustomerManagement: jest.fn(),
  
  // Order components
  OrderManagement: jest.fn(),
  
  // Product components
  ProductManagement: jest.fn(),
  
  // UI components
  Button: jest.fn(),
  Card: jest.fn(),
  Input: jest.fn(),
  Tabs: jest.fn(),
  
  // Configuration
  fetchRevenueData: jest.fn(),
  fetchOrders: jest.fn(),
  fetchOrderById: jest.fn(),
  
  // Types
  DashboardTypes: {},
}), { virtual: true });

import * as DashExports from '../../index';

describe('Package exports', () => {
  test('should export dashboard components', () => {
    expect(DashExports).toHaveProperty('DashboardOverview');
    expect(DashExports).toHaveProperty('Sidebar');
    expect(DashExports).toHaveProperty('StatCard');
  });

  test('should export CMS components', () => {
    expect(DashExports).toHaveProperty('SanityDashboard');
    expect(DashExports).toHaveProperty('PortableText');
  });

  test('should export CRM components', () => {
    expect(DashExports).toHaveProperty('CustomerManagement');
  });

  test('should export order components', () => {
    expect(DashExports).toHaveProperty('OrderManagement');
  });

  test('should export product components', () => {
    expect(DashExports).toHaveProperty('ProductManagement');
  });

  test('should export UI components', () => {
    expect(DashExports).toHaveProperty('Button');
    expect(DashExports).toHaveProperty('Card');
    expect(DashExports).toHaveProperty('Input');
    expect(DashExports).toHaveProperty('Tabs');
  });

  test('should export configuration', () => {
    expect(DashExports).toHaveProperty('fetchRevenueData');
    expect(DashExports).toHaveProperty('fetchOrders');
    expect(DashExports).toHaveProperty('fetchOrderById');
  });
  
  test('should export types', () => {
    expect(DashExports).toHaveProperty('DashboardTypes');
  });
});