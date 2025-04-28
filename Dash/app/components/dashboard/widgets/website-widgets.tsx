import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetDefinition, LayoutSection } from "@/components/dashboard/customizable-layout";

// Define website widgets
export const websiteWidgets: WidgetDefinition[] = [
  {
    id: "page-performance",
    name: "Page Performance",
    description: "Performance metrics for top pages",
    category: "Website",
    component: (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Page Performance</CardTitle>
          <CardDescription>
            Performance metrics for top pages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Homepage</span>
                <span className="font-medium">1.2s</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Product Listing</span>
                <span className="font-medium">1.8s</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: "70%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Product Detail</span>
                <span className="font-medium">2.1s</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Checkout</span>
                <span className="font-medium">1.5s</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "80%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    defaultSize: "large"
  },
  {
    id: "traffic-sources",
    name: "Traffic Sources",
    description: "Website traffic by source",
    category: "Website",
    component: (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Traffic Sources</CardTitle>
          <CardDescription>
            Website traffic by source
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[250px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span>Organic Search</span>
              </div>
              <span className="font-medium">42%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Direct</span>
              </div>
              <span className="font-medium">28%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span>Social Media</span>
              </div>
              <span className="font-medium">16%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                <span>Referral</span>
              </div>
              <span className="font-medium">10%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span>Paid Search</span>
              </div>
              <span className="font-medium">4%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    defaultSize: "medium"
  },
  {
    id: "user-behavior",
    name: "User Behavior",
    description: "User behavior metrics",
    category: "Website",
    component: (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>User Behavior</CardTitle>
          <CardDescription>
            User behavior metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    ),
    defaultSize: "medium"
  },
  {
    id: "device-breakdown",
    name: "Device Breakdown",
    description: "Traffic by device type",
    category: "Website",
    component: (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Device Breakdown</CardTitle>
          <CardDescription>
            Traffic by device type
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[200px]">
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
        </CardContent>
      </Card>
    ),
    defaultSize: "small"
  }
];

// Define default layout for website widgets
export const defaultWebsiteLayout: LayoutSection[] = [
  {
    id: "website-metrics",
    title: "Website Metrics",
    widgets: ["page-performance", "traffic-sources", "user-behavior", "device-breakdown"]
  }
];