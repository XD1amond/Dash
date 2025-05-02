"use client"

import React, { useState, useEffect } from 'react'
import { WidgetWrapper } from "./widget-components"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WidgetDefinition, LayoutSection } from "@/components/dashboard/customizable-layout"
import { RestAdapter } from '@/config/data/adapters/rest.adapter'

// Define interfaces for performance data
interface PerformanceOverviewItem {
  metric: string;
  value: string;
  change: string;
  direction: 'up' | 'down';
}

interface MarketingRoiItem {
  channel: string;
  roi: string;
  percentage: number;
}

interface ProductPerformanceItem {
  category: string;
  revenue: string;
  units: string;
  profit: string;
  margin: string;
}

// Create a REST adapter for API calls
const restAdapter = new RestAdapter({
  baseUrl: '/api',
  debug: process.env.NODE_ENV === 'development'
});

// Function to fetch performance overview data
const fetchPerformanceOverview = async (): Promise<PerformanceOverviewItem[]> => {
  try {
    const response = await restAdapter.fetchData<{data: PerformanceOverviewItem[]}>('performance/overview');
    return response.data;
  } catch (error) {
    console.error('Error fetching performance overview data:', error);
    return [];
  }
};

// Function to fetch marketing ROI data
const fetchMarketingRoi = async (): Promise<MarketingRoiItem[]> => {
  try {
    const response = await restAdapter.fetchData<{data: MarketingRoiItem[]}>('performance/marketing-roi');
    return response.data;
  } catch (error) {
    console.error('Error fetching marketing ROI data:', error);
    return [];
  }
};

// Function to fetch product performance data
const fetchProductPerformance = async (): Promise<ProductPerformanceItem[]> => {
  try {
    const response = await restAdapter.fetchData<{data: ProductPerformanceItem[]}>('performance/product');
    return response.data;
  } catch (error) {
    console.error('Error fetching product performance data:', error);
    return [];
  }
};

// Create functional components for each widget type
interface PerformanceOverviewWidgetProps {
  data: PerformanceOverviewItem[];
}

