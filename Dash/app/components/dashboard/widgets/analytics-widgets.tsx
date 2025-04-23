"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Define the widget size type
type WidgetSize = "small" | "medium" | "large" | "full";

export const analyticsWidgets = [
  {
    id: "sales-funnel",
    name: "Sales Funnel",
    description: "Conversion funnel from visit to purchase",
    category: "Analytics",
    component: (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Sales Funnel</CardTitle>
          <CardDescription>
            Conversion funnel from visit to purchase
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <div className="space-y-8 pt-4">
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Visits</span>
                <span className="text-sm">24,500</span>
              </div>
              <div className="h-8 bg-blue-100 dark:bg-blue-900/30 w-full rounded-md"></div>
            </div>
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Product Views</span>
                <span className="text-sm">18,300 (74.7%)</span>
              </div>
              <div className="h-8 bg-blue-200 dark:bg-blue-800/40 w-[75%] rounded-md"></div>
            </div>
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Add to Cart</span>
                <span className="text-sm">7,350 (30.0%)</span>
              </div>
              <div className="h-8 bg-blue-300 dark:bg-blue-700/50 w-[30%] rounded-md"></div>
            </div>
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Checkout</span>
                <span className="text-sm">4,900 (20.0%)</span>
              </div>
              <div className="h-8 bg-blue-400 dark:bg-blue-600/60 w-[20%] rounded-md"></div>
            </div>
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Purchase</span>
                <span className="text-sm">3,675 (15.0%)</span>
              </div>
              <div className="h-8 bg-blue-500 dark:bg-blue-500/70 w-[15%] rounded-md"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    defaultSize: "medium" as WidgetSize
  },
  {
    id: "cohort-analysis",
    name: "Cohort Analysis",
    description: "Customer retention by cohort",
    category: "Analytics",
    component: (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Cohort Analysis</CardTitle>
          <CardDescription>
            Customer retention by cohort
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                <tr>
                  <td className="p-2 font-medium">Jan 2023</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">100%</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">64%</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">48%</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">42%</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">38%</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">35%</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Feb 2023</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">100%</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">68%</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">52%</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">45%</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">41%</td>
                  <td className="p-2 text-center"></td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Mar 2023</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">100%</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">72%</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">56%</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">48%</td>
                  <td className="p-2 text-center"></td>
                  <td className="p-2 text-center"></td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Apr 2023</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">100%</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">75%</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">58%</td>
                  <td className="p-2 text-center"></td>
                  <td className="p-2 text-center"></td>
                  <td className="p-2 text-center"></td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">May 2023</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">100%</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">78%</td>
                  <td className="p-2 text-center"></td>
                  <td className="p-2 text-center"></td>
                  <td className="p-2 text-center"></td>
                  <td className="p-2 text-center"></td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Jun 2023</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">100%</td>
                  <td className="p-2 text-center"></td>
                  <td className="p-2 text-center"></td>
                  <td className="p-2 text-center"></td>
                  <td className="p-2 text-center"></td>
                  <td className="p-2 text-center"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    ),
    defaultSize: "full" as WidgetSize
  },
  {
    id: "ab-testing",
    name: "A/B Testing Results",
    description: "Results from recent A/B tests",
    category: "Analytics",
    component: (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>A/B Testing Results</CardTitle>
          <CardDescription>
            Results from recent A/B tests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
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
        </CardContent>
      </Card>
    ),
    defaultSize: "medium" as WidgetSize
  }
];

export const defaultAnalyticsLayout = [
  {
    id: "analytics-metrics",
    title: "Analytics Metrics",
    widgets: ["sales-funnel", "cohort-analysis", "ab-testing"]
  }
];