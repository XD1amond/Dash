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
import { CustomizableLayout } from "@/components/dashboard/customizable-layout"
import { cn } from "@/lib/utils"

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
  type WidgetSize = "small" | "medium" | "large" | "full";
  
  interface WidgetDefinition {
    id: string
    name: string
    description: string
    component: React.ReactNode
    defaultSize: WidgetSize
  }
  
  const overviewWidgets: WidgetDefinition[] = [
    {
      id: "revenue-chart",
      name: "Revenue Trends",
      description: "Revenue trends over the selected period",
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
            variant="outline"
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

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Customize Stat Cards</CardTitle>
            <CardDescription>
              Select which stat cards to display on your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className={cn(
                    "cursor-pointer border-2",
                    selectedStats.includes(index) ? "border-primary" : "border-transparent"
                  )}
                  onClick={() => toggleStatCard(index)}
                >
                  <CardContent className="p-4">
                    <StatCard
                      title={stat.title}
                      value={stat.value}
                      change={stat.change}
                      changeType={stat.changeType}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats
            .filter((_, index) => selectedStats.includes(index))
            .map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                changeType={stat.changeType}
              />
            ))}
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="website">Website</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <CustomizableLayout
            availableWidgets={overviewWidgets}
            defaultLayout={defaultOverviewLayout}
            onLayoutChange={(layout) => console.log("Layout changed:", layout)}
          />
        </TabsContent>
        
        <TabsContent value="business" className="space-y-4">
          <CustomizableLayout
            availableWidgets={businessWidgets}
            defaultLayout={defaultBusinessLayout}
            onLayoutChange={(layout) => console.log("Layout changed:", layout)}
          />
        </TabsContent>
        
        <TabsContent value="website" className="space-y-4">
          <CustomizableLayout
            availableWidgets={websiteWidgets}
            defaultLayout={defaultWebsiteLayout}
            onLayoutChange={(layout) => console.log("Layout changed:", layout)}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}