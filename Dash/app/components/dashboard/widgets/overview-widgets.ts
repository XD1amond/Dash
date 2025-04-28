import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RevenueChart } from "@/components/dashboard/charts/revenue-chart"
import { SalesChart } from "@/components/dashboard/charts/sales-chart"
import { VisitorsChart } from "@/components/dashboard/charts/visitors-chart"
import { ConversionChart } from "@/components/dashboard/charts/conversion-chart"
import { WidgetDefinition, LayoutSection } from "@/components/dashboard/customizable-layout"

// Function to create overview widgets, accepting necessary data props
export function createOverviewWidgets(
  revenueData: any[],
  salesData: any[],
  visitorsData: any[],
  conversionData: any[]
): WidgetDefinition[] {
  return [
    {
      id: "revenue-chart",
      name: "Revenue Trends",
      description: "Revenue trends over the selected period",
      category: "Overview",
      component: React.createElement(
        Card,
        { className: "col-span-4" },
        React.createElement(
          CardHeader,
          null,
          React.createElement(CardTitle, null, "Revenue"),
          React.createElement(CardDescription, null, "Revenue trends over the selected period")
        ),
        React.createElement(
          CardContent,
          { className: "h-[300px]" },
          React.createElement(RevenueChart, { data: revenueData })
        )
      ),
      defaultSize: "large"
    },
    {
      id: "sales-chart",
      name: "Sales Distribution",
      description: "Sales distribution by category",
      category: "Overview",
      component: React.createElement(
        Card,
        { className: "col-span-3" },
        React.createElement(
          CardHeader,
          null,
          React.createElement(CardTitle, null, "Sales"),
          React.createElement(CardDescription, null, "Sales distribution by category")
        ),
        React.createElement(
          CardContent,
          { className: "h-[300px]" },
          React.createElement(SalesChart, { data: salesData })
        )
      ),
      defaultSize: "medium"
    },
    {
      id: "visitors-chart",
      name: "Visitors",
      description: "Website traffic sources",
      category: "Overview",
      component: React.createElement(
        Card,
        { className: "col-span-3" },
        React.createElement(
          CardHeader,
          null,
          React.createElement(CardTitle, null, "Visitors"),
          React.createElement(CardDescription, null, "Website traffic sources")
        ),
        React.createElement(
          CardContent,
          { className: "h-[300px]" },
          React.createElement(VisitorsChart, { data: visitorsData })
        )
      ),
      defaultSize: "medium"
    },
    {
      id: "conversion-chart",
      name: "Conversion Rate",
      description: "Conversion rate over time",
      category: "Overview",
      component: React.createElement(
        Card,
        { className: "col-span-4" },
        React.createElement(
          CardHeader,
          null,
          React.createElement(CardTitle, null, "Conversion Rate"),
          React.createElement(CardDescription, null, "Conversion rate over time")
        ),
        React.createElement(
          CardContent,
          { className: "h-[300px]" },
          React.createElement(ConversionChart, { data: conversionData })
        )
      ),
      defaultSize: "large"
    }
  ];
}

// Define default layout for overview widgets
export const defaultOverviewLayout: LayoutSection[] = [
  {
    id: "overview-metrics",
    title: "Overview Metrics",
    widgets: ["revenue-chart", "sales-chart", "visitors-chart", "conversion-chart"]
  }
];