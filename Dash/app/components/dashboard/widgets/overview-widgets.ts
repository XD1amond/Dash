import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { RevenueChart } from "../charts/revenue-chart"
import { SalesChart } from "../charts/sales-chart"
import { VisitorsChart } from "../charts/visitors-chart"
import { ConversionChart } from "../charts/conversion-chart"
import { WidgetDefinition, LayoutSection } from "../customizable-layout"
import { WidgetWrapper } from "./widget-components"
import {
  RevenueDataPoint,
  SalesDataPoint,
  VisitorsDataPoint,
  ConversionDataPoint
} from '../../../../config/data/types';
import { RestAdapter } from '../../../../config/data/adapters/rest.adapter';

// Create a REST adapter for API calls
const restAdapter = new RestAdapter({
  baseUrl: '/api',
  debug: process.env.NODE_ENV === 'development'
});

// Function to fetch revenue data
const fetchRevenueData = async (): Promise<RevenueDataPoint[]> => {
  try {
    // Get the date range (last 30 days)
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 30);
    
    const response = await restAdapter.fetchData<{data: RevenueDataPoint[]}>('analytics/revenue', {
      from: from.toISOString(),
      to: to.toISOString(),
      interval: 'month'
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return [];
  }
};

// Function to fetch sales data
const fetchSalesData = async (): Promise<SalesDataPoint[]> => {
  try {
    // Get the date range (last 30 days)
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 30);
    
    const response = await restAdapter.fetchData<{data: SalesDataPoint[]}>('analytics/sales', {
      from: from.toISOString(),
      to: to.toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    return [];
  }
};

// Function to fetch visitors data
const fetchVisitorsData = async (): Promise<VisitorsDataPoint[]> => {
  try {
    // Get the date range (last 30 days)
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 30);
    
    const response = await restAdapter.fetchData<{data: VisitorsDataPoint[]}>('analytics/visitors', {
      from: from.toISOString(),
      to: to.toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching visitors data:', error);
    return [];
  }
};

// Function to fetch conversion data
const fetchConversionData = async (): Promise<ConversionDataPoint[]> => {
  try {
    // Get the date range (last 30 days)
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 30);
    
    const response = await restAdapter.fetchData<{data: ConversionDataPoint[]}>('analytics/conversion', {
      from: from.toISOString(),
      to: to.toISOString(),
      interval: 'month'
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching conversion data:', error);
    return [];
  }
};

// Create functional components for each chart type
interface RevenueChartWidgetProps {
  data: RevenueDataPoint[];
}

// Function to transform RevenueDataPoint to RevenueData
const transformRevenueData = (data: RevenueDataPoint[]): { name: string; revenue: number }[] => {
  return data.map(item => ({
    name: item.date,
    revenue: item.revenue
  }));
};

// Function to transform SalesDataPoint to SalesData
const transformSalesData = (data: SalesDataPoint[]): { name: string; value: number; color: string }[] => {
  return data.map((item, index) => ({
    name: item.name,
    value: item.value,
    color: item.color || getDefaultColor(index)
  }));
};

// Function to transform VisitorsDataPoint to VisitorsData
const transformVisitorsData = (data: VisitorsDataPoint[]): { name: string; value: number; color: string }[] => {
  return data.map((item, index) => ({
    name: item.name,
    value: item.value,
    color: item.color || getDefaultColor(index)
  }));
};

// Function to transform ConversionDataPoint to ConversionData
const transformConversionData = (data: ConversionDataPoint[]): { name: string; conversion: number }[] => {
  return data.map(item => ({
    name: item.date,
    conversion: item.conversion
  }));
};

// Helper function to get default colors
const getDefaultColor = (index: number): string => {
  const colors = [
    '#10b981', '#3b82f6', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
  ];
  return colors[index % colors.length];
};

const RevenueChartWidget = ({ data }: RevenueChartWidgetProps) => {
  // Transform the data to the format expected by RevenueChart
  const transformedData = transformRevenueData(data);
  
  return React.createElement(
    WidgetWrapper,
    {
      title: "Revenue",
      description: "Revenue trends over the selected period",
      chartId: "revenue-chart-expanded",
      data: data,
      relatedWidgets: [],
      children: React.createElement(
        'div',
        { className: "h-[300px]" },
        React.createElement(RevenueChart, { data: transformedData })
      )
    }
  );
};

interface SalesChartWidgetProps {
  data: SalesDataPoint[];
}

const SalesChartWidget = ({ data }: SalesChartWidgetProps) => {
  // Transform the data to the format expected by SalesChart
  const transformedData = transformSalesData(data);
  
  return React.createElement(
    WidgetWrapper,
    {
      title: "Sales",
      description: "Sales distribution by category",
      chartId: "sales-chart-expanded",
      data: data,
      relatedWidgets: [],
      children: React.createElement(
        'div',
        { className: "h-[300px]" },
        React.createElement(SalesChart, { data: transformedData })
      )
    }
  );
};

interface VisitorsChartWidgetProps {
  data: VisitorsDataPoint[];
}

const VisitorsChartWidget = ({ data }: VisitorsChartWidgetProps) => {
  // Transform the data to the format expected by VisitorsChart
  const transformedData = transformVisitorsData(data);
  
  return React.createElement(
    WidgetWrapper,
    {
      title: "Visitors",
      description: "Website traffic sources",
      chartId: "visitors-chart-expanded",
      data: data,
      relatedWidgets: [],
      children: React.createElement(
        'div',
        { className: "h-[300px]" },
        React.createElement(VisitorsChart, { data: transformedData })
      )
    }
  );
};

interface ConversionChartWidgetProps {
  data: ConversionDataPoint[];
}

const ConversionChartWidget = ({ data }: ConversionChartWidgetProps) => {
  // Transform the data to the format expected by ConversionChart
  const transformedData = transformConversionData(data);
  
  return React.createElement(
    WidgetWrapper,
    {
      title: "Conversion Rate",
      description: "Conversion rate over time",
      chartId: "conversion-chart-expanded",
      data: data,
      relatedWidgets: [],
      children: React.createElement(
        'div',
        { className: "h-[300px]" },
        React.createElement(ConversionChart, { data: transformedData })
      )
    }
  );
};

// Function to create overview widgets, accepting necessary data props
export function createOverviewWidgets(
  revenueData: RevenueDataPoint[] = [],
  salesData: SalesDataPoint[] = [],
  visitorsData: VisitorsDataPoint[] = [],
  conversionData: ConversionDataPoint[] = []
): WidgetDefinition[] {
  return [
    {
      id: "revenue-chart",
      name: "Revenue Trends",
      description: "Revenue trends over the selected period",
      category: "Overview",
      component: React.createElement(RevenueChartWidget, { data: revenueData }),
      defaultSize: "large"
    },
    {
      id: "sales-chart",
      name: "Sales Distribution",
      description: "Sales distribution by category",
      category: "Overview",
      component: React.createElement(SalesChartWidget, { data: salesData }),
      defaultSize: "medium"
    },
    {
      id: "visitors-chart",
      name: "Visitors",
      description: "Website traffic sources",
      category: "Overview",
      component: React.createElement(VisitorsChartWidget, { data: visitorsData }),
      defaultSize: "medium"
    },
    {
      id: "conversion-chart",
      name: "Conversion Rate",
      description: "Conversion rate over time",
      category: "Overview",
      component: React.createElement(ConversionChartWidget, { data: conversionData }),
      defaultSize: "large"
    }
  ];
}

// Define default layout for overview widgets
export const defaultOverviewLayout: LayoutSection[] = [
  {
    id: "overview-metrics",
    title: "Overview Metrics",
    widgets: ["revenue-chart", "sales-chart", "visitors-chart", "conversion-chart"]
  }
];