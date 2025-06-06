"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreHorizontal,
  Eye,
  Edit,
  Printer,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  FileDown
} from "lucide-react"
import { Order, OrderItem } from "@/types/dashboard"; // Import shared types
import { exportToCsv } from "@/lib/export-utils"

// Remove local Order interface definition

interface OrderManagementProps {
  orders: Order[]
  onSearch?: (query: string) => void
  onFilter?: (filter: any) => void
  onExport?: () => void
  onRefresh?: () => void
  onBulkAction?: (action: string, orderIds: string[]) => void
  onViewOrder?: (orderId: string) => void
  onEditOrder?: (orderId: string) => void
  onPrintOrder?: (orderId: string) => void
  onUpdateStatus?: (orderId: string, status: string) => void
}

export function OrderManagement({
  orders,
  onSearch,
  onFilter,
  onExport,
  onRefresh,
  onBulkAction,
  onViewOrder,
  onEditOrder,
  onPrintOrder,
  onUpdateStatus
}: OrderManagementProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }
  
  // Handle select all
  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked) {
      setSelectedOrders(filteredOrders.map(order => order.id))
    } else {
      setSelectedOrders([])
    }
  }
  
  // Handle select order
  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId])
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId))
    }
  }
  
  // Handle sort
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }
  
  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Filter by status
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false
    }
    
    // Filter by date
    if (dateFilter !== "all") {
      const orderDate = new Date(order.createdAt)
      const now = new Date()
      
      if (dateFilter === "today") {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        return orderDate >= today
      } else if (dateFilter === "yesterday") {
        const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        return orderDate >= yesterday && orderDate < today
      } else if (dateFilter === "thisWeek") {
        const thisWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
        return orderDate >= thisWeekStart
      } else if (dateFilter === "thisMonth") {
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        return orderDate >= thisMonthStart
      }
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        order.orderNumber.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.customer.email.toLowerCase().includes(query) ||
        order.status.toLowerCase().includes(query)
      )
    }
    
    return true
  })
  
  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let valueA, valueB
    
    if (sortField === "orderNumber") {
      valueA = a.orderNumber
      valueB = b.orderNumber
    } else if (sortField === "customer") {
      valueA = a.customer.name
      valueB = b.customer.name
    } else if (sortField === "status") {
      valueA = a.status
      valueB = b.status
    } else if (sortField === "total") {
      valueA = a.total
      valueB = b.total
    } else if (sortField === "items") {
      valueA = a.items.length // Sort by number of items
      valueB = b.items.length // Sort by number of items
    } else {
      // Handle date fields specifically
      const dateFields: (keyof Order)[] = ["createdAt", "updatedAt"];
      if (dateFields.includes(sortField as keyof Order)) {
        valueA = new Date(a[sortField as keyof Order] as string).getTime();
        valueB = new Date(b[sortField as keyof Order] as string).getTime();
        // Handle potential NaN values specifically for dates
        valueA = isNaN(valueA) ? 0 : valueA;
        valueB = isNaN(valueB) ? 0 : valueB;
      } else {
        // Handle other valid fields (assuming they exist and are comparable)
        // Note: 'items' is handled above by length
        const otherValidFields: (keyof Order)[] = ["orderNumber", "customer", "status", "total"];
         if (otherValidFields.includes(sortField as keyof Order)) {
            // Special case for customer name (nested property)
            if (sortField === 'customer') {
                valueA = a.customer.name;
                valueB = b.customer.name;
            } else {
                // Direct properties like orderNumber, status, total
                valueA = a[sortField as keyof Order];
                valueB = b[sortField as keyof Order];
            }
         } else {
           // Default for invalid fields
           valueA = 0;
           valueB = 0;
         }
      }
    }

    // Final comparison works for numbers and strings
    if (valueA === valueB) {
      return 0;
    }
    if (sortDirection === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  })
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">
            Manage and process customer orders
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <form onSubmit={handleSearch} className="flex w-full md:w-auto">
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-r-none w-full md:w-auto"
            />
            <Button type="submit" variant="secondary" className="rounded-l-none">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
              <div className="p-2">
                <div className="mb-2">
                  <p className="text-sm font-medium mb-1">Status</p>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Date</p>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="thisWeek">This Week</SelectItem>
                      <SelectItem value="thisMonth">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <div className="p-2">
                  <p className="text-sm font-medium mb-1">Sort By</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between cursor-pointer hover:bg-muted p-1 rounded" onClick={() => handleSort("orderNumber")}>
                      <span>Order Number</span>
                      {sortField === "orderNumber" && (
                        sortDirection === "asc" ?
                          <ChevronUp className="h-4 w-4" /> :
                          <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex items-center justify-between cursor-pointer hover:bg-muted p-1 rounded" onClick={() => handleSort("customer")}>
                      <span>Customer</span>
                      {sortField === "customer" && (
                        sortDirection === "asc" ?
                          <ChevronUp className="h-4 w-4" /> :
                          <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex items-center justify-between cursor-pointer hover:bg-muted p-1 rounded" onClick={() => handleSort("status")}>
                      <span>Status</span>
                      {sortField === "status" && (
                        sortDirection === "asc" ?
                          <ChevronUp className="h-4 w-4" /> :
                          <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex items-center justify-between cursor-pointer hover:bg-muted p-1 rounded" onClick={() => handleSort("createdAt")}>
                      <span>Date</span>
                      {sortField === "createdAt" && (
                        sortDirection === "asc" ?
                          <ChevronUp className="h-4 w-4" /> :
                          <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex items-center justify-between cursor-pointer hover:bg-muted p-1 rounded" onClick={() => handleSort("total")}>
                      <span>Total</span>
                      {sortField === "total" && (
                        sortDirection === "asc" ?
                          <ChevronUp className="h-4 w-4" /> :
                          <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                // Prepare data for export
                let dataToExport;
                let filename;
                
                if (selectedOrders.length > 0) {
                  // Export only selected orders
                  const selectedOrdersData = orders.filter(order => selectedOrders.includes(order.id));
                  dataToExport = selectedOrdersData.map(order => ({
                    id: order.id,
                    orderNumber: order.orderNumber,
                    createdAt: order.createdAt,
                    status: order.status,
                    total: order.total,
                    customerName: order.customer.name,
                    customerEmail: order.customer.email
                  }));
                  filename = 'selected-orders.csv';
                } else {
                  // No orders selected, export all filtered orders
                  dataToExport = filteredOrders.map(order => ({
                    id: order.id,
                    orderNumber: order.orderNumber,
                    createdAt: order.createdAt,
                    status: order.status,
                    total: order.total,
                    customerName: order.customer.name,
                    customerEmail: order.customer.email
                  }));
                  filename = 'all-orders.csv';
                }
                
                // Export the data
                exportToCsv(dataToExport, filename, {
                  id: 'ID',
                  orderNumber: 'Order Number',
                  createdAt: 'Date',
                  status: 'Status',
                  total: 'Total',
                  customerName: 'Customer Name',
                  customerEmail: 'Customer Email'
                });
              }}>
                <FileDown className="mr-2 h-4 w-4" />
                {selectedOrders.length > 0
                  ? `Export ${selectedOrders.length} Selected Orders`
                  : "Export All Orders"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          <Checkbox 
                            checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </th>
                        <th 
                          className="h-12 px-4 text-left align-middle font-medium cursor-pointer"
                          onClick={() => handleSort("orderNumber")}
                        >
                          <div className="flex items-center">
                            Order
                            {sortField === "orderNumber" && (
                              sortDirection === "asc" ? 
                                <ChevronUp className="ml-1 h-4 w-4" /> : 
                                <ChevronDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="h-12 px-4 text-left align-middle font-medium cursor-pointer"
                          onClick={() => handleSort("customer")}
                        >
                          <div className="flex items-center">
                            Customer
                            {sortField === "customer" && (
                              sortDirection === "asc" ? 
                                <ChevronUp className="ml-1 h-4 w-4" /> : 
                                <ChevronDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="h-12 px-4 text-left align-middle font-medium cursor-pointer"
                          onClick={() => handleSort("status")}
                        >
                          <div className="flex items-center">
                            Status
                            {sortField === "status" && (
                              sortDirection === "asc" ? 
                                <ChevronUp className="ml-1 h-4 w-4" /> : 
                                <ChevronDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="h-12 px-4 text-left align-middle font-medium cursor-pointer"
                          onClick={() => handleSort("createdAt")}
                        >
                          <div className="flex items-center">
                            Date
                            {sortField === "createdAt" && (
                              sortDirection === "asc" ? 
                                <ChevronUp className="ml-1 h-4 w-4" /> : 
                                <ChevronDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="h-12 px-4 text-left align-middle font-medium cursor-pointer"
                          onClick={() => handleSort("total")}
                        >
                          <div className="flex items-center">
                            Total
                            {sortField === "total" && (
                              sortDirection === "asc" ? 
                                <ChevronUp className="ml-1 h-4 w-4" /> : 
                                <ChevronDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedOrders.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="p-4 align-middle">
                            <Checkbox
                              checked={selectedOrders.includes(order.id)}
                              onCheckedChange={(checked: boolean | "indeterminate") =>
                                handleSelectOrder(order.id, checked === true)
                              }
                            />
                          </td>
                          <td className="p-4 align-middle font-medium">{order.orderNumber}</td>
                          <td className="p-4 align-middle">
                            <div>
                              <div className="font-medium">{order.customer.name}</div>
                              <div className="text-muted-foreground">{order.customer.email}</div>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="p-4 align-middle">{formatDate(order.createdAt)}</td>
                          <td className="p-4 align-middle">${order.total.toFixed(2)}</td>
                          <td className="p-4 align-middle text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onViewOrder && onViewOrder(order.id)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onEditOrder && onEditOrder(order.id)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Order
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onPrintOrder && onPrintOrder(order.id)}>
                                  <Printer className="mr-2 h-4 w-4" />
                                  Print Order
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {selectedOrders.length > 0 && (
            <div className="flex items-center gap-2 bg-muted p-4 rounded-md">
              <span className="text-sm font-medium">{selectedOrders.length} orders selected</span>
              <div className="flex-1"></div>
              <Select onValueChange={(value) => {
                if (value === "export") {
                  // Handle export action directly
                  const selectedOrdersData = orders.filter(order => selectedOrders.includes(order.id));
                  // Create a flattened version of the data for CSV export
                  const flattenedData = selectedOrdersData.map(order => ({
                    id: order.id,
                    orderNumber: order.orderNumber,
                    createdAt: order.createdAt,
                    status: order.status,
                    total: order.total,
                    customerName: order.customer.name,
                    customerEmail: order.customer.email
                  }));
                  
                  exportToCsv(flattenedData, 'selected-orders.csv', {
                    id: 'ID',
                    orderNumber: 'Order Number',
                    createdAt: 'Date',
                    status: 'Status',
                    total: 'Total',
                    customerName: 'Customer Name',
                    customerEmail: 'Customer Email'
                  });
                } else if (onBulkAction) {
                  // Handle other actions via callback
                  onBulkAction(value, selectedOrders);
                }
              }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Bulk Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="markProcessing">Mark as Processing</SelectItem>
                  <SelectItem value="markShipped">Mark as Shipped</SelectItem>
                  <SelectItem value="markDelivered">Mark as Delivered</SelectItem>
                  <SelectItem value="markCancelled">Mark as Cancelled</SelectItem>
                  <SelectItem value="export">Export Selected</SelectItem>
                  <SelectItem value="print">Print Selected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
      </div>
    </div>
  )
}