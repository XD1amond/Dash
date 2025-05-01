// Widget data for all dashboard widgets

// Analytics Widgets Data
export const salesFunnelData = [
  { stage: 'Visits', count: 24500, percentage: 100 },
  { stage: 'Product Views', count: 18300, percentage: 74.7 },
  { stage: 'Add to Cart', count: 7350, percentage: 30.0 },
  { stage: 'Checkout', count: 4900, percentage: 20.0 },
  { stage: 'Purchase', count: 3675, percentage: 15.0 }
];

export const cohortAnalysisData = [
  { cohort: 'Jan 2023', 'Month 0': '100%', 'Month 1': '64%', 'Month 2': '48%', 'Month 3': '42%', 'Month 4': '38%', 'Month 5': '35%' },
  { cohort: 'Feb 2023', 'Month 0': '100%', 'Month 1': '68%', 'Month 2': '52%', 'Month 3': '45%', 'Month 4': '41%', 'Month 5': '' },
  { cohort: 'Mar 2023', 'Month 0': '100%', 'Month 1': '72%', 'Month 2': '56%', 'Month 3': '48%', 'Month 4': '', 'Month 5': '' },
  { cohort: 'Apr 2023', 'Month 0': '100%', 'Month 1': '75%', 'Month 2': '58%', 'Month 3': '', 'Month 4': '', 'Month 5': '' },
  { cohort: 'May 2023', 'Month 0': '100%', 'Month 1': '78%', 'Month 2': '', 'Month 3': '', 'Month 4': '', 'Month 5': '' },
  { cohort: 'Jun 2023', 'Month 0': '100%', 'Month 1': '', 'Month 2': '', 'Month 3': '', 'Month 4': '', 'Month 5': '' }
];

export const abTestingData = [
  { test: 'Homepage Redesign', variant: 'A (Control)', metric: 'Conversion', value: '2.8%', change: '' },
  { test: 'Homepage Redesign', variant: 'B (Test)', metric: 'Conversion', value: '3.15%', change: '+12.4%' },
  { test: 'Checkout Flow', variant: 'A (Control)', metric: 'Completion', value: '62.4%', change: '' },
  { test: 'Checkout Flow', variant: 'B (Test)', metric: 'Completion', value: '67.8%', change: '+8.7%' },
  { test: 'Product Page CTA', variant: 'A (Control)', metric: 'Click Rate', value: '14.2%', change: '' },
  { test: 'Product Page CTA', variant: 'B (Test)', metric: 'Click Rate', value: '13.9%', change: '-2.1%' }
];

// Performance Widgets Data
export const performanceOverviewData = [
  { metric: 'Avg. Order Value', value: '$86.42', change: '+4.3%', direction: 'up' },
  { metric: 'Conversion Rate', value: '3.2%', change: '+0.4%', direction: 'up' },
  { metric: 'Cart Abandonment', value: '68.7%', change: '+1.2%', direction: 'down' },
  { metric: 'Return Rate', value: '4.8%', change: '-0.3%', direction: 'up' }
];

export const marketingRoiData = [
  { channel: 'Paid Search', roi: '342%', percentage: 85 },
  { channel: 'Social Media', roi: '285%', percentage: 72 },
  { channel: 'Email Marketing', roi: '420%', percentage: 92 },
  { channel: 'Affiliate', roi: '178%', percentage: 45 },
  { channel: 'Display Ads', roi: '124%', percentage: 32 }
];

export const productPerformanceData = [
  { category: 'Electronics', revenue: '$245,678', units: '1,245', profit: '$78,617', margin: '32%' },
  { category: 'Clothing', revenue: '$187,432', units: '3,876', profit: '$89,967', margin: '48%' },
  { category: 'Home & Kitchen', revenue: '$143,765', units: '2,154', profit: '$38,816', margin: '27%' },
  { category: 'Beauty', revenue: '$98,432', units: '4,321', profit: '$42,326', margin: '43%' },
  { category: 'Sports', revenue: '$76,543', units: '1,876', profit: '$24,493', margin: '32%' }
];

// Business Widgets Data
export const revenueByChannelData = [
  { channel: 'Direct', revenue: '$345,678', percentage: 42 },
  { channel: 'Organic Search', revenue: '$234,567', percentage: 28 },
  { channel: 'Paid Search', revenue: '$98,765', percentage: 12 },
  { channel: 'Social', revenue: '$76,543', percentage: 9 },
  { channel: 'Email', revenue: '$54,321', percentage: 7 },
  { channel: 'Referral', revenue: '$23,456', percentage: 3 }
];

export const customerLifetimeValueData = [
  { segment: 'VIP', value: '$1,245', orders: '12.3', retention: '87%' },
  { segment: 'Loyal', value: '$876', orders: '8.7', retention: '72%' },
  { segment: 'Regular', value: '$432', orders: '4.2', retention: '58%' },
  { segment: 'New', value: '$187', orders: '1.4', retention: '34%' },
  { segment: 'At Risk', value: '$321', orders: '3.1', retention: '22%' }
];

// Website Widgets Data
export const topPagesData = [
  { page: 'Homepage', visits: '45,678', bounceRate: '32%', convRate: '3.2%' },
  { page: 'Product Category: Electronics', visits: '34,567', bounceRate: '28%', convRate: '4.5%' },
  { page: 'Product: Smartphone X', visits: '23,456', bounceRate: '24%', convRate: '5.7%' },
  { page: 'Shopping Cart', visits: '12,345', bounceRate: '42%', convRate: '21.3%' },
  { page: 'Checkout', visits: '8,765', bounceRate: '38%', convRate: '64.2%' }
];

