"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, Pencil, X, Plus, Move, Save } from "lucide-react"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { StatCard } from "@/components/dashboard/stat-card"
import { RevenueChart } from "@/components/dashboard/charts/revenue-chart"
import { SalesChart } from "@/components/dashboard/charts/sales-chart"
import { VisitorsChart } from "@/components/dashboard/charts/visitors-chart"
import { ConversionChart } from "@/components/dashboard/charts/conversion-chart"
import { CustomizableLayout, WidgetDefinition } from "@/components/dashboard/customizable-layout"
import { cn } from "@/lib/utils"

// Import widget modules
import { createStatCardWidgets } from "@/components/dashboard/widgets/stat-card-widgets"
import { analyticsWidgets, defaultAnalyticsLayout } from "@/components/dashboard/widgets/analytics-widgets"
import { performanceWidgets, defaultPerformanceLayout } from "@/components/dashboard/widgets/performance-widgets"
import { forecastWidgets, defaultForecastLayout } from "@/components/dashboard/widgets/forecast-widgets"

import { DateRange } from "react-day-picker"

interface DashboardOverviewProps {
  stats: Array<{
    title: string
    value: string
    change: number
    changeType: "increase" | "decrease"
  }>
  revenueData: any[]
  salesData: any[]
  visitorsData: any[]
  conversionData: any[]
  onDateRangeChange?: (range: { from: Date; to: Date }) => void
  onExport?: () => void
}

