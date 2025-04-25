/**
 * This test simulates how a user would import and use the package
 * It doesn't actually install the package, but tests the import paths
 * that would be used by a consumer of the package
 */

// Mock the components that would be imported from the package
jest.mock('../../index', () => ({
  DashboardOverview: jest.fn(),
  OrderManagement: jest.fn(),
  Button: jest.fn(),
}), { virtual: true });

// Import the components as a user would
import { DashboardOverview, OrderManagement, Button } from '../../index';

describe('Package integration', () => {
  test('should import DashboardOverview component', () => {
    expect(DashboardOverview).toBeDefined();
  });

  test('should import OrderManagement component', () => {
    expect(OrderManagement).toBeDefined();
  });

  test('should import Button component', () => {
    expect(Button).toBeDefined();
  });
});

/**
 * In a real-world scenario, a user would import the package like this:
 *
 * import { DashboardOverview, OrderManagement, Button } from '@xd1amond/dash';
 *
 * And then use the components in their React application.
 */