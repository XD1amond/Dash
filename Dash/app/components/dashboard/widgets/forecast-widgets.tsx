"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WidgetWrapper } from "./widget-components"
import { WidgetDefinition, LayoutSection } from "@/components/dashboard/customizable-layout"
import {
  SalesForecastItem,
  InventoryForecastItem,
  TrendPredictionItem
} from '@/config/data/types/forecast.types';
import { RestAdapter } from '@/config/data/adapters/rest.adapter';

// Create a REST adapter for API calls

// Create a REST adapter for API calls
const restAdapter = new RestAdapter({
  baseUrl: '/api',
  debug: process.env.NODE_ENV === 'development'
});

// Function to fetch sales forecast data
const fetchSalesForecast = async (): Promise<SalesForecastItem[]> => {
  try {
    const response = await restAdapter.fetchData<{data: SalesForecastItem[]}>('forecast/sales');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching sales forecast data:', error);
    return [];
  }
};

// Function to fetch inventory forecast data
const fetchInventoryForecast = async (): Promise<InventoryForecastItem[]> => {
  try {
    const response = await restAdapter.fetchData<{data: InventoryForecastItem[]}>('forecast/inventory');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching inventory forecast data:', error);
    return [];
  }
};

// Function to fetch trend prediction data
const fetchTrendPrediction = async (): Promise<TrendPredictionItem[]> => {
  try {
    const response = await restAdapter.fetchData<{data: TrendPredictionItem[]}>('forecast/trends');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching trend prediction data:', error);
    return [];
  }
};


// Placeholder for getRelatedWidgets function - will be defined after forecastWidgets
let getRelatedWidgets: (widgetId: string) => any[] = () => [];

// Revenue Forecast Widget Component
interface RevenueForecastProps {
  data?: SalesForecastItem[];
  currentMonth?: string;
  currentRevenue?: string;
  projectedGrowth?: string;
}