const PerformanceOverviewWidget: React.FC<PerformanceOverviewWidgetProps> = ({ data = [] }) => {
  const [performanceData, setPerformanceData] = useState<PerformanceOverviewItem[]>(data);
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (data.length === 0) {
        setLoading(true);
        try {
          const fetchedData = await fetchPerformanceOverview();
          setPerformanceData(fetchedData);
          setError(null);
        } catch (err) {
          setError('Failed to load performance data');
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
      title="Performance Overview"
      description="Key performance metrics"
      chartId="performance-overview-chart"
      data={performanceData}
      relatedWidgets={getRelatedWidgets("performance-overview")}
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
        <div className="col-span-4 flex items-center justify-center h-[200px] text-muted-foreground">
          No performance data available
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {performanceData.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="text-sm text-muted-foreground">{item.metric}</div>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className={`text-xs ${item.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {item.change} vs last month
              </div>
            </div>
          ))}
        </div>
      )}
    </WidgetWrapper>
  );
};

interface MarketingRoiWidgetProps {
  data: MarketingRoiItem[];
}

const MarketingRoiWidget: React.FC<MarketingRoiWidgetProps> = ({ data = [] }) => {
  const [roiData, setRoiData] = useState<MarketingRoiItem[]>(data);
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (data.length === 0) {
        setLoading(true);
        try {
          const fetchedData = await fetchMarketingRoi();
          setRoiData(fetchedData);
          setError(null);
        } catch (err) {
          setError('Failed to load marketing ROI data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [data]);

  // Function to determine color based on ROI value
  const getRoiColor = (roi: string): string => {
    const roiValue = parseInt(roi);
    if (roiValue >= 400) return 'text-green-500';
    if (roiValue >= 300) return 'text-emerald-500';
    if (roiValue >= 200) return 'text-blue-500';
    if (roiValue >= 100) return 'text-amber-500';
    return 'text-red-500';
  };

  // Function to determine background color based on ROI value
  const getRoiBgColor = (roi: string): string => {
    const roiValue = parseInt(roi);
    if (roiValue >= 400) return 'bg-green-500';
    if (roiValue >= 300) return 'bg-emerald-500';
    if (roiValue >= 200) return 'bg-blue-500';
    if (roiValue >= 100) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <WidgetWrapper
      title="Marketing ROI"
      description="Return on investment by channel"
      chartId="marketing-roi-chart"
      data={roiData}
      relatedWidgets={getRelatedWidgets("marketing-roi")}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Loading marketing ROI data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </div>
      ) : roiData.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          No marketing ROI data available
        </div>
      ) : (
        <div className="space-y-4">
          {roiData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.channel}</span>
                <span className={`font-medium ${getRoiColor(item.roi)}`}>
                  {item.roi}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className={`h-full ${getRoiBgColor(item.roi)} rounded-full`}
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

interface ProductPerformanceWidgetProps {
  data: ProductPerformanceItem[];
}

const ProductPerformanceWidget: React.FC<ProductPerformanceWidgetProps> = ({ data = [] }) => {
  const [productData, setProductData] = useState<ProductPerformanceItem[]>(data);
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (data.length === 0) {
        setLoading(true);
        try {
          const fetchedData = await fetchProductPerformance();
          setProductData(fetchedData);
          setError(null);
        } catch (err) {
          setError('Failed to load product performance data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [data]);

  // Function to determine margin color
  const getMarginColor = (margin: string): string => {
    const marginValue = parseInt(margin);
    if (marginValue >= 40) return 'text-green-500';
    if (marginValue >= 30) return 'text-emerald-500';
    if (marginValue >= 20) return 'text-blue-500';
    if (marginValue >= 10) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <WidgetWrapper
      title="Product Performance"
      description="Performance metrics by product category"
      chartId="product-performance-chart"
      data={productData}
      relatedWidgets={getRelatedWidgets("product-performance")}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Loading product performance data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </div>
      ) : productData.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          No product performance data available
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left font-medium p-2">Category</th>
                <th className="text-right font-medium p-2">Revenue</th>
                <th className="text-right font-medium p-2">Units</th>
                <th className="text-right font-medium p-2">Profit</th>
                <th className="text-right font-medium p-2">Margin</th>
              </tr>
            </thead>
            <tbody>
              {productData.map((item, index) => (
                <tr key={index} className={index < productData.length - 1 ? "border-b" : ""}>
                  <td className="p-2 font-medium">{item.category}</td>
                  <td className="p-2 text-right">{item.revenue}</td>
                  <td className="p-2 text-right">{item.units}</td>
                  <td className="p-2 text-right">{item.profit}</td>
                  <td className={`p-2 text-right ${getMarginColor(item.margin)}`}>{item.margin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </WidgetWrapper>
  );
};

// Define the widget size type
type WidgetSize = "small" | "medium" | "large" | "full";

// Define performance widgets
export const performanceWidgets: WidgetDefinition[] = [
  {
    id: "performance-overview",
    name: "Performance Overview",
    description: "Key performance metrics",
    category: "Performance",
    component: <PerformanceOverviewWidget data={[]} />,
    defaultSize: "large" as WidgetSize
  },
  {
    id: "marketing-roi",
    name: "Marketing ROI",
    description: "Return on investment by channel",
    category: "Performance",
    component: <MarketingRoiWidget data={[]} />,
    defaultSize: "medium" as WidgetSize
  },
  {
    id: "product-performance",
    name: "Product Performance",
    description: "Performance metrics by product category",
    category: "Performance",
    component: <ProductPerformanceWidget data={[]} />,
    defaultSize: "medium" as WidgetSize
  }
];

// Get related widgets for a given widget
const getRelatedWidgets = (widgetId: string) => {
  const otherWidgets = performanceWidgets.filter(w => w.id !== widgetId);
  return otherWidgets.slice(0, 2); // Return up to 2 related widgets
};

export const defaultPerformanceLayout: LayoutSection[] = [
  {
    id: "performance-metrics",
    title: "Performance Metrics",
    widgets: ["performance-overview", "marketing-roi", "product-performance"]
  }
];