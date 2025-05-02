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
          <CardTitle>Connect Your E-commerce Data</CardTitle>
          <CardDescription>
            Integrate your e-commerce platform with this dashboard in 3 simple steps
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4 border rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-medium mb-2">Implement Data Providers</h3>
              <p className="text-sm text-muted-foreground">
                Update the functions in <code className="bg-muted px-1 py-0.5 rounded">config/data.config.ts</code> to connect to your data sources
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 border rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-medium mb-2">Import Components</h3>
              <p className="text-sm text-muted-foreground">
                Import dashboard components from <code className="bg-muted px-1 py-0.5 rounded">@/components/dashboard</code> into your application
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 border rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-medium mb-2">Pass Your Data</h3>
              <p className="text-sm text-muted-foreground">
                Pass your fetched data as props to the dashboard components to display your e-commerce metrics
              </p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 mt-4">
            <Link href="/demo">
              <Button className="mt-4">
                View Demo Implementation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
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
import {
  fetchStatCardData,
  fetchRevenueData,
  fetchSalesByCategory,
  fetchVisitorsBySource,
  fetchConversionData
} from "@/config/data.config"
import { useState, useEffect } from "react"

export default function YourDashboard() {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  })
  const [data, setData] = useState({
    stats: [],
    revenueData: [],
    salesData: [],
    visitorsData: [],
    conversionData: []
  })

  // Fetch your data from your API or database
  useEffect(() => {
    const fetchData = async () => {
      const [stats, revenueData, salesData, visitorsData, conversionData] =
        await Promise.all([
          fetchStatCardData(),
          fetchRevenueData(dateRange.from, dateRange.to),
          fetchSalesByCategory(dateRange.from, dateRange.to),
          fetchVisitorsBySource(dateRange.from, dateRange.to),
          fetchConversionData(dateRange.from, dateRange.to)
        ])
      
      setData({
        stats,
        revenueData,
        salesData,
        visitorsData,
        conversionData
      })
    }
    
    fetchData()
  }, [dateRange])

  return (
    <DashboardOverview
      stats={data.stats}
      revenueData={data.revenueData}
      salesData={data.salesData}
      visitorsData={data.visitorsData}
      conversionData={data.conversionData}
      onDateRangeChange={(range) => setDateRange(range)}
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
            <CardTitle>E-commerce Integration</CardTitle>
            <CardDescription>Compatible with popular platforms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Supported Data Sources</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                  <span>REST APIs (Shopify, WooCommerce, Magento, etc.)</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                  <span>GraphQL APIs</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                  <span>Direct Database Connections</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                  <span>Analytics Platforms (Google Analytics, etc.)</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Available Modules</h3>
              <ul className="grid grid-cols-2 gap-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                  <span>Analytics Dashboard</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                  <span>Content Management</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                  <span>Order Management</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                  <span>Customer Management</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                  <span>Product Management</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                  <span>System Configuration</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Widget Customization</CardTitle>
          <CardDescription>Each dashboard widget accepts data props for easy integration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">
              All dashboard widgets are designed to be modular and accept data through props. This makes it easy to connect them to your e-commerce platform's data.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-2">Business Widgets</h3>
                <pre className="bg-muted p-3 rounded-md overflow-x-auto text-xs">
                  <code>{`
// Example of using a business widget
import { RevenueByChannelWidget } from
  "@/components/dashboard/widgets/business-widgets"
import { fetchRevenueByChannel } from
  "@/config/data.config"

// In your component:
const [channelData, setChannelData] = useState([])

useEffect(() => {
  fetchRevenueByChannel().then(setChannelData)
}, [])

return <RevenueByChannelWidget data={channelData} />
                  `}</code>
                </pre>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-2">Customer Widgets</h3>
                <pre className="bg-muted p-3 rounded-md overflow-x-auto text-xs">
                  <code>{`
// Example of using a customer widget
import { CustomerFeedbackWidget } from
  "@/components/dashboard/widgets/customer-widgets"
import { fetchCustomerFeedback } from
  "@/config/data.config"

// In your component:
const [feedbackData, setFeedbackData] = useState([])

useEffect(() => {
  fetchCustomerFeedback().then(setFeedbackData)
}, [])

return <CustomerFeedbackWidget data={feedbackData} />
                  `}</code>
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}