const RevenueForecastWidget: React.FC<RevenueForecastProps> = ({
  data = [],
  currentMonth,
  currentRevenue,
  projectedGrowth
}) => {
  const [forecastData, setForecastData] = useState<SalesForecastItem[]>(data);
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [currentMonthData, setCurrentMonthData] = useState({
    month: currentMonth || "Jan",
    revenue: currentRevenue || "$0",
    growth: projectedGrowth || "+0.0%"
  });

  useEffect(() => {
    // Only load data once when the component mounts
    const loadData = async () => {
      if (data.length === 0 && !loading) {
        setLoading(true);
        try {
          const fetchedData = await fetchSalesForecast();
          setForecastData(fetchedData);
          
          // Find current month data
          if (fetchedData.length > 0) {
            const currentData = fetchedData.find(item => item.actual !== null);
            if (currentData) {
              const currentIndex = fetchedData.indexOf(currentData);
              const nextMonth = fetchedData[currentIndex + 1];
              
              if (nextMonth) {
                const growth = nextMonth.forecast > currentData.forecast
                  ? `+${(((nextMonth.forecast - currentData.forecast) / currentData.forecast) * 100).toFixed(1)}%`
                  : `-${(((currentData.forecast - nextMonth.forecast) / currentData.forecast) * 100).toFixed(1)}%`;
                
                setCurrentMonthData({
                  month: currentData.month,
                  revenue: `$${currentData.forecast.toLocaleString()}`,
                  growth
                });
              }
            }
          }
          
          setError(null);
        } catch (err) {
          setError('Failed to load forecast data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length]); // Only depend on data.length to prevent infinite loops

  // Calculate max value for percentage calculation
  const maxForecast = forecastData.length > 0
    ? Math.max(...forecastData.map(item => item.forecast || 0))
    : 100000; // Default value if no data

  const currentYear = new Date().getFullYear();

  return (
    <WidgetWrapper
      title="Revenue Forecast"
      description="Projected revenue for the next 6 months"
      chartId="revenue-forecast-chart"
      data={forecastData}
      relatedWidgets={getRelatedWidgets("revenue-forecast")}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Loading forecast data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Current Month</div>
              <div className="text-2xl font-bold">{currentMonthData.revenue}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Projected Growth</div>
              <div className="text-2xl font-bold text-green-500">{currentMonthData.growth}</div>
            </div>
          </div>
          <div className="space-y-4">
            {forecastData.slice(0, 6).map((month, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{month.month} {currentYear}</span>
                  <span className="font-medium">${month.forecast?.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(month.forecast / maxForecast) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {forecastData.length === 0 && (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                No forecast data available
              </div>
            )}
          </div>
        </div>
      )}
    </WidgetWrapper>
  );
};

// Inventory Forecast Widget Component
interface InventoryForecastProps {
  data?: InventoryForecastItem[];
  stockSummary?: {
    lowStock: number;
    reorderSoon: number;
    adequateStock: number;
    overstocked: number;
  };
}

const InventoryForecastWidget: React.FC<InventoryForecastProps> = ({
  data = [],
  stockSummary
}) => {
  const [inventoryData, setInventoryData] = useState<InventoryForecastItem[]>(data);
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [stockSummaryData, setStockSummaryData] = useState(stockSummary || {
    lowStock: 0,
    reorderSoon: 0,
    adequateStock: 0,
    overstocked: 0
  });

  useEffect(() => {
    // Only load data once when the component mounts
    const loadData = async () => {
      if (data.length === 0 && !loading) {
        setLoading(true);
        try {
          const fetchedData = await fetchInventoryForecast();
          setInventoryData(fetchedData);
          
          // Calculate stock summary
          if (fetchedData.length > 0 && !stockSummary) {
            const summary = {
              lowStock: 0,
              reorderSoon: 0,
              adequateStock: 0,
              overstocked: 0
            };
            
            fetchedData.forEach(item => {
              if (item.currentStock < item.reorderPoint) {
                summary.lowStock++;
              } else if (item.currentStock < item.reorderPoint * 1.5) {
                summary.reorderSoon++;
              } else if (item.currentStock > item.projectedDemand * 2) {
                summary.overstocked++;
              } else {
                summary.adequateStock++;
              }
            });
            
            setStockSummaryData(summary);
          }
          
          setError(null);
        } catch (err) {
          setError('Failed to load inventory data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length]); // Only depend on data.length to prevent infinite loops

  // Calculate days until reorder based on current stock and projected demand
  const calculateDaysUntilReorder = (item: InventoryForecastItem): number => {
    const dailyDemand = item.projectedDemand / 30; // Assuming monthly projection
    const daysLeft = Math.floor((item.currentStock - item.reorderPoint) / dailyDemand);
    return Math.max(0, daysLeft);
  };

  return (
    <WidgetWrapper
      title="Inventory Forecast"
      description="Projected inventory needs"
      chartId="inventory-forecast-chart"
      data={inventoryData}
      relatedWidgets={getRelatedWidgets("inventory-forecast")}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Loading inventory data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span>Low Stock Alert</span>
            </div>
            <span className="font-medium">{stockSummaryData.lowStock} products</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
              <span>Reorder Soon</span>
            </div>
            <span className="font-medium">{stockSummaryData.reorderSoon} products</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>Adequate Stock</span>
            </div>
            <span className="font-medium">{stockSummaryData.adequateStock} products</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span>Overstocked</span>
            </div>
            <span className="font-medium">{stockSummaryData.overstocked} products</span>
          </div>
          <div className="pt-4 border-t mt-2">
            <div className="text-sm font-medium mb-2">Projected Restock Needs</div>
            <div className="space-y-2">
              {inventoryData.map((item, index) => {
                const daysUntilReorder = calculateDaysUntilReorder(item);
                return (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.product}</span>
                    {item.currentStock < item.reorderPoint ? (
                      <span className="text-red-500">Order Now</span>
                    ) : item.currentStock < item.reorderPoint * 1.5 ? (
                      <span className="text-amber-500">Order in {daysUntilReorder} days</span>
                    ) : (
                      <span className="text-green-500">Stock Adequate</span>
                    )}
                  </div>
                );
              })}
              {inventoryData.length === 0 && (
                <div className="text-muted-foreground text-sm">
                  No inventory forecast data available
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </WidgetWrapper>
  );
};

// Trend Prediction Widget Component
interface TrendPredictionProps {
  data?: TrendPredictionItem[];
}

const TrendPredictionWidget: React.FC<TrendPredictionProps> = ({
  data = []
}) => {
  const [trendData, setTrendData] = useState<TrendPredictionItem[]>(data);
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only load data once when the component mounts
    const loadData = async () => {
      if (data.length === 0 && !loading) {
        setLoading(true);
        try {
          const fetchedData = await fetchTrendPrediction();
          setTrendData(fetchedData);
          setError(null);
        } catch (err) {
          setError('Failed to load trend data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length]); // Only depend on data.length to prevent infinite loops

  // Generate descriptions if not provided in data
  const getDescription = (item: TrendPredictionItem): string => {
    if (item.description) return item.description;
    
    if (item.status === "Rising") {
      return `${item.trend} expected to see ${item.growth} growth in next quarter`;
    } else if (item.status === "Stable") {
      return `Consistent demand for ${item.trend} expected to continue`;
    } else {
      return `${item.trend} expected to decrease by ${item.growth.replace('+', '-')} in next quarter`;
    }
  };

  return (
    <WidgetWrapper
      title="Trend Prediction"
      description="Predicted upcoming trends"
      chartId="trend-prediction-chart"
      data={trendData}
      relatedWidgets={getRelatedWidgets("trend-prediction")}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Loading trend data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </div>
      ) : trendData.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          No trend prediction data available
        </div>
      ) : (
        <div className="space-y-4">
          {trendData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.trend}</span>
                <div className="flex items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.status === "Rising"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : item.status === "Stable"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  }`}>{item.status}</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {getDescription(item)}
              </div>
            </div>
          ))}
        </div>
      )}
    </WidgetWrapper>
  );
};

// Define forecast widgets
export const forecastWidgets: WidgetDefinition[] = [
  {
    id: "revenue-forecast",
    name: "Revenue Forecast",
    description: "Projected revenue for the next 6 months",
    category: "Forecast",
    component: <RevenueForecastWidget />,
    defaultSize: "large"
  },
  {
    id: "inventory-forecast",
    name: "Inventory Forecast",
    description: "Projected inventory needs",
    category: "Forecast",
    component: <InventoryForecastWidget />,
    defaultSize: "medium"
  },
  {
    id: "trend-prediction",
    name: "Trend Prediction",
    description: "Predicted upcoming trends",
    category: "Forecast",
    component: <TrendPredictionWidget />,
    defaultSize: "medium"
  }
];

// Define default layout for forecast widgets
export const defaultForecastLayout: LayoutSection[] = [
  {
    id: "forecast-metrics",
    title: "Forecast Metrics",
    widgets: ["revenue-forecast", "inventory-forecast", "trend-prediction"]
  }
];

// Now that forecastWidgets is defined, we can create the getRelatedWidgets function
getRelatedWidgets = (widgetId: string) => {
  const otherWidgets = forecastWidgets.filter(w => w.id !== widgetId);
  return otherWidgets.slice(0, 2); // Return up to 2 related widgets
};