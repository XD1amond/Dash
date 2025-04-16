import { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Dashboard | E-commerce Dashboard",
  description: "Dashboard overview with key performance metrics and analytics.",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        title="Dashboard"
        description="Overview of your e-commerce performance and key metrics."
      />
      
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Connect Your Data</CardTitle>
          <CardDescription>
            This is the core dashboard component that needs to be connected to your data source.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="text-center space-y-2">
            <p>The dashboard components are designed to be used with your own data.</p>
            <p className="text-sm text-muted-foreground">
              Import the components from <code className="bg-muted px-1 py-0.5 rounded">@/components/dashboard</code> and pass your data as props.
            </p>
          </div>
          <Link href="/demo">
            <Button className="mt-4">
              View Demo Implementation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Integration Example</CardTitle>
            <CardDescription>How to use the dashboard components</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
              <code>{`
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { fetchAnalyticsData } from "@/api/analytics"

export default function YourDashboard() {
  // Fetch your data from your API or database
  const {
    stats,
    revenueData,
    salesData,
    visitorsData,
    conversionData
  } = fetchAnalyticsData()

  return (
    <DashboardOverview
      stats={stats}
      revenueData={revenueData}
      salesData={salesData}
      visitorsData={visitorsData}
      conversionData={conversionData}
      onDateRangeChange={(range) => {
        // Fetch new data based on date range
      }}
      onExport={() => {
        // Handle export functionality
      }}
    />
  )
}
              `}</code>
            </pre>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Available Modules</CardTitle>
            <CardDescription>The dashboard includes these modules</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                <span>Analytics Dashboard</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                <span>Content Management System</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                <span>Order Management</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                <span>Customer Relationship Management</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                <span>Product Management</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                <span>Data Pipeline Visualization</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                <span>System Configuration</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}