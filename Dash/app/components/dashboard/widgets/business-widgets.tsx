import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetDefinition, LayoutSection } from "@/components/dashboard/customizable-layout";
import { WidgetWrapper } from "./widget-components";
import {
  revenueByChannelData,
  customerLifetimeValueData
} from "../../../../../demo/data/widget-data";

// Get related widgets for a given widget
const getRelatedWidgets = (widgetId: string) => {
  const otherWidgets = businessWidgets.filter(w => w.id !== widgetId);
  return otherWidgets.slice(0, 2); // Return up to 2 related widgets
};

// Define business widgets
export const businessWidgets: WidgetDefinition[] = [
  {
    id: "revenue-growth",
    name: "Revenue Growth",
    description: "Year-over-year revenue growth",
    category: "Business",
    component: (
      <WidgetWrapper
        title="Revenue Growth"
        description="Year-over-year revenue growth"
        chartId="revenue-growth-chart"
        data={[{ metric: "Revenue Growth", value: "+24.8%", period: "YoY" }]}
        relatedWidgets={getRelatedWidgets("revenue-growth")}
      >
        <div className="flex flex-col items-center justify-center h-[200px]">
          <div className="text-4xl font-bold text-green-500">+24.8%</div>
          <div className="text-sm text-muted-foreground mt-2">Compared to last year</div>
        </div>
      </WidgetWrapper>
    ),
    defaultSize: "medium"
  },
  {
    id: "revenue-by-channel",
    name: "Revenue by Channel",
    description: "Revenue breakdown by sales channel",
    category: "Business",
    component: (
      <WidgetWrapper
        title="Revenue by Channel"
        description="Revenue breakdown by sales channel"
        chartId="revenue-by-channel-chart"
        data={revenueByChannelData}
        relatedWidgets={getRelatedWidgets("revenue-by-channel")}
      >
        <div className="space-y-4 h-[200px] overflow-y-auto">
          {revenueByChannelData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{item.channel}</span>
                <span className="font-medium">{item.revenue}</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </WidgetWrapper>
    ),
    defaultSize: "medium"
  },
  {
    id: "customer-acquisition",
    name: "Customer Acquisition",
    description: "Cost of customer acquisition",
    category: "Business",
    component: (
      <WidgetWrapper
        title="Customer Acquisition"
        description="Cost of customer acquisition"
        chartId="customer-acquisition-chart"
        data={[{ metric: "CAC", value: "$42.35", change: "-12%" }]}
        relatedWidgets={getRelatedWidgets("customer-acquisition")}
      >
        <div className="flex flex-col items-center justify-center h-[200px]">
          <div className="text-4xl font-bold">$42.35</div>
          <div className="text-sm text-muted-foreground mt-2">Average CAC</div>
          <div className="text-sm text-green-500 mt-1">-12% from last quarter</div>
        </div>
      </WidgetWrapper>
    ),
    defaultSize: "medium"
  },
  {
    id: "lifetime-value",
    name: "Customer Lifetime Value",
    description: "Average customer lifetime value",
    category: "Business",
    component: (
      <WidgetWrapper
        title="Customer Lifetime Value"
        description="Average customer lifetime value by segment"
        chartId="lifetime-value-chart"
        data={customerLifetimeValueData}
        relatedWidgets={getRelatedWidgets("lifetime-value")}
      >
        <div className="space-y-4 h-[200px] overflow-y-auto">
          {customerLifetimeValueData.map((item, index) => (
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
      </WidgetWrapper>
    ),
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