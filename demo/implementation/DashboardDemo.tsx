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
// import { Download } from "lucide-react" // Removed unused import

import {
  generateRevenueData,
  generateSalesData,
  generateVisitorsData,
  generateConversionData,
  generateStatCardData
} from "../data/analytics-data"

import {
  generateOrders,
  generateCustomers,
  generateCustomerSegments,
  generateProducts,
  generateProductCategories,
  generatePages,
  generateTemplates,
  generateMediaItems,
  generateSystemConfig,
  generateAllMockData
} from "../data/mock-data"

export function DashboardDemo() {
  // State for date range
  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date
  }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })

  // State for analytics data
  const [revenueData, setRevenueData] = useState(generateRevenueData())
  const [salesData, setSalesData] = useState(generateSalesData())
  const [visitorsData, setVisitorsData] = useState(generateVisitorsData())
  const [conversionData, setConversionData] = useState(generateConversionData())
  const [statCardData, setStatCardData] = useState(generateStatCardData())

  // State for other data
  const [orders, setOrders] = useState(generateOrders(10))
  const [customers, setCustomers] = useState(generateCustomers(10))
  const [products, setProducts] = useState(generateProducts(10))

  // Regenerate data when date range changes
  useEffect(() => {
    // In a real implementation, this would fetch data from an API
    // based on the selected date range
    setRevenueData(generateRevenueData())
    setConversionData(generateConversionData())
  }, [dateRange])

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
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background px-4 py-3">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">E-commerce Dashboard Demo</h1>
          <p className="text-sm text-muted-foreground">
            Demonstration of the dashboard components with mock data
          </p>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4 md:p-6 space-y-8">
        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList className="w-full"> {/* Removed md:w-auto to make it always full width */}
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="cms">CMS</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics" className="space-y-4">
            <DashboardOverview
              stats={statCardData}
              revenueData={revenueData}
              salesData={salesData}
              visitorsData={visitorsData}
              conversionData={conversionData}
              onDateRangeChange={handleDateRangeChange}
              onExport={handleExport}
            />
          </TabsContent>
        
          <TabsContent value="cms">
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
          </TabsContent>
          
          <TabsContent value="orders">
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
          </TabsContent>
        
          <TabsContent value="customers">
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
          </TabsContent>
        
          <TabsContent value="products">
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
          </TabsContent>
          
          <TabsContent value="settings">
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}