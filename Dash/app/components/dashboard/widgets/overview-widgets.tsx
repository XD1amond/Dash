"use client"

import React, { useState, useEffect } from 'react';
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
    
    return response.data || [];
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
    
    return response.data || [];
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
    
    return response.data || [];
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
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching conversion data:', error);
    return [];
  }
};

// Create functional components for each chart type
interface RevenueChartWidgetProps {
  data: RevenueDataPoint[];
}

const RevenueChartWidget: React.FC<RevenueChartWidgetProps> = ({ data = [] }) => {
  // Use the data directly without fetching
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>(data);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Update data when props change
  useEffect(() => {
    setRevenueData(data);
  }, [data]);

  return (
    <WidgetWrapper
      title="Revenue"
      description="Revenue trends over the selected period"
      chartId="revenue-chart-expanded"
      data={revenueData}
      relatedWidgets={[]}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          Loading revenue data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[300px] text-red-500">
          {error}
        </div>
      ) : revenueData.length === 0 ? (
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          No revenue data available
        </div>
      ) : (
        <div className="h-[300px]">
          <RevenueChart data={revenueData} />
        </div>
      )}
    </WidgetWrapper>
  );
};

interface SalesChartWidgetProps {
  data: SalesDataPoint[];
}

const SalesChartWidget: React.FC<SalesChartWidgetProps> = ({ data = [] }) => {
  // Use the data directly without fetching
  const [salesData, setSalesData] = useState<SalesDataPoint[]>(data);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Update data when props change
  useEffect(() => {
    setSalesData(data);
  }, [data]);

  return (
    <WidgetWrapper
      title="Sales"
      description="Sales distribution by category"
      chartId="sales-chart-expanded"
      data={salesData}
      relatedWidgets={[]}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          Loading sales data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[300px] text-red-500">
          {error}
        </div>
      ) : salesData.length === 0 ? (
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          No sales data available
        </div>
      ) : (
        <div className="h-[300px]">
          <SalesChart data={salesData} />
        </div>
      )}
    </WidgetWrapper>
  );
};

interface VisitorsChartWidgetProps {
  data: VisitorsDataPoint[];
}

const VisitorsChartWidget: React.FC<VisitorsChartWidgetProps> = ({ data = [] }) => {
  // Use the data directly without fetching
  const [visitorsData, setVisitorsData] = useState<VisitorsDataPoint[]>(data);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Update data when props change
  useEffect(() => {
    setVisitorsData(data);
  }, [data]);

  return (
    <WidgetWrapper
      title="Visitors"
      description="Website traffic sources"
      chartId="visitors-chart-expanded"
      data={visitorsData}
      relatedWidgets={[]}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          Loading visitors data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[300px] text-red-500">
          {error}
        </div>
      ) : visitorsData.length === 0 ? (
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          No visitors data available
        </div>
      ) : (
        <div className="h-[300px]">
          <VisitorsChart data={visitorsData} />
        </div>
      )}
    </WidgetWrapper>
  );
};

interface ConversionChartWidgetProps {
  data: ConversionDataPoint[];
}

const ConversionChartWidget: React.FC<ConversionChartWidgetProps> = ({ data = [] }) => {
  // Use the data directly without fetching
  const [conversionData, setConversionData] = useState<ConversionDataPoint[]>(data);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Update data when props change
  useEffect(() => {
    setConversionData(data);
  }, [data]);

  return (
    <WidgetWrapper
      title="Conversion Rate"
      description="Conversion rate over time"
      chartId="conversion-chart-expanded"
      data={conversionData}
      relatedWidgets={[]}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          Loading conversion data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[300px] text-red-500">
          {error}
        </div>
      ) : conversionData.length === 0 ? (
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          No conversion data available
        </div>
      ) : (
        <div className="h-[300px]">
          <ConversionChart data={conversionData} />
        </div>
      )}
    </WidgetWrapper>
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
      component: <RevenueChartWidget data={revenueData} />,
      defaultSize: "large"
    },
    {
      id: "sales-chart",
      name: "Sales Distribution",
      description: "Sales distribution by category",
      category: "Overview",
      component: <SalesChartWidget data={salesData} />,
      defaultSize: "medium"
    },
    {
      id: "visitors-chart",
      name: "Visitors",
      description: "Website traffic sources",
      category: "Overview",
      component: <VisitorsChartWidget data={visitorsData} />,
      defaultSize: "medium"
    },
    {
      id: "conversion-chart",
      name: "Conversion Rate",
      description: "Conversion rate over time",
      category: "Overview",
      component: <ConversionChartWidget data={conversionData} />,
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