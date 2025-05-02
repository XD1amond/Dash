"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetDefinition, LayoutSection } from "@/components/dashboard/customizable-layout";
import { WidgetWrapper } from "./widget-components";
import {
  RevenueByChannelItem,
  CustomerLifetimeValueItem,
  BusinessPerformanceMetric
} from '@/config/data/types';
import { RestAdapter } from '@/config/data/adapters/rest.adapter';

// Create a REST adapter for API calls
const restAdapter = new RestAdapter({
  baseUrl: '/api',
  debug: process.env.NODE_ENV === 'development'
});

// Function to fetch revenue by channel data
const fetchRevenueByChannel = async (): Promise<RevenueByChannelItem[]> => {
  try {
    const response = await restAdapter.fetchData<{data: RevenueByChannelItem[]}>('business/revenue-by-channel');
    return response.data;
  } catch (error) {
    console.error('Error fetching revenue by channel data:', error);
    return [];
  }
};

// Function to fetch customer lifetime value data
const fetchCustomerLifetimeValue = async (): Promise<CustomerLifetimeValueItem[]> => {
  try {
    const response = await restAdapter.fetchData<{data: CustomerLifetimeValueItem[]}>('business/customer-lifetime-value');
    return response.data;
  } catch (error) {
    console.error('Error fetching customer lifetime value data:', error);
    return [];
  }
};

// Function to fetch revenue growth data
const fetchRevenueGrowth = async (): Promise<{growthPercentage: string, comparisonPeriod: string}> => {
  try {
    const response = await restAdapter.fetchData<{
      data: {
        growthPercentage: string,
        comparisonPeriod: string
      }
    }>('business/revenue-growth');
    return response.data;
  } catch (error) {
    console.error('Error fetching revenue growth data:', error);
    return {
      growthPercentage: "+0.0%",
      comparisonPeriod: "Compared to last year"
    };
  }
};

// Function to fetch customer acquisition data
const fetchCustomerAcquisition = async (): Promise<{cac: string, change: string, period: string}> => {
  try {
    const response = await restAdapter.fetchData<{
      data: {
        cac: string,
        change: string,
        period: string
      }
    }>('business/customer-acquisition');
    return response.data;
  } catch (error) {
    console.error('Error fetching customer acquisition data:', error);
    return {
      cac: "$0.00",
      change: "0%",
      period: "from last quarter"
    };
  }
};

// Get related widgets for a given widget
const getRelatedWidgets = (widgetId: string) => {
  const otherWidgets = businessWidgets.filter(w => w.id !== widgetId);
  return otherWidgets.slice(0, 2); // Return up to 2 related widgets
};

// Revenue Growth Widget Component
interface RevenueGrowthProps {
  growthPercentage?: string;
  comparisonPeriod?: string;
}

