"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetDefinition, LayoutSection } from "@/components/dashboard/customizable-layout";
import { WidgetWrapper } from "./widget-components";
import { RestAdapter } from '@/config/data/adapters/rest.adapter';

// Define interfaces for website data
interface SitePerformanceMetric {
  metric: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
  benchmark: string;
}

interface TopPage {
  page: string;
  visits: string;
  bounceRate: string;
  convRate: string;
}

interface UserBehaviorMetric {
  metric: string;
  value: string;
  change: string;
}

interface DeviceBreakdown {
  device: string;
  percentage: number;
}

// Create a REST adapter for API calls
const restAdapter = new RestAdapter({
  baseUrl: '/api',
  debug: process.env.NODE_ENV === 'development'
});

// Function to fetch site performance data
const fetchSitePerformance = async (): Promise<SitePerformanceMetric[]> => {
  try {
    const response = await restAdapter.fetchData<{data: SitePerformanceMetric[]}>('website/performance');
    return response.data;
  } catch (error) {
    console.error('Error fetching site performance data:', error);
    return [];
  }
};

// Function to fetch top pages data
const fetchTopPages = async (): Promise<TopPage[]> => {
  try {
    const response = await restAdapter.fetchData<{data: TopPage[]}>('website/top-pages');
    return response.data;
  } catch (error) {
    console.error('Error fetching top pages data:', error);
    return [];
  }
};

// Function to fetch user behavior data
const fetchUserBehavior = async (): Promise<UserBehaviorMetric[]> => {
  try {
    const response = await restAdapter.fetchData<{data: UserBehaviorMetric[]}>('website/user-behavior');
    return response.data;
  } catch (error) {
    console.error('Error fetching user behavior data:', error);
    return [];
  }
};

// Function to fetch device breakdown data
const fetchDeviceBreakdown = async (): Promise<DeviceBreakdown[]> => {
  try {
    const response = await restAdapter.fetchData<{data: DeviceBreakdown[]}>('website/devices');
    return response.data;
  } catch (error) {
    console.error('Error fetching device breakdown data:', error);
    return [];
  }
};

// Create functional components for each widget type
interface PagePerformanceWidgetProps {
  data: SitePerformanceMetric[];
}