export function DashboardOverview({
  stats,
  revenueData,
  salesData,
  visitorsData,
  conversionData,
  onDateRangeChange,
  onExport
}: DashboardOverviewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [selectedStats, setSelectedStats] = useState<number[]>([0, 1, 2, 3]) // Default to showing all stats
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })
  // Create a state to hold all widgets for the overview tab
  const [allWidgets, setAllWidgets] = useState<WidgetDefinition[]>([])
  
  // Create stat card widgets
  const statCardWidgets = createStatCardWidgets(stats)

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range)
    if (range.from && range.to && onDateRangeChange) {
      onDateRangeChange({ from: range.from, to: range.to })
    }
  }
  
  // Toggle stat card selection
  const toggleStatCard = (index: number) => {
    setSelectedStats(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index)
      } else {
        return [...prev, index].sort()
      }
    })
  }

  // Define available widgets for customization
  // Import the WidgetDefinition type from customizable-layout
  // Define widget size type
  type WidgetSize = "small" | "medium" | "large" | "full";
  
  const overviewWidgets: WidgetDefinition[] = [
    {
      id: "revenue-chart",
      name: "Revenue Trends",
      description: "Revenue trends over the selected period",
      category: "Charts",
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
      category: "Charts",
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
      category: "Charts",
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
      category: "Charts",
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
  ]

  // Define business widgets
  const businessWidgets: WidgetDefinition[] = [
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
  ]

  // Define website widgets
  const websiteWidgets: WidgetDefinition[] = [
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
  ]

  // Define marketing widgets
  const marketingWidgets: WidgetDefinition[] = [
    {
      id: "campaign-performance",
      name: "Campaign Performance",
      description: "Performance metrics for marketing campaigns",
      category: "Marketing",
      component: (
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>
              Performance metrics for marketing campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Summer Sale</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-green-500">4.2% CTR</span>
                    <span className="text-sm text-blue-500">$12.40 CPC</span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "78%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">New Collection</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-green-500">3.8% CTR</span>
                    <span className="text-sm text-blue-500">$9.20 CPC</span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Holiday Special</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-green-500">5.1% CTR</span>
                    <span className="text-sm text-blue-500">$14.80 CPC</span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "82%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
      defaultSize: "large"
    },
    {
      id: "social-media-performance",
      name: "Social Media Performance",
      description: "Performance metrics for social media channels",
      category: "Marketing",
      component: (
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>
              Performance by channel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span>Instagram</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">12.4K</span>
                  <span className="text-xs text-green-500">+8%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-sky-500 mr-2"></div>
                  <span>Twitter</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">8.7K</span>
                  <span className="text-xs text-green-500">+12%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span>YouTube</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">4.2K</span>
                  <span className="text-xs text-green-500">+15%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-700 mr-2"></div>
                  <span>Facebook</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">9.1K</span>
                  <span className="text-xs text-red-500">-2%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
      defaultSize: "medium"
    },
    {
      id: "email-metrics",
      name: "Email Campaign Metrics",
      description: "Performance metrics for email campaigns",
      category: "Marketing",
      component: (
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Email Campaigns</CardTitle>
            <CardDescription>
              Performance metrics for email campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Open Rate</div>
                  <div className="text-2xl font-bold">24.8%</div>
                  <div className="text-xs text-green-500">+2.1% vs last month</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Click Rate</div>
                  <div className="text-2xl font-bold">3.6%</div>
                  <div className="text-xs text-green-500">+0.8% vs last month</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Conversion</div>
                  <div className="text-2xl font-bold">2.4%</div>
                  <div className="text-xs text-green-500">+0.3% vs last month</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Unsubscribe</div>
                  <div className="text-2xl font-bold">0.8%</div>
                  <div className="text-xs text-red-500">+0.1% vs last month</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
      defaultSize: "medium"
    }
  ];

  // Define product performance widgets
  const productWidgets: WidgetDefinition[] = [
    {
      id: "top-products",
      name: "Top Products",
      description: "Best selling products by revenue",
      category: "Products",
      component: (
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>
              Best selling products by revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-muted rounded mr-3"></div>
                  <div>
                    <div className="font-medium">Wireless Headphones</div>
                    <div className="text-xs text-muted-foreground">Electronics</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">$24,500</div>
                  <div className="text-xs text-green-500">+12%</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-muted rounded mr-3"></div>
                  <div>
                    <div className="font-medium">Smart Watch</div>
                    <div className="text-xs text-muted-foreground">Electronics</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">$18,300</div>
                  <div className="text-xs text-green-500">+8%</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-muted rounded mr-3"></div>
                  <div>
                    <div className="font-medium">Designer Bag</div>
                    <div className="text-xs text-muted-foreground">Fashion</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">$12,750</div>
                  <div className="text-xs text-red-500">-3%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
      defaultSize: "medium"
    },
    {
      id: "inventory-status",
      name: "Inventory Status",
      description: "Current inventory levels by category",
      category: "Products",
      component: (
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>
              Current inventory levels by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Electronics</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "78%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Clothing</span>
                  <span className="font-medium text-amber-500">42%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "42%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Home & Kitchen</span>
                  <span className="font-medium">65%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Beauty</span>
                  <span className="font-medium text-red-500">18%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: "18%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
      defaultSize: "medium"
    },
    {
      id: "product-returns",
      name: "Product Returns",
      description: "Return rate by product category",
      category: "Products",
      component: (
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Product Returns</CardTitle>
            <CardDescription>
              Return rate by product category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span>Electronics</span>
                </div>
                <span className="font-medium">4.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span>Clothing</span>
                </div>
                <span className="font-medium">8.7%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Home & Kitchen</span>
                </div>
                <span className="font-medium">2.1%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span>Beauty</span>
                </div>
                <span className="font-medium">3.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
      defaultSize: "small"
    }
  ];

  // Define customer insights widgets
  const customerWidgets: WidgetDefinition[] = [
    {
      id: "customer-segments",
      name: "Customer Segments",
      description: "Distribution of customers by segment",
      category: "Customers",
      component: (
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
            <CardDescription>
              Distribution of customers by segment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <span>Loyal Customers</span>
                </div>
                <span className="font-medium">32%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span>Regular Shoppers</span>
                </div>
                <span className="font-medium">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>New Customers</span>
                </div>
                <span className="font-medium">18%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                  <span>One-time Shoppers</span>
                </div>
                <span className="font-medium">5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
      defaultSize: "medium"
    },
    {
      id: "customer-satisfaction",
      name: "Customer Satisfaction",
      description: "Customer satisfaction metrics",
      category: "Customers",
      component: (
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Customer Satisfaction</CardTitle>
            <CardDescription>
              Customer satisfaction metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[200px]">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-4xl font-bold">4.7/5.0</div>
              <div className="flex items-center mt-2">
                {Array(5).fill(0).map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-yellow-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-sm text-muted-foreground mt-2">Based on 1,248 reviews</div>
              <div className="text-sm text-green-500 mt-1">+0.3 from last quarter</div>
            </div>
          </CardContent>
        </Card>
      ),
      defaultSize: "small"
    },
    {
      id: "geographic-distribution",
      name: "Geographic Distribution",
      description: "Customer distribution by region",
      category: "Customers",
      component: (
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>
              Customer distribution by region
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>North America</span>
                  <span className="font-medium">42%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "42%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Europe</span>
                  <span className="font-medium">28%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "28%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Asia Pacific</span>
                  <span className="font-medium">18%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "18%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Latin America</span>
                  <span className="font-medium">8%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "8%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Middle East & Africa</span>
                  <span className="font-medium">4%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "4%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
      defaultSize: "large"
    }
  ];

  // Define default layouts
  const defaultOverviewLayout = [
    {
      id: "stats",
      title: "Key Metrics",
      widgets: ["revenue-chart", "sales-chart", "visitors-chart", "conversion-chart"]
    }
  ]

  const defaultBusinessLayout = [
    {
      id: "business-metrics",
      title: "Business Metrics",
      widgets: ["revenue-growth", "profit-margins", "customer-acquisition", "lifetime-value"]
    }
  ]

  const defaultWebsiteLayout = [
    {
      id: "website-metrics",
      title: "Website Metrics",
      widgets: ["page-performance", "traffic-sources", "user-behavior", "device-breakdown"]
    }
  ]
  
  const defaultMarketingLayout = [
    {
      id: "marketing-metrics",
      title: "Marketing Metrics",
      widgets: ["campaign-performance", "social-media-performance", "email-metrics"]
    }
  ]
  
  const defaultProductLayout = [
    {
      id: "product-metrics",
      title: "Product Metrics",
      widgets: ["top-products", "inventory-status", "product-returns"]
    }
  ]
  
  const defaultCustomerLayout = [
    {
      id: "customer-metrics",
      title: "Customer Metrics",
      widgets: ["customer-segments", "customer-satisfaction", "geographic-distribution"]
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your e-commerce performance and key metrics
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="mr-2"
          >
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Layout
              </>
            ) : (
              <>
                <Pencil className="mr-2 h-4 w-4" />
                Customize
              </>
            )}
          </Button>
          <DateRangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            align="end"
          />
          <Button variant="outline" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stat cards are now part of the customizable layout */}

      <Tabs
        defaultValue="overview"
        className="space-y-4"
        onValueChange={(value) => {
          // When switching to overview tab, combine all widgets
          if (value === "overview") {
            const combined = [
              ...statCardWidgets,
              ...overviewWidgets,
              ...businessWidgets,
              ...websiteWidgets,
              ...marketingWidgets,
              ...productWidgets,
              ...customerWidgets,
              ...analyticsWidgets,
              ...performanceWidgets,
              ...forecastWidgets
            ];
            setAllWidgets(combined);
          }
        }}
      >
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="website">Website</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <CustomizableLayout
            availableWidgets={allWidgets.length > 0 ? allWidgets : [
              ...statCardWidgets,
              ...overviewWidgets,
              ...businessWidgets,
              ...websiteWidgets,
              ...marketingWidgets,
              ...productWidgets,
              ...customerWidgets,
              ...analyticsWidgets,
              ...performanceWidgets,
              ...forecastWidgets
            ]}
            defaultLayout={[
              {
                id: "stat-cards",
                title: "Key Metrics",
                widgets: statCardWidgets.map(widget => widget.id)
              },
              ...defaultOverviewLayout
            ]}
            onLayoutChange={(layout) => console.log("Layout changed:", layout)}
            isEditingExternal={isEditing}
            onEditingChange={setIsEditing}
          />
        </TabsContent>
        
        <TabsContent value="business" className="space-y-4">
          <CustomizableLayout
            availableWidgets={businessWidgets}
            defaultLayout={defaultBusinessLayout}
            onLayoutChange={(layout) => console.log("Layout changed:", layout)}
            isEditingExternal={isEditing}
            onEditingChange={setIsEditing}
          />
        </TabsContent>
        
        <TabsContent value="website" className="space-y-4">
          <CustomizableLayout
            availableWidgets={websiteWidgets}
            defaultLayout={defaultWebsiteLayout}
            onLayoutChange={(layout) => console.log("Layout changed:", layout)}
            isEditingExternal={isEditing}
            onEditingChange={setIsEditing}
          />
        </TabsContent>
        
        <TabsContent value="marketing" className="space-y-4">
          <CustomizableLayout
            availableWidgets={marketingWidgets}
            defaultLayout={defaultMarketingLayout}
            onLayoutChange={(layout) => console.log("Layout changed:", layout)}
            isEditingExternal={isEditing}
            onEditingChange={setIsEditing}
          />
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <CustomizableLayout
            availableWidgets={productWidgets}
            defaultLayout={defaultProductLayout}
            onLayoutChange={(layout) => console.log("Layout changed:", layout)}
            isEditingExternal={isEditing}
            onEditingChange={setIsEditing}
          />
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-4">
          <CustomizableLayout
            availableWidgets={customerWidgets}
            defaultLayout={defaultCustomerLayout}
            onLayoutChange={(layout) => console.log("Layout changed:", layout)}
            isEditingExternal={isEditing}
            onEditingChange={setIsEditing}
          />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <CustomizableLayout
            availableWidgets={analyticsWidgets}
            defaultLayout={defaultAnalyticsLayout}
            onLayoutChange={(layout) => console.log("Layout changed:", layout)}
            isEditingExternal={isEditing}
            onEditingChange={setIsEditing}
          />
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <CustomizableLayout
            availableWidgets={performanceWidgets}
            defaultLayout={defaultPerformanceLayout}
            onLayoutChange={(layout) => console.log("Layout changed:", layout)}
            isEditingExternal={isEditing}
            onEditingChange={setIsEditing}
          />
        </TabsContent>
        
        <TabsContent value="forecast" className="space-y-4">
          <CustomizableLayout
            availableWidgets={forecastWidgets}
            defaultLayout={defaultForecastLayout}
            onLayoutChange={(layout) => console.log("Layout changed:", layout)}
            isEditingExternal={isEditing}
            onEditingChange={setIsEditing}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}