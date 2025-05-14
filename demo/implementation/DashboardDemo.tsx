"use client"

import React, { useState, useEffect } from "react"
import { DashboardOverview } from "../../Dash/app/components/dashboard/dashboard-overview"
import { CMSDashboard } from "../../Dash/app/components/cms/cms-dashboard"
import { OrderManagement } from "../../Dash/app/components/orders/order-management"
import { CustomerManagement } from "../../Dash/app/components/crm/customer-management"
import { ProductManagement } from "../../Dash/app/components/products/product-management"
import { SystemConfig } from "../../Dash/app/components/settings/system-config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../Dash/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../Dash/app/components/ui/tabs"
import { Button } from "../../Dash/app/components/ui/button"
// Import the data services
import { createMockServices } from "../../Dash/config/data"

// Import analytics data generators
import {
  generateRevenueData,
  generateSalesData,
  generateVisitorsData,
  generateConversionData,
  generateStatCardData,
  generateAllAnalyticsData
} from "../data/analytics-data"

// Import widget data connectors
import {
  createAnalyticsWidgetsWithDemoData,
  createBusinessWidgetsWithDemoData,
  createCustomerWidgetsWithDemoData,
  createForecastWidgetsWithDemoData
} from "../utils/widget-data-connector"

// Import legacy mock data generators for components not yet updated
import {
  generateOrders,
  generateCustomers,
  generateCustomerSegments,
  generateProducts,
  generateProductCategories,
  generatePages,
  generateTemplates,
  generateMediaItems,
  generateSystemConfig
} from "../data/mock-data"

