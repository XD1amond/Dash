import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RevenueChart } from "@/components/dashboard/charts/revenue-chart"
import { SalesChart } from "@/components/dashboard/charts/sales-chart"
import { VisitorsChart } from "@/components/dashboard/charts/visitors-chart"
import { ConversionChart } from "@/components/dashboard/charts/conversion-chart"
import { WidgetDefinition, LayoutSection } from "@/components/dashboard/customizable-layout"
import { WidgetWrapper } from "./widget-components"

// Get related widgets for a given widget
const getRelatedWidgets = (widgetId: string, allWidgets: WidgetDefinition[]) => {
  const otherWidgets = allWidgets.filter(w => w.id !== widgetId);
  return otherWidgets.slice(0, 2); // Return up to 2 related widgets
};

// Function to create overview widgets, accepting necessary data props
export function createOverviewWidgets(
  revenueData: any[],
  salesData: any[],
  visitorsData: any[],
  conversionData: any[]
): WidgetDefinition[] {
  // First create widget definitions without components
  const widgets: WidgetDefinition[] = [
    {
      id: "revenue-chart",
      name: "Revenue Trends",
      description: "Revenue trends over the selected period",
      category: "Overview",
      component: null as any, // Will be filled in later
      defaultSize: "large"
    },
    {
      id: "sales-chart",
      name: "Sales Distribution",
      description: "Sales distribution by category",
      category: "Overview",
      component: null as any, // Will be filled in later
      defaultSize: "medium"
    },
    {
      id: "visitors-chart",
      name: "Visitors",
      description: "Website traffic sources",
      category: "Overview",
      component: null as any, // Will be filled in later
      defaultSize: "medium"
    },
    {
      id: "conversion-chart",
      name: "Conversion Rate",
      description: "Conversion rate over time",
      category: "Overview",
      component: null as any, // Will be filled in later
      defaultSize: "large"
    }
  ];

  // Now that we have all widgets, we can set up the components with proper related widgets
  // Create the components with proper props
  const revenueComponent = React.createElement(
    "div",
    { className: "h-[300px]" },
    React.createElement(RevenueChart, { data: revenueData })
  );
  
  const salesComponent = React.createElement(
    "div",
    { className: "h-[300px]" },
    React.createElement(SalesChart, { data: salesData })
  );
  
  const visitorsComponent = React.createElement(
    "div",
    { className: "h-[300px]" },
    React.createElement(VisitorsChart, { data: visitorsData })
  );
  
  const conversionComponent = React.createElement(
    "div",
    { className: "h-[300px]" },
    React.createElement(ConversionChart, { data: conversionData })
  );

  // Now assign the wrapped components
  widgets[0].component = React.createElement(
    WidgetWrapper,
    {
      title: "Revenue",
      description: "Revenue trends over the selected period",
      chartId: "revenue-chart-expanded",
      data: revenueData,
      relatedWidgets: getRelatedWidgets("revenue-chart", widgets),
      children: revenueComponent
    }
  );

  widgets[1].component = React.createElement(
    WidgetWrapper,
    {
      title: "Sales",
      description: "Sales distribution by category",
      chartId: "sales-chart-expanded",
      data: salesData,
      relatedWidgets: getRelatedWidgets("sales-chart", widgets),
      children: salesComponent
    }
  );

  widgets[2].component = React.createElement(
    WidgetWrapper,
    {
      title: "Visitors",
      description: "Website traffic sources",
      chartId: "visitors-chart-expanded",
      data: visitorsData,
      relatedWidgets: getRelatedWidgets("visitors-chart", widgets),
      children: visitorsComponent
    }
  );

  widgets[3].component = React.createElement(
    WidgetWrapper,
    {
      title: "Conversion Rate",
      description: "Conversion rate over time",
      chartId: "conversion-chart-expanded",
      data: conversionData,
      relatedWidgets: getRelatedWidgets("conversion-chart", widgets),
      children: conversionComponent
    }
  );

  return widgets;
}

// Define default layout for overview widgets
export const defaultOverviewLayout: LayoutSection[] = [
  {
    id: "overview-metrics",
    title: "Overview Metrics",
    widgets: ["revenue-chart", "sales-chart", "visitors-chart", "conversion-chart"]
  }
];