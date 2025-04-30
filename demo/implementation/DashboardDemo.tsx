"use client"

import React, { useState, useEffect } from "react"
import logoImage from "../../assets/logo.png"
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
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <div className="border-r bg-background flex flex-col" style={{ width: "250px" }}>
        {/* Logo centered in sidebar */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-center">
            <img src={logoImage.src} alt="Dashboard Logo" className="h-32" />
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