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
  ChevronUp
} from "lucide-react"

interface Order {
  id: string
  orderNumber: string
  customer: {
    id: string
    name: string
    email: string
  }
  status: string
  total: number
  items: number
  createdAt: string
  updatedAt: string
}

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
      valueA = a.items
      valueB = b.items
    } else {
      valueA = new Date(a[sortField as keyof Order] as string).getTime()
      valueB = new Date(b[sortField as keyof Order] as string).getTime()
    }
    
    if (sortDirection === "asc") {
      return valueA > valueB ? 1 : -1
    } else {
      return valueA < valueB ? 1 : -1
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
          <Button variant="outline" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
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
              <Select onValueChange={(value) => onBulkAction && onBulkAction(value, selectedOrders)}>
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
        </TabsContent>
        
        {/* Other tabs will filter by status automatically */}
        <TabsContent value="pending" className="space-y-4">
          {/* Same content as "all" but filtered */}
        </TabsContent>
        
        <TabsContent value="processing" className="space-y-4">
          {/* Same content as "all" but filtered */}
        </TabsContent>
        
        <TabsContent value="shipped" className="space-y-4">
          {/* Same content as "all" but filtered */}
        </TabsContent>
        
        <TabsContent value="delivered" className="space-y-4">
          {/* Same content as "all" but filtered */}
        </TabsContent>
        
        <TabsContent value="cancelled" className="space-y-4">
          {/* Same content as "all" but filtered */}
        </TabsContent>
      </Tabs>
    </div>
  )
}