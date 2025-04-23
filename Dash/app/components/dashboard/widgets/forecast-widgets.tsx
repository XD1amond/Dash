"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Define the widget size type
type WidgetSize = "small" | "medium" | "large" | "full";

export const forecastWidgets = [
  {
    id: "revenue-forecast",
    name: "Revenue Forecast",
    description: "Projected revenue for the next 6 months",
    category: "Forecast",
    component: (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Revenue Forecast</CardTitle>
          <CardDescription>
            Projected revenue for the next 6 months
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Current Month</div>
                <div className="text-2xl font-bold">$124,568</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Projected Growth</div>
                <div className="text-2xl font-bold text-green-500">+8.4%</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>July 2023</span>
                  <span className="font-medium">$135,032</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "60%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>August 2023</span>
                  <span className="font-medium">$142,874</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>September 2023</span>
                  <span className="font-medium">$156,432</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "72%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>October 2023</span>
                  <span className="font-medium">$178,965</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "82%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>November 2023</span>
                  <span className="font-medium">$198,543</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "90%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>December 2023</span>
                  <span className="font-medium">$215,876</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    defaultSize: "large" as WidgetSize
  },
  {
    id: "inventory-forecast",
    name: "Inventory Forecast",
    description: "Projected inventory needs",
    category: "Forecast",
    component: (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Inventory Forecast</CardTitle>
          <CardDescription>
            Projected inventory needs
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                <div className="flex justify-between text-sm">
                  <span>Wireless Headphones</span>
                  <span className="text-red-500">Order Now</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Smart Watches</span>
                  <span className="text-amber-500">Order in 7 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Bluetooth Speakers</span>
                  <span className="text-amber-500">Order in 14 days</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    defaultSize: "medium" as WidgetSize
  },
  {
    id: "trend-prediction",
    name: "Trend Prediction",
    description: "Predicted upcoming trends",
    category: "Forecast",
    component: (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Trend Prediction</CardTitle>
          <CardDescription>
            Predicted upcoming trends
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
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