const PagePerformanceWidget: React.FC<PagePerformanceWidgetProps> = ({ data = [] }) => {
  const [performanceData, setPerformanceData] = useState<SitePerformanceMetric[]>(data);
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (data.length === 0) {
        setLoading(true);
        try {
          const fetchedData = await fetchSitePerformance();
          setPerformanceData(fetchedData);
          setError(null);
        } catch (err) {
          setError('Failed to load site performance data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [data]);

  // Function to get status color
  const getStatusColor = (status: 'good' | 'warning' | 'critical'): string => {
    switch (status) {
      case 'good': return 'text-green-500';
      case 'warning': return 'text-amber-500';
      case 'critical': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  // Function to get status background color
  const getStatusBgColor = (status: 'good' | 'warning' | 'critical'): string => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-amber-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Function to get width based on status
  const getStatusWidth = (status: 'good' | 'warning' | 'critical'): string => {
    switch (status) {
      case 'good': return '85%';
      case 'warning': return '70%';
      case 'critical': return '50%';
      default: return '0%';
    }
  };

  return (
    <WidgetWrapper
      title="Page Performance"
      description="Performance metrics for top pages"
      chartId="page-performance-chart"
      data={performanceData}
      relatedWidgets={getRelatedWidgets("page-performance")}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Loading performance data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </div>
      ) : performanceData.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          No performance data available
        </div>
      ) : (
        <div className="space-y-4">
          {performanceData.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{metric.metric}</span>
                <span className={`font-medium ${getStatusColor(metric.status)}`}>
                  {metric.value}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className={`h-full ${getStatusBgColor(metric.status)} rounded-full`}
                  style={{
                    width: getStatusWidth(metric.status)
                  }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground">
                Benchmark: {metric.benchmark}
              </div>
            </div>
          ))}
        </div>
      )}
    </WidgetWrapper>
  );
};

interface TopPagesWidgetProps {
  data: TopPage[];
}

const TopPagesWidget: React.FC<TopPagesWidgetProps> = ({ data = [] }) => {
  const [pagesData, setPagesData] = useState<TopPage[]>(data);
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (data.length === 0) {
        setLoading(true);
        try {
          const fetchedData = await fetchTopPages();
          setPagesData(fetchedData);
          setError(null);
        } catch (err) {
          setError('Failed to load top pages data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [data]);

  // Function to calculate growth percentage based on visits
  const calculateGrowth = (visits: string): string => {
    const visitsNum = parseInt(visits.replace(/,/g, ''));
    if (visitsNum > 20000) return '+12%';
    if (visitsNum > 10000) return '+8%';
    return '+4%';
  };

  return (
    <WidgetWrapper
      title="Top Pages"
      description="Most visited pages on your website"
      chartId="top-pages-chart"
      data={pagesData}
      relatedWidgets={getRelatedWidgets("top-pages")}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Loading top pages data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </div>
      ) : pagesData.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          No page data available
        </div>
      ) : (
        <div className="space-y-4">
          {pagesData.map((page, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-2">
              <div>
                <div className="font-medium">{page.page}</div>
                <div className="text-xs text-muted-foreground">
                  Bounce Rate: {page.bounceRate} • Conv. Rate: {page.convRate}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{page.visits}</div>
                <div className="text-xs text-green-500">
                  {calculateGrowth(page.visits)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </WidgetWrapper>
  );
};

interface UserBehaviorWidgetProps {
  data: UserBehaviorMetric[];
}

const UserBehaviorWidget: React.FC<UserBehaviorWidgetProps> = ({ data = [] }) => {
  const [behaviorData, setBehaviorData] = useState<UserBehaviorMetric[]>(data);
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (data.length === 0) {
        setLoading(true);
        try {
          const fetchedData = await fetchUserBehavior();
          setBehaviorData(fetchedData);
          setError(null);
        } catch (err) {
          setError('Failed to load user behavior data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [data]);

  // Function to determine if a change is positive based on the metric
  const isPositiveChange = (metric: string, change: string): boolean => {
    const isIncreasing = change.startsWith('+');
    
    // For metrics where an increase is good
    if (['Time on Page', 'Pages per Session', 'Returning Visitors'].includes(metric)) {
      return isIncreasing;
    }
    
    // For metrics where a decrease is good
    if (['Bounce Rate', 'Exit Rate'].includes(metric)) {
      return !isIncreasing;
    }
    
    // Default case
    return isIncreasing;
  };

  return (
    <WidgetWrapper
      title="User Behavior"
      description="User behavior metrics"
      chartId="user-behavior-chart"
      data={behaviorData}
      relatedWidgets={getRelatedWidgets("user-behavior")}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Loading user behavior data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </div>
      ) : behaviorData.length === 0 ? (
        <div className="col-span-2 flex items-center justify-center h-[200px] text-muted-foreground">
          No user behavior data available
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {behaviorData.map((metric, index) => (
            <div key={index} className="space-y-1">
              <div className="text-sm text-muted-foreground">{metric.metric}</div>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className={`text-xs ${isPositiveChange(metric.metric, metric.change) ? 'text-green-500' : 'text-red-500'}`}>
                {metric.change} vs last month
              </div>
            </div>
          ))}
        </div>
      )}
    </WidgetWrapper>
  );
};

interface DeviceBreakdownWidgetProps {
  data: DeviceBreakdown[];
}

const DeviceBreakdownWidget: React.FC<DeviceBreakdownWidgetProps> = ({ data = [] }) => {
  const [deviceData, setDeviceData] = useState<DeviceBreakdown[]>(data);
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (data.length === 0) {
        setLoading(true);
        try {
          const fetchedData = await fetchDeviceBreakdown();
          setDeviceData(fetchedData);
          setError(null);
        } catch (err) {
          setError('Failed to load device breakdown data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [data]);

  // Function to get device color
  const getDeviceColor = (device: string, index: number): string => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500'];
    
    switch (device.toLowerCase()) {
      case 'desktop': return 'bg-blue-500';
      case 'mobile': return 'bg-green-500';
      case 'tablet': return 'bg-purple-500';
      default: return colors[index % colors.length];
    }
  };

  return (
    <WidgetWrapper
      title="Device Breakdown"
      description="Traffic by device type"
      chartId="device-breakdown-chart"
      data={deviceData}
      relatedWidgets={getRelatedWidgets("device-breakdown")}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Loading device breakdown data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </div>
      ) : deviceData.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          No device data available
        </div>
      ) : (
        <div className="space-y-4">
          {deviceData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{item.device}</span>
                <span className="font-medium">{item.percentage}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className={`h-full ${getDeviceColor(item.device, index)} rounded-full`}
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

// Get related widgets for a given widget
const getRelatedWidgets = (widgetId: string) => {
  const otherWidgets = websiteWidgets.filter(w => w.id !== widgetId);
  return otherWidgets.slice(0, 2); // Return up to 2 related widgets
};

// Create website widgets with data
export const createWebsiteWidgets = (
  pagePerformanceData: SitePerformanceMetric[] = [],
  topPagesData: TopPage[] = [],
  userBehaviorData: UserBehaviorMetric[] = [],
  deviceBreakdownData: DeviceBreakdown[] = []
): WidgetDefinition[] => [
  {
    id: "page-performance",
    name: "Page Performance",
    description: "Performance metrics for top pages",
    category: "Website",
    component: <PagePerformanceWidget data={pagePerformanceData} />,
    defaultSize: "large"
  },
  {
    id: "top-pages",
    name: "Top Pages",
    description: "Most visited pages on your website",
    category: "Website",
    component: <TopPagesWidget data={topPagesData} />,
    defaultSize: "medium"
  },
  {
    id: "user-behavior",
    name: "User Behavior",
    description: "User behavior metrics",
    category: "Website",
    component: <UserBehaviorWidget data={userBehaviorData} />,
    defaultSize: "medium"
  },
  {
    id: "device-breakdown",
    name: "Device Breakdown",
    description: "Traffic by device type",
    category: "Website",
    component: <DeviceBreakdownWidget data={deviceBreakdownData} />,
    defaultSize: "small"
  }
];

// Define website widgets with empty data for backward compatibility
export const websiteWidgets = createWebsiteWidgets();

// Define default layout for website widgets
export const defaultWebsiteLayout: LayoutSection[] = [
  {
    id: "website-metrics",
    title: "Website Metrics",
    widgets: ["page-performance", "top-pages", "user-behavior", "device-breakdown"]
  }
];