// Export all components from the dashboard
export * from './app/components/dashboard';
export * from './app/components/cms';
export * from './app/components/crm';
export * from './app/components/orders';
export * from './app/components/products';
export * from './app/components/settings';

// Export UI components
export * from './app/components/ui/badge';
export * from './app/components/ui/button';
export * from './app/components/ui/calendar';
export * from './app/components/ui/card';
export * from './app/components/ui/checkbox';
export * from './app/components/ui/date-range-picker';
export * from './app/components/ui/dialog';
export * from './app/components/ui/dropdown-menu';
export * from './app/components/ui/input';
export * from './app/components/ui/label';
export * from './app/components/ui/popover';
export * from './app/components/ui/resizable';
export * from './app/components/ui/select';
export * from './app/components/ui/skeleton';
export * from './app/components/ui/switch';
export * from './app/components/ui/tabs';
export * from './app/components/ui/textarea';
export * from './app/components/ui/toast';
export * from './app/components/ui/toaster';
export * from './app/components/ui/use-toast';

// Export theme provider
export * from './app/components/theme-provider';

// Export utilities
export * from './app/lib/utils';

// Export types
import * as DashboardTypes from './app/types/dashboard';
export { DashboardTypes };

// Export configuration
export * from './config/cms.config';

// Export data config with renamed types to avoid conflicts
import {
  fetchRevenueData,
  fetchOrders,
  fetchOrderById
} from './config/data.config';

export {
  fetchRevenueData,
  fetchOrders,
  fetchOrderById
};