const RevenueGrowthWidget: React.FC<RevenueGrowthProps> = ({
  growthPercentage,
  comparisonPeriod
}) => {
  const [growthData, setGrowthData] = useState<{
    growthPercentage: string,
    comparisonPeriod: string
  }>({
    growthPercentage: growthPercentage || "+0.0%",
    comparisonPeriod: comparisonPeriod || "Compared to last year"
  });
  const [loading, setLoading] = useState<boolean>(!growthPercentage);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!growthPercentage) {
        setLoading(true);
        try {
          const fetchedData = await fetchRevenueGrowth();
          setGrowthData(fetchedData);
          setError(null);
        } catch (err) {
          setError('Failed to load revenue growth data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [growthPercentage, comparisonPeriod]);

  // Determine if growth is positive or negative
  const isPositive = !growthData.growthPercentage.startsWith('-');

  return (
    <WidgetWrapper
      title="Revenue Growth"
      description="Year-over-year revenue growth"
      chartId="revenue-growth-chart"
      data={[{ metric: "Revenue Growth", value: growthData.growthPercentage, period: "YoY" }]}
      relatedWidgets={getRelatedWidgets("revenue-growth")}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Loading revenue growth data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[200px]">
          <div className={`text-4xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {growthData.growthPercentage}
          </div>
          <div className="text-sm text-muted-foreground mt-2">{growthData.comparisonPeriod}</div>
        </div>
      )}
    </WidgetWrapper>
  );
};

// Revenue by Channel Widget Component
interface RevenueByChannelProps {
  data?: RevenueByChannelItem[];
}

const RevenueByChannelWidget: React.FC<RevenueByChannelProps> = ({ data = [] }) => {
  const [channelData, setChannelData] = useState<RevenueByChannelItem[]>(data);
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (data.length === 0) {
        setLoading(true);
        try {
          const fetchedData = await fetchRevenueByChannel();
          setChannelData(fetchedData);
          setError(null);
        } catch (err) {
          setError('Failed to load revenue by channel data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [data]);

  // Define channel colors based on index
  const getChannelColor = (index: number): string => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500', 'bg-red-500', 'bg-indigo-500'];
    return colors[index % colors.length];
  };

  return (
    <WidgetWrapper
      title="Revenue by Channel"
      description="Revenue breakdown by sales channel"
      chartId="revenue-by-channel-chart"
      data={channelData}
      relatedWidgets={getRelatedWidgets("revenue-by-channel")}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Loading revenue by channel data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </div>
      ) : channelData.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          No channel data available
        </div>
      ) : (
        <div className="space-y-4 h-[200px] overflow-y-auto">
          {channelData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{item.channel}</span>
                <span className="font-medium">{item.revenue}</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className={`h-full ${getChannelColor(index)} rounded-full`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </WidgetWrapper>
  );
};

// Customer Acquisition Widget Component
interface CustomerAcquisitionProps {
  cac?: string;
  change?: string;
  period?: string;
}

const CustomerAcquisitionWidget: React.FC<CustomerAcquisitionProps> = ({
  cac,
  change,
  period
}) => {
  const [acquisitionData, setAcquisitionData] = useState<{
    cac: string,
    change: string,
    period: string
  }>({
    cac: cac || "$0.00",
    change: change || "0%",
    period: period || "from last quarter"
  });
  const [loading, setLoading] = useState<boolean>(!cac);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!cac) {
        setLoading(true);
        try {
          const fetchedData = await fetchCustomerAcquisition();
          setAcquisitionData(fetchedData);
          setError(null);
        } catch (err) {
          setError('Failed to load customer acquisition data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [cac, change, period]);

  // Determine if change is positive or negative
  const isPositive = acquisitionData.change.startsWith('-');
  const changeColorClass = isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <WidgetWrapper
      title="Customer Acquisition"
      description="Cost of customer acquisition"
      chartId="customer-acquisition-chart"
      data={[{ metric: "CAC", value: acquisitionData.cac, change: acquisitionData.change }]}
      relatedWidgets={getRelatedWidgets("customer-acquisition")}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Loading customer acquisition data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[200px]">
          <div className="text-4xl font-bold">{acquisitionData.cac}</div>
          <div className="text-sm text-muted-foreground mt-2">Average CAC</div>
          <div className={`text-sm ${changeColorClass} mt-1`}>
            {acquisitionData.change} {acquisitionData.period}
          </div>
        </div>
      )}
    </WidgetWrapper>
  );
};

// Customer Lifetime Value Widget Component
interface CustomerLifetimeValueProps {
  data?: CustomerLifetimeValueItem[];
}

const CustomerLifetimeValueWidget: React.FC<CustomerLifetimeValueProps> = ({ data = [] }) => {
  const [lifetimeData, setLifetimeData] = useState<CustomerLifetimeValueItem[]>(data);
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (data.length === 0) {
        setLoading(true);
        try {
          const fetchedData = await fetchCustomerLifetimeValue();
          setLifetimeData(fetchedData);
          setError(null);
        } catch (err) {
          setError('Failed to load customer lifetime value data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [data]);

  return (
    <WidgetWrapper
      title="Customer Lifetime Value"
      description="Average customer lifetime value by segment"
      chartId="lifetime-value-chart"
      data={lifetimeData}
      relatedWidgets={getRelatedWidgets("lifetime-value")}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Loading customer lifetime value data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </div>
      ) : lifetimeData.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          No customer lifetime value data available
        </div>
      ) : (
        <div className="space-y-4 h-[200px] overflow-y-auto">
          {lifetimeData.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-2 border-b">
              <div>
                <div className="font-medium">{item.segment}</div>
                <div className="text-sm text-muted-foreground">
                  {item.orders} orders · {item.retention} retention
                </div>
              </div>
              <div className="text-xl font-bold">{item.value}</div>
            </div>
          ))}
        </div>
      )}
    </WidgetWrapper>
  );
};

// No need for the useBusinessData hook anymore as we're fetching data directly in each component

// Define business widgets
export const businessWidgets: WidgetDefinition[] = [
  {
    id: "revenue-growth",
    name: "Revenue Growth",
    description: "Year-over-year revenue growth",
    category: "Business",
    component: <RevenueGrowthWidget />,
    defaultSize: "medium"
  },
  {
    id: "revenue-by-channel",
    name: "Revenue by Channel",
    description: "Revenue breakdown by sales channel",
    category: "Business",
    component: <RevenueByChannelWidget data={[]} />,
    defaultSize: "medium"
  },
  {
    id: "customer-acquisition",
    name: "Customer Acquisition",
    description: "Cost of customer acquisition",
    category: "Business",
    component: <CustomerAcquisitionWidget />,
    defaultSize: "medium"
  },
  {
    id: "lifetime-value",
    name: "Customer Lifetime Value",
    description: "Average customer lifetime value",
    category: "Business",
    component: <CustomerLifetimeValueWidget data={[]} />,
    defaultSize: "medium"
  }
];

// Define default layout for business widgets
export const defaultBusinessLayout: LayoutSection[] = [
  {
    id: "business-metrics",
    title: "Business Metrics",
    widgets: ["revenue-growth", "revenue-by-channel", "customer-acquisition", "lifetime-value"]
  }
];