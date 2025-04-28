import React from 'react'; // Added React import
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
      category: "Overview", // Changed category for clarity
      component: (
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>
              Revenue trends over the selected period
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <RevenueChart data={revenueData} />
          </CardContent>
        </Card>
      ),
      defaultSize: "large"
    },
    {
      id: "sales-chart",
      name: "Sales Distribution",
      description: "Sales distribution by category",
      category: "Overview",
      component: (
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Sales</CardTitle>
            <CardDescription>
              Sales distribution by category
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <SalesChart data={salesData} />
          </CardContent>
        </Card>
      ),
      defaultSize: "medium"
    },
    {
      id: "visitors-chart",
      name: "Visitors",
      description: "Website traffic sources",
      category: "Overview",
      component: (
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Visitors</CardTitle>
            <CardDescription>
              Website traffic sources
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <VisitorsChart data={visitorsData} />
          </CardContent>
        </Card>
      ),
      defaultSize: "medium"
    },
    {
      id: "conversion-chart",
      name: "Conversion Rate",
      description: "Conversion rate over time",
      category: "Overview",
      component: (
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
            <CardDescription>
              Conversion rate over time
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ConversionChart data={conversionData} />
          </CardContent>
        </Card>
      ),
      defaultSize: "large"
    }
  ];
}

// Define default layout for overview widgets
export const defaultOverviewLayout: LayoutSection[] = [
  {
    id: "overview-metrics", // Renamed ID for clarity
    title: "Overview Metrics",
    widgets: ["revenue-chart", "sales-chart", "visitors-chart", "conversion-chart"] // Use IDs defined above
  }
];