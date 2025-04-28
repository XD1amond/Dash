import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetDefinition, LayoutSection } from "@/components/dashboard/customizable-layout";

// Define business widgets
export const businessWidgets: WidgetDefinition[] = [
  {
    id: "revenue-growth",
    name: "Revenue Growth",
    description: "Year-over-year revenue growth",
    category: "Business",
    component: (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Revenue Growth</CardTitle>
          <CardDescription>
            Year-over-year revenue growth
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[200px]">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-4xl font-bold text-green-500">+24.8%</div>
            <div className="text-sm text-muted-foreground mt-2">Compared to last year</div>
          </div>
        </CardContent>
      </Card>
    ),
    defaultSize: "medium"
  },
  {
    id: "profit-margins",
    name: "Profit Margins",
    description: "Profit margins by product category",
    category: "Business",
    component: (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Profit Margins</CardTitle>
          <CardDescription>
            Profit margins by product category
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[200px]">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Electronics</span>
                <span className="font-medium">32%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "32%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Clothing</span>
                <span className="font-medium">48%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "48%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Home & Kitchen</span>
                <span className="font-medium">27%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "27%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    defaultSize: "medium"
  },
  {
    id: "customer-acquisition",
    name: "Customer Acquisition",
    description: "Cost of customer acquisition",
    category: "Business",
    component: (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Customer Acquisition</CardTitle>
          <CardDescription>
            Cost of customer acquisition
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[200px]">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-4xl font-bold">$42.35</div>
            <div className="text-sm text-muted-foreground mt-2">Average CAC</div>
            <div className="text-sm text-green-500 mt-1">-12% from last quarter</div>
          </div>
        </CardContent>
      </Card>
    ),
    defaultSize: "medium"
  },
  {
    id: "lifetime-value",
    name: "Customer Lifetime Value",
    description: "Average customer lifetime value",
    category: "Business",
    component: (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Customer Lifetime Value</CardTitle>
          <CardDescription>
            Average customer lifetime value
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[200px]">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-4xl font-bold">$328.79</div>
            <div className="text-sm text-muted-foreground mt-2">Average CLV</div>
            <div className="text-sm text-green-500 mt-1">+8% from last quarter</div>
          </div>
        </CardContent>
      </Card>
    ),
    defaultSize: "medium"
  }
];

// Define default layout for business widgets
export const defaultBusinessLayout: LayoutSection[] = [
  {
    id: "business-metrics",
    title: "Business Metrics",
    widgets: ["revenue-growth", "profit-margins", "customer-acquisition", "lifetime-value"]
  }
];