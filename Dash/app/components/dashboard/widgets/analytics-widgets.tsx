"use client"

import React from 'react'
import { WidgetWrapper } from "./widget-components"
import {
  salesFunnelData,
  cohortAnalysisData,
  abTestingData
} from "../../../../../demo/data/widget-data"

// Define the widget size type
type WidgetSize = "small" | "medium" | "large" | "full";

// Define the analytics widgets first
export const analyticsWidgets = [
  {
    id: "sales-funnel",
    name: "Sales Funnel",
    description: "Conversion funnel from visit to purchase",
    category: "Analytics",
    component: (
      <WidgetWrapper
        title="Sales Funnel"
        description="Conversion funnel from visit to purchase"
        chartId="sales-funnel-chart"
        data={salesFunnelData}
        relatedWidgets={[]} // Will be updated after initialization
      >
        <div className="space-y-8 pt-4">
          {salesFunnelData.map((item, index) => (
            <div key={index} className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{item.stage}</span>
                <span className="text-sm">{item.count.toLocaleString()}</span>
              </div>
              <div className="h-8 bg-blue-100 dark:bg-blue-900/30 w-full rounded-md">
                <div
                  className="h-8 bg-blue-500 dark:bg-blue-500/70 rounded-md"
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
    id: "cohort-analysis",
    name: "Cohort Analysis",
    description: "Customer retention by cohort",
    category: "Analytics",
    component: (
      <WidgetWrapper
        title="Cohort Analysis"
        description="Customer retention by cohort"
        chartId="cohort-analysis-chart"
        data={cohortAnalysisData}
        relatedWidgets={[]} // Will be updated after initialization
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left font-medium p-2">Cohort</th>
                <th className="text-center font-medium p-2">Month 0</th>
                <th className="text-center font-medium p-2">Month 1</th>
                <th className="text-center font-medium p-2">Month 2</th>
                <th className="text-center font-medium p-2">Month 3</th>
                <th className="text-center font-medium p-2">Month 4</th>
                <th className="text-center font-medium p-2">Month 5</th>
              </tr>
            </thead>
            <tbody>
              {cohortAnalysisData.map((row, index) => (
                <tr key={index}>
                  <td className="p-2 font-medium">{row.cohort}</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">{row['Month 0']}</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">{row['Month 1']}</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">{row['Month 2']}</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">{row['Month 3']}</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">{row['Month 4']}</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">{row['Month 5']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WidgetWrapper>
    ),
    defaultSize: "full" as WidgetSize
  },
  {
    id: "ab-testing",
    name: "A/B Testing Results",
    description: "Results from recent A/B tests",
    category: "Analytics",
    component: (
      <WidgetWrapper
        title="A/B Testing Results"
        description="Results from recent A/B tests"
        chartId="ab-testing-chart"
        data={abTestingData}
        relatedWidgets={[]} // Will be updated after initialization
      >
        <div className="space-y-6">
          {/* Homepage Redesign */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Homepage Redesign</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-green-500">+12.4% Conversion</span>
                <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full">Winner</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Variant A (Control)</div>
                <div className="text-sm">2.8% Conversion</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Variant B (Test)</div>
                <div className="text-sm">3.15% Conversion</div>
              </div>
            </div>
          </div>
          
          {/* Checkout Flow */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Checkout Flow</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-green-500">+8.7% Completion</span>
                <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full">Winner</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Variant A (Control)</div>
                <div className="text-sm">62.4% Completion</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Variant B (Test)</div>
                <div className="text-sm">67.8% Completion</div>
              </div>
            </div>
          </div>
          
          {/* Product Page CTA */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Product Page CTA</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-red-500">-2.1% Clicks</span>
                <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded-full">Inconclusive</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Variant A (Control)</div>
                <div className="text-sm">14.2% Click Rate</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Variant B (Test)</div>
                <div className="text-sm">13.9% Click Rate</div>
              </div>
            </div>
          </div>
        </div>
      </WidgetWrapper>
    ),
    defaultSize: "medium" as WidgetSize
  }
];

// Now that analyticsWidgets is defined, we can create the getRelatedWidgets function
const getRelatedWidgets = (widgetId: string) => {
  const otherWidgets = analyticsWidgets.filter(w => w.id !== widgetId);
  return otherWidgets.slice(0, 2); // Return up to 2 related widgets
};

// Update the widget components with the correct related widgets
analyticsWidgets.forEach(widget => {
  if (widget.component.props.relatedWidgets && Array.isArray(widget.component.props.relatedWidgets)) {
    widget.component = React.cloneElement(widget.component, {
      relatedWidgets: getRelatedWidgets(widget.id)
    });
  }
});

export const defaultAnalyticsLayout = [
  {
    id: "analytics-metrics",
    title: "Analytics Metrics",
    widgets: ["sales-funnel", "cohort-analysis", "ab-testing"]
  }
];