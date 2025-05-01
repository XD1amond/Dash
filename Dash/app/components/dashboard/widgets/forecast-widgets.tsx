"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WidgetWrapper } from "./widget-components"
import {
  salesForecastData,
  inventoryForecastData
} from "../../../../../demo/data/widget-data"

// Define the widget size type
type WidgetSize = "small" | "medium" | "large" | "full";

// Get related widgets for a given widget
const getRelatedWidgets = (widgetId: string) => {
  const otherWidgets = forecastWidgets.filter(w => w.id !== widgetId);
  return otherWidgets.slice(0, 2); // Return up to 2 related widgets
};

export const forecastWidgets = [
  {
    id: "revenue-forecast",
    name: "Revenue Forecast",
    description: "Projected revenue for the next 6 months",
    category: "Forecast",
    component: (
      <WidgetWrapper
        title="Revenue Forecast"
        description="Projected revenue for the next 6 months"
        chartId="revenue-forecast-chart"
        data={salesForecastData}
        relatedWidgets={getRelatedWidgets("revenue-forecast")}
      >
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Current Month</div>
              <div className="text-2xl font-bold">$312,000</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Projected Growth</div>
              <div className="text-2xl font-bold text-green-500">+8.4%</div>
            </div>
          </div>
          <div className="space-y-4">
            {salesForecastData.slice(0, 6).map((month, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{month.month} 2023</span>
                  <span className="font-medium">${month.forecast?.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(month.forecast / 410000) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </WidgetWrapper>
    ),
    defaultSize: "large" as WidgetSize
  },
  {
    id: "inventory-forecast",
    name: "Inventory Forecast",
    description: "Projected inventory needs",
    category: "Forecast",
    component: (
      <WidgetWrapper
        title="Inventory Forecast"
        description="Projected inventory needs"
        chartId="inventory-forecast-chart"
        data={inventoryForecastData}
        relatedWidgets={getRelatedWidgets("inventory-forecast")}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span>Low Stock Alert</span>
            </div>
            <span className="font-medium">3 products</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
              <span>Reorder Soon</span>
            </div>
            <span className="font-medium">8 products</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>Adequate Stock</span>
            </div>
            <span className="font-medium">42 products</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span>Overstocked</span>
            </div>
            <span className="font-medium">5 products</span>
          </div>
          <div className="pt-4 border-t mt-2">
            <div className="text-sm font-medium mb-2">Projected Restock Needs</div>
            <div className="space-y-2">
              {inventoryForecastData.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.product}</span>
                  {item.currentStock < item.reorderPoint ? (
                    <span className="text-red-500">Order Now</span>
                  ) : item.currentStock < item.reorderPoint * 1.5 ? (
                    <span className="text-amber-500">Order in {Math.floor(Math.random() * 14) + 1} days</span>
                  ) : (
                    <span className="text-green-500">Stock Adequate</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </WidgetWrapper>
    ),
    defaultSize: "medium" as WidgetSize
  },
  {
    id: "trend-prediction",
    name: "Trend Prediction",
    description: "Predicted upcoming trends",
    category: "Forecast",
    component: (
      <WidgetWrapper
        title="Trend Prediction"
        description="Predicted upcoming trends"
        chartId="trend-prediction-chart"
        data={[
          { trend: "Sustainable Products", status: "Rising", growth: "+32%" },
          { trend: "Smart Home Devices", status: "Rising", growth: "+28%" },
          { trend: "Fitness Wearables", status: "Stable", growth: "+5%" },
          { trend: "Traditional Watches", status: "Declining", growth: "-15%" }
        ]}
        relatedWidgets={getRelatedWidgets("trend-prediction")}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Sustainable Products</span>
              <div className="flex items-center">
                <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full">Rising</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Eco-friendly products expected to see 32% growth in next quarter
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Smart Home Devices</span>
              <div className="flex items-center">
                <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full">Rising</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Projected 28% increase in smart home category
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Fitness Wearables</span>
              <div className="flex items-center">
                <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full">Stable</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Consistent demand expected to continue
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Traditional Watches</span>
              <div className="flex items-center">
                <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded-full">Declining</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Expected to decrease by 15% in next quarter
            </div>
          </div>
        </div>
      </WidgetWrapper>
    ),
    defaultSize: "medium" as WidgetSize
  }
];

export const defaultForecastLayout = [
  {
    id: "forecast-metrics",
    title: "Forecast Metrics",
    widgets: ["revenue-forecast", "inventory-forecast", "trend-prediction"]
  }
];