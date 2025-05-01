import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetDefinition, LayoutSection } from "@/components/dashboard/customizable-layout";
import { WidgetWrapper } from "./widget-components";
import {
  topPagesData,
  sitePerformanceData
} from "../../../../../demo/data/widget-data";

// Get related widgets for a given widget
const getRelatedWidgets = (widgetId: string) => {
  const otherWidgets = websiteWidgets.filter(w => w.id !== widgetId);
  return otherWidgets.slice(0, 2); // Return up to 2 related widgets
};

// Define website widgets
export const websiteWidgets: WidgetDefinition[] = [
  {
    id: "page-performance",
    name: "Page Performance",
    description: "Performance metrics for top pages",
    category: "Website",
    component: (
      <WidgetWrapper
        title="Page Performance"
        description="Performance metrics for top pages"
        chartId="page-performance-chart"
        data={sitePerformanceData}
        relatedWidgets={getRelatedWidgets("page-performance")}
      >
        <div className="space-y-4">
          {sitePerformanceData.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{metric.metric}</span>
                <span className={`font-medium ${metric.status === 'good' ? 'text-green-500' : 'text-amber-500'}`}>
                  {metric.value}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className={`h-full ${metric.status === 'good' ? 'bg-green-500' : 'bg-yellow-500'} rounded-full`}
                  style={{
                    width: `${metric.status === 'good' ? '85%' : '70%'}`
                  }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground">
                Benchmark: {metric.benchmark}
              </div>
            </div>
          ))}
        </div>
      </WidgetWrapper>
    ),
    defaultSize: "large"
  },
  {
    id: "top-pages",
    name: "Top Pages",
    description: "Most visited pages on your website",
    category: "Website",
    component: (
      <WidgetWrapper
        title="Top Pages"
        description="Most visited pages on your website"
        chartId="top-pages-chart"
        data={topPagesData}
        relatedWidgets={getRelatedWidgets("top-pages")}
      >
        <div className="space-y-4">
          {topPagesData.map((page, index) => (
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
                  {parseInt(page.visits.replace(/,/g, '')) > 20000 ? '+12%' :
                   parseInt(page.visits.replace(/,/g, '')) > 10000 ? '+8%' : '+4%'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </WidgetWrapper>
    ),
    defaultSize: "medium"
  },
  {
    id: "user-behavior",
    name: "User Behavior",
    description: "User behavior metrics",
    category: "Website",
    component: (
      <WidgetWrapper
        title="User Behavior"
        description="User behavior metrics"
        chartId="user-behavior-chart"
        data={[
          { metric: "Avg. Session Duration", value: "3m 42s", change: "+12%" },
          { metric: "Pages per Session", value: "4.2", change: "+8%" },
          { metric: "Bounce Rate", value: "32.8%", change: "+2.1%" },
          { metric: "New Visitors", value: "64.7%", change: "+5.3%" }
        ]}
        relatedWidgets={getRelatedWidgets("user-behavior")}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Avg. Session Duration</div>
            <div className="text-2xl font-bold">3m 42s</div>
            <div className="text-xs text-green-500">+12% vs last month</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Pages per Session</div>
            <div className="text-2xl font-bold">4.2</div>
            <div className="text-xs text-green-500">+8% vs last month</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Bounce Rate</div>
            <div className="text-2xl font-bold">32.8%</div>
            <div className="text-xs text-red-500">+2.1% vs last month</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">New Visitors</div>
            <div className="text-2xl font-bold">64.7%</div>
            <div className="text-xs text-green-500">+5.3% vs last month</div>
          </div>
        </div>
      </WidgetWrapper>
    ),
    defaultSize: "medium"
  },
  {
    id: "device-breakdown",
    name: "Device Breakdown",
    description: "Traffic by device type",
    category: "Website",
    component: (
      <WidgetWrapper
        title="Device Breakdown"
        description="Traffic by device type"
        chartId="device-breakdown-chart"
        data={[
          { device: "Mobile", percentage: 58 },
          { device: "Desktop", percentage: 32 },
          { device: "Tablet", percentage: 10 }
        ]}
        relatedWidgets={getRelatedWidgets("device-breakdown")}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Mobile</span>
              <span className="font-medium">58%</span>
            </div>
            <div className="h-2 bg-muted rounded-full">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: "58%" }}></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Desktop</span>
              <span className="font-medium">32%</span>
            </div>
            <div className="h-2 bg-muted rounded-full">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: "32%" }}></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tablet</span>
              <span className="font-medium">10%</span>
            </div>
            <div className="h-2 bg-muted rounded-full">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: "10%" }}></div>
            </div>
          </div>
        </div>
      </WidgetWrapper>
    ),
    defaultSize: "small"
  }
];

// Define default layout for website widgets
export const defaultWebsiteLayout: LayoutSection[] = [
  {
    id: "website-metrics",
    title: "Website Metrics",
    widgets: ["page-performance", "top-pages", "user-behavior", "device-breakdown"]
  }
];