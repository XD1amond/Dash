"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Define the widget size type
type WidgetSize = "small" | "medium" | "large" | "full";

export const performanceWidgets = [
  {
    id: "performance-overview",
    name: "Performance Overview",
    description: "Pinned",
    category: "Performance",
    component: (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>
            Pinned
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Avg. Order Value</div>
              <div className="text-2xl font-bold">$86.42</div>
              <div className="text-xs text-green-500">+4.3% vs last month</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Conversion Rate</div>
              <div className="text-2xl font-bold">3.2%</div>
              <div className="text-xs text-green-500">+0.4% vs last month</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Cart Abandonment</div>
              <div className="text-2xl font-bold">68.7%</div>
              <div className="text-xs text-red-500">+1.2% vs last month</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Return Rate</div>
              <div className="text-2xl font-bold">4.8%</div>
              <div className="text-xs text-green-500">-0.3% vs last month</div>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    defaultSize: "large" as WidgetSize
  },
  {
    id: "marketing-roi",
    name: "Marketing ROI",
    description: "Return on investment by channel",
    category: "Performance",
    component: (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Marketing ROI</CardTitle>
          <CardDescription>
            Return on investment by channel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Paid Search</span>
                <span className="font-medium text-green-500">342%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Social Media</span>
                <span className="font-medium text-green-500">285%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "72%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Email Marketing</span>
                <span className="font-medium text-green-500">420%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "92%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Affiliate</span>
                <span className="font-medium text-green-500">178%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "45%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Display Ads</span>
                <span className="font-medium text-amber-500">124%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "32%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    defaultSize: "medium" as WidgetSize
  },
  {
    id: "product-performance",
    name: "Product Performance",
    description: "Performance metrics by product category",
    category: "Performance",
    component: (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Product Performance</CardTitle>
          <CardDescription>
            Performance metrics by product category
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                <tr className="border-b">
                  <td className="p-2 font-medium">Electronics</td>
                  <td className="p-2 text-right">$245,678</td>
                  <td className="p-2 text-right">1,245</td>
                  <td className="p-2 text-right">$78,617</td>
                  <td className="p-2 text-right text-green-500">32%</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Clothing</td>
                  <td className="p-2 text-right">$187,432</td>
                  <td className="p-2 text-right">3,876</td>
                  <td className="p-2 text-right">$89,967</td>
                  <td className="p-2 text-right text-green-500">48%</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Home & Kitchen</td>
                  <td className="p-2 text-right">$143,765</td>
                  <td className="p-2 text-right">2,154</td>
                  <td className="p-2 text-right">$38,816</td>
                  <td className="p-2 text-right text-green-500">27%</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Beauty</td>
                  <td className="p-2 text-right">$98,432</td>
                  <td className="p-2 text-right">4,321</td>
                  <td className="p-2 text-right">$42,326</td>
                  <td className="p-2 text-right text-green-500">43%</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Sports</td>
                  <td className="p-2 text-right">$76,543</td>
                  <td className="p-2 text-right">1,876</td>
                  <td className="p-2 text-right">$24,493</td>
                  <td className="p-2 text-right text-green-500">32%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    ),
    defaultSize: "medium" as WidgetSize
  }
];

export const defaultPerformanceLayout = [
  {
    id: "performance-metrics",
    title: "Performance Metrics",
    widgets: ["performance-overview", "marketing-roi", "product-performance"]
  }
];