export function DashboardDemo() {
  // State for active tab
  const [activeTab, setActiveTab] = useState("analytics")
  
  // State for date range
  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date
  }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })

  // Create data services with mock data
  const [dataServices] = useState(() => {
    // Create mock services with a 500ms delay
    const services = createMockServices(500);
    
    // Instead of replacing the entire analytics service, we'll monkey-patch
    // just the methods we want to override while preserving the original object
    
    // Store original methods
    const originalFetchRevenueData = services.analytics.fetchRevenueData;
    const originalFetchSalesByCategory = services.analytics.fetchSalesByCategory;
    const originalFetchVisitorsBySource = services.analytics.fetchVisitorsBySource;
    const originalFetchConversionData = services.analytics.fetchConversionData;
    const originalFetchStatCardData = services.analytics.fetchStatCardData;
    
    // Override fetchRevenueData to return our custom mock data
    services.analytics.fetchRevenueData = async (from: Date, to: Date, interval: 'day' | 'week' | 'month' = 'month', page = 1, pageSize = 20) => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      // Use the generator function from analytics-data.ts
      const revenueData = generateRevenueData(12);
      
      // Map to the expected format
      const data = revenueData.map(item => ({
        date: `2024-${item.name}`, // Format as expected by the dashboard
        revenue: item.revenue
      }));
      
      return {
        data,
        pagination: {
          page,
          pageSize,
          totalItems: data.length,
          totalPages: Math.ceil(data.length / pageSize),
          total: data.length,
          hasNextPage: page < Math.ceil(data.length / pageSize),
          hasPreviousPage: page > 1
        }
      };
    };
    
    // Override fetchSalesByCategory to return our custom mock data
    services.analytics.fetchSalesByCategory = async (from: Date, to: Date, page = 1, pageSize = 20) => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      // Use the generator function from analytics-data.ts
      const salesData = generateSalesData();
      
      return {
        data: salesData,
        pagination: {
          page,
          pageSize,
          totalItems: salesData.length,
          totalPages: Math.ceil(salesData.length / pageSize),
          total: salesData.length,
          hasNextPage: page < Math.ceil(salesData.length / pageSize),
          hasPreviousPage: page > 1
        }
      };
    };
    
    // Override fetchVisitorsBySource to return our custom mock data
    services.analytics.fetchVisitorsBySource = async (from: Date, to: Date, page = 1, pageSize = 20) => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      // Use the generator function from analytics-data.ts
      const visitorsData = generateVisitorsData();
      
      return {
        data: visitorsData,
        pagination: {
          page,
          pageSize,
          totalItems: visitorsData.length,
          totalPages: Math.ceil(visitorsData.length / pageSize),
          total: visitorsData.length,
          hasNextPage: page < Math.ceil(visitorsData.length / pageSize),
          hasPreviousPage: page > 1
        }
      };
    };
    
    // Override fetchConversionData to return our custom mock data
    services.analytics.fetchConversionData = async (from: Date, to: Date, interval: 'day' | 'week' | 'month' = 'month', page = 1, pageSize = 20) => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      // Use the generator function from analytics-data.ts
      const conversionData = generateConversionData(12);
      
      // Map to the expected format
      const data = conversionData.map(item => ({
        date: `2024-${item.name}`, // Format as expected by the dashboard
        conversion: item.conversion
      }));
      
      return {
        data,
        pagination: {
          page,
          pageSize,
          totalItems: data.length,
          totalPages: Math.ceil(data.length / pageSize),
          total: data.length,
          hasNextPage: page < Math.ceil(data.length / pageSize),
          hasPreviousPage: page > 1
        }
      };
    };
    
    // Override fetchStatCardData to return our custom mock data
    services.analytics.fetchStatCardData = async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      // Use the generator function from analytics-data.ts
      return generateStatCardData();
    };
    
    // Note: We're only using the analytics service since it's the only one we know exists
    // The other tabs will use the legacy mock data generators
    
    return services;
  });

  // State for analytics data
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [salesData, setSalesData] = useState<any[]>([])
  const [visitorsData, setVisitorsData] = useState<any[]>([])
  const [conversionData, setConversionData] = useState<any[]>([])
  const [statCardData, setStatCardData] = useState<any[]>([])

  // State for other data
  const [orders, setOrders] = useState(generateOrders(10))
  const [customers, setCustomers] = useState(generateCustomers(10))
  const [products, setProducts] = useState(generateProducts(10))

  // Fetch data when component mounts or date range changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [revenue, sales, visitors, conversion, stats] = await Promise.all([
          dataServices.analytics.fetchRevenueData(dateRange.from, dateRange.to, 'month'),
          dataServices.analytics.fetchSalesByCategory(dateRange.from, dateRange.to),
          dataServices.analytics.fetchVisitorsBySource(dateRange.from, dateRange.to),
          dataServices.analytics.fetchConversionData(dateRange.from, dateRange.to, 'month'),
          dataServices.analytics.fetchStatCardData()
        ]);
        
        // Update state with fetched data
        setRevenueData(revenue.data);
        setSalesData(sales.data);
        setVisitorsData(visitors.data);
        setConversionData(conversion.data);
        setStatCardData(stats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    
    fetchData();
  }, [dateRange, dataServices.analytics]);

  // Handle date range change
  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setDateRange(range);
  };

  // Handle export
  const handleExport = () => {
    console.log("Exporting data...");
    // In a real implementation, this would export the data to a file
    alert("Data exported successfully!");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <div className="border-r bg-background flex flex-col" style={{ width: "250px" }}>
        {/* Logo centered in sidebar */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-center">
            <img src="../../assets/logo.png" alt="Dashboard Logo" className="h-32" />
          </div>
        </div>
        
        {/* Vertical Navigation */}
        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            <li>
              <Button
                variant={activeTab === "analytics" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("analytics")}
              >
                Analytics
              </Button>
            </li>
            <li>
              <Button
                variant={activeTab === "cms" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("cms")}
              >
                CMS
              </Button>
            </li>
            <li>
              <Button
                variant={activeTab === "orders" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("orders")}
              >
                Orders
              </Button>
            </li>
            <li>
              <Button
                variant={activeTab === "customers" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("customers")}
              >
                Customers
              </Button>
            </li>
            <li>
              <Button
                variant={activeTab === "products" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("products")}
              >
                Products
              </Button>
            </li>
            <li>
              <Button
                variant={activeTab === "settings" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("settings")}
              >
                Settings
              </Button>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {activeTab === "analytics" && (
            <DashboardOverview
              stats={statCardData}
              revenueData={revenueData}
              salesData={salesData}
              visitorsData={visitorsData}
              conversionData={conversionData}
              onDateRangeChange={handleDateRangeChange}
              onExport={handleExport}
            />
        )}
        
        {activeTab === "cms" && (
            <CMSDashboard
              pages={generatePages()}
              templates={generateTemplates()}
              mediaItems={generateMediaItems()}
              onCreatePage={() => console.log("Create page")}
              onCreateTemplate={() => console.log("Create template")}
              onUploadMedia={() => console.log("Upload media")}
              onSearch={(query) => console.log("Search:", query)}
              onFilter={(filter) => console.log("Filter:", filter)}
            />
        )}
        
        {activeTab === "orders" && (
            <OrderManagement
              orders={generateOrders(20)}
              onSearch={(query) => console.log("Search orders:", query)}
              onFilter={(filter) => console.log("Filter orders:", filter)}
              onExport={() => console.log("Export orders")}
              onRefresh={() => console.log("Refresh orders")}
              onBulkAction={(action, orderIds) => console.log("Bulk action:", action, orderIds)}
              onViewOrder={(orderId) => console.log("View order:", orderId)}
              onEditOrder={(orderId) => console.log("Edit order:", orderId)}
              onPrintOrder={(orderId) => console.log("Print order:", orderId)}
              onUpdateStatus={(orderId, status) => console.log("Update status:", orderId, status)}
            />
        )}
        
        {activeTab === "customers" && (
            <CustomerManagement
              customers={generateCustomers(20)}
              segments={generateCustomerSegments()}
              onSearch={(query) => console.log("Search:", query)}
              onFilter={(filter) => console.log("Filter:", filter)}
              onExport={() => console.log("Export customers")}
              onAddCustomer={() => console.log("Add customer")}
              onViewCustomer={(id) => console.log("View customer:", id)}
              onEditCustomer={(id) => console.log("Edit customer:", id)}
              onEmailCustomer={(id) => console.log("Email customer:", id)}
              onAddToSegment={(customerId, segmentId) => console.log("Add to segment:", customerId, segmentId)}
              onCreateSegment={() => console.log("Create segment")}
              onEditSegment={(id) => console.log("Edit segment:", id)}
              onDeleteSegment={(id) => console.log("Delete segment:", id)}
            />
        )}
        
        {activeTab === "products" && (
            <ProductManagement
              products={generateProducts(20)}
              categories={generateProductCategories()}
              onSearch={(query) => console.log("Search:", query)}
              onFilter={(filter) => console.log("Filter:", filter)}
              onExport={() => console.log("Export products")}
              onAddProduct={() => console.log("Add product")}
              onEditProduct={(id) => console.log("Edit product:", id)}
              onDuplicateProduct={(id) => console.log("Duplicate product:", id)}
              onDeleteProduct={(id) => console.log("Delete product:", id)}
              onAddCategory={() => console.log("Add category")}
              onEditCategory={(id) => console.log("Edit category:", id)}
              onDeleteCategory={(id) => console.log("Delete category:", id)}
              onBulkAction={(action, ids) => console.log("Bulk action:", action, ids)}
            />
        )}
        
        {activeTab === "settings" && (
            <SystemConfig
              config={generateSystemConfig()}
              roles={[
                { id: "1", name: "Admin", permissions: ["all", "read", "write", "delete"] },
                { id: "2", name: "Editor", permissions: ["read", "write"] },
                { id: "3", name: "Viewer", permissions: ["read"] }
              ]}
              users={[
                { id: "1", name: "John Doe", email: "john@example.com", role: "Admin" },
                { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Editor" },
                { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "Viewer" }
              ]}
              onSave={(config) => console.log("Save config:", config)}
              onAppearanceChange={(appearance) => console.log("Appearance changed:", appearance)}
              onConnectIntegration={(id) => console.log("Connect integration:", id)}
              onDisconnectIntegration={(id) => console.log("Disconnect integration:", id)}
              onAddUser={() => console.log("Add user")}
              onEditUser={(id) => console.log("Edit user:", id)}
              onDeleteUser={(id) => console.log("Delete user:", id)}
              onAddRole={() => console.log("Add role")}
              onEditRole={(id) => console.log("Edit role:", id)}
              onDeleteRole={(id) => console.log("Delete role:", id)}
            />
        )}
      </main>
    </div>
  )
}