export const sitePerformanceData = [
  { metric: 'Page Load Time', value: '1.8s', benchmark: '2.5s', status: 'good' },
  { metric: 'Time to Interactive', value: '2.3s', benchmark: '3.2s', status: 'good' },
  { metric: 'First Contentful Paint', value: '0.9s', benchmark: '1.2s', status: 'good' },
  { metric: 'Cumulative Layout Shift', value: '0.12', benchmark: '0.1', status: 'warning' },
  { metric: 'Server Response Time', value: '210ms', benchmark: '200ms', status: 'warning' }
];

// Marketing Widgets Data
export const campaignPerformanceData = [
  { campaign: 'Summer Sale', spend: '$12,500', revenue: '$78,500', roi: '528%', status: 'active' },
  { campaign: 'New Product Launch', spend: '$8,700', revenue: '$45,300', roi: '421%', status: 'active' },
  { campaign: 'Holiday Special', spend: '$15,200', revenue: '$67,800', roi: '346%', status: 'scheduled' },
  { campaign: 'Loyalty Program', spend: '$5,400', revenue: '$23,600', roi: '337%', status: 'active' },
  { campaign: 'Retargeting', spend: '$3,200', revenue: '$12,800', roi: '300%', status: 'active' }
];

export const socialMediaPerformanceData = [
  { platform: 'Instagram', followers: '24.5K', engagement: '3.2%', clicks: '4,567', conversions: '234' },
  { platform: 'Facebook', followers: '18.7K', engagement: '1.8%', clicks: '3,456', conversions: '187' },
  { platform: 'Twitter', followers: '12.3K', engagement: '1.2%', clicks: '2,345', conversions: '98' },
  { platform: 'LinkedIn', followers: '8.9K', engagement: '2.4%', clicks: '1,234', conversions: '76' },
  { platform: 'TikTok', followers: '15.6K', engagement: '4.5%', clicks: '5,678', conversions: '321' }
];

// Customer Widgets Data
export const customerSegmentationData = [
  { segment: 'New Customers', count: '1,234', percentage: 28, value: '$98,765' },
  { segment: 'Returning', count: '876', percentage: 20, value: '$123,456' },
  { segment: 'Loyal', count: '543', percentage: 12, value: '$234,567' },
  { segment: 'VIP', count: '123', percentage: 3, value: '$345,678' },
  { segment: 'At Risk', count: '876', percentage: 20, value: '$76,543' },
  { segment: 'Inactive', count: '765', percentage: 17, value: '$54,321' }
];

export const customerFeedbackData = [
  { category: 'Product Quality', positive: 87, neutral: 8, negative: 5 },
  { category: 'Customer Service', positive: 76, neutral: 12, negative: 12 },
  { category: 'Shipping Speed', positive: 65, neutral: 18, negative: 17 },
  { category: 'Website Experience', positive: 82, neutral: 10, negative: 8 },
  { category: 'Price Value', positive: 72, neutral: 15, negative: 13 }
];

// Product Widgets Data
export const productInventoryData = [
  { category: 'Electronics', inStock: 234, lowStock: 45, outOfStock: 12 },
  { category: 'Clothing', inStock: 567, lowStock: 78, outOfStock: 23 },
  { category: 'Home & Kitchen', inStock: 345, lowStock: 56, outOfStock: 18 },
  { category: 'Beauty', inStock: 432, lowStock: 34, outOfStock: 8 },
  { category: 'Sports', inStock: 321, lowStock: 43, outOfStock: 15 }
];

export const topProductsData = [
  { product: 'Smartphone X', sales: '$123,456', units: '1,234', profit: '$45,678' },
  { product: 'Wireless Earbuds', sales: '$98,765', units: '2,345', profit: '$34,567' },
  { product: 'Smart Watch', sales: '$87,654', units: '987', profit: '$32,456' },
  { product: 'Laptop Pro', sales: '$234,567', units: '876', profit: '$76,543' },
  { product: 'Bluetooth Speaker', sales: '$76,543', units: '1,543', profit: '$23,456' }
];

// Forecast Widgets Data
export const salesForecastData = [
  { month: 'Jan', actual: 245000, forecast: 245000 },
  { month: 'Feb', actual: 267000, forecast: 260000 },
  { month: 'Mar', actual: 278000, forecast: 275000 },
  { month: 'Apr', actual: 284000, forecast: 290000 },
  { month: 'May', actual: 298000, forecast: 305000 },
  { month: 'Jun', actual: 312000, forecast: 320000 },
  { month: 'Jul', actual: null, forecast: 335000 },
  { month: 'Aug', actual: null, forecast: 350000 },
  { month: 'Sep', actual: null, forecast: 365000 },
  { month: 'Oct', actual: null, forecast: 380000 },
  { month: 'Nov', actual: null, forecast: 395000 },
  { month: 'Dec', actual: null, forecast: 410000 }
];

export const inventoryForecastData = [
  { product: 'Smartphone X', currentStock: 234, projectedDemand: 345, reorderPoint: 100, reorderQty: 200 },
  { product: 'Wireless Earbuds', currentStock: 567, projectedDemand: 678, reorderPoint: 150, reorderQty: 300 },
  { product: 'Smart Watch', currentStock: 123, projectedDemand: 234, reorderPoint: 50, reorderQty: 100 },
  { product: 'Laptop Pro', currentStock: 78, projectedDemand: 156, reorderPoint: 30, reorderQty: 60 },
  { product: 'Bluetooth Speaker', currentStock: 345, projectedDemand: 432, reorderPoint: 100, reorderQty: 200 }
];