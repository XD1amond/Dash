"use client"

import React from 'react'
import { WidgetWrapper } from "./widget-components"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  performanceOverviewData,
  marketingRoiData,
  productPerformanceData
} from "../../../../../demo/data/widget-data"

// Define the widget size type
type WidgetSize = "small" | "medium" | "large" | "full";

export const performanceWidgets = [
  {
    id: "performance-overview",
    name: "Performance Overview",
    description: "Key performance metrics",
    category: "Performance",
    component: (
      <WidgetWrapper
        title="Performance Overview"
        description="Key performance metrics"
        chartId="performance-overview-chart"
        data={performanceOverviewData}
        relatedWidgets={[]} // Will be updated after initialization
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {performanceOverviewData.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="text-sm text-muted-foreground">{item.metric}</div>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className={`text-xs ${item.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {item.change} vs last month
              </div>
            </div>
          ))}
        </div>
      </WidgetWrapper>
    ),
    defaultSize: "large" as WidgetSize
  },
  {
    id: "marketing-roi",
    name: "Marketing ROI",
    description: "Return on investment by channel",
    category: "Performance",
    component: (
      <WidgetWrapper
        title="Marketing ROI"
        description="Return on investment by channel"
        chartId="marketing-roi-chart"
        data={marketingRoiData}
        relatedWidgets={[]} // Will be updated after initialization
      >
        <div className="space-y-4">
          {marketingRoiData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.channel}</span>
                <span className={`font-medium ${item.roi.startsWith('4') ? 'text-green-500' : item.roi.startsWith('1') ? 'text-amber-500' : 'text-green-500'}`}>
                  {item.roi}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className={`h-full ${item.roi.startsWith('4') ? 'bg-green-500' : item.roi.startsWith('1') ? 'bg-amber-500' : 'bg-green-500'} rounded-full`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </WidgetWrapper>
    ),
    defaultSize: "medium" as WidgetSize
  },
  {
    id: "product-performance",
    name: "Product Performance",
    description: "Performance metrics by product category",
    category: "Performance",
    component: (
      <WidgetWrapper
        title="Product Performance"
        description="Performance metrics by product category"
        chartId="product-performance-chart"
        data={productPerformanceData}
        relatedWidgets={[]} // Will be updated after initialization
      >
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
              {productPerformanceData.map((item, index) => (
                <tr key={index} className={index < productPerformanceData.length - 1 ? "border-b" : ""}>
                  <td className="p-2 font-medium">{item.category}</td>
                  <td className="p-2 text-right">{item.revenue}</td>
                  <td className="p-2 text-right">{item.units}</td>
                  <td className="p-2 text-right">{item.profit}</td>
                  <td className="p-2 text-right text-green-500">{item.margin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WidgetWrapper>
    ),
    defaultSize: "medium" as WidgetSize
  }
];

// Now that performanceWidgets is defined, we can create the getRelatedWidgets function
const getRelatedWidgets = (widgetId: string) => {
  const otherWidgets = performanceWidgets.filter(w => w.id !== widgetId);
  return otherWidgets.slice(0, 2); // Return up to 2 related widgets
};

// Update the widget components with the correct related widgets
performanceWidgets.forEach(widget => {
  if (widget.component.props.relatedWidgets && Array.isArray(widget.component.props.relatedWidgets)) {
    widget.component = React.cloneElement(widget.component, {
      relatedWidgets: getRelatedWidgets(widget.id)
    });
  }
});

export const defaultPerformanceLayout = [
  {
    id: "performance-metrics",
    title: "Performance Metrics",
    widgets: ["performance-overview", "marketing-roi", "product-performance"]
  }
];