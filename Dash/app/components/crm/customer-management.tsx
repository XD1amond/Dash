"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Filter,
  Download,
  UserPlus,
  Users,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  Mail,
  Phone,
  Tag,
  MoreHorizontal,
  BarChart4,
  ShoppingBag,
  ArrowUpDown,
  FileDown
} from "lucide-react"
import { exportToCsv } from "@/lib/export-utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CustomerManagementProps {
  customers: any[]
  segments: any[]
  onSearch?: (query: string) => void
  onFilter?: (filter: string) => void
  onExport?: () => void
  onAddCustomer?: () => void
  onViewCustomer?: (customerId: string) => void
  onEditCustomer?: (customerId: string) => void
  onEmailCustomer?: (customerId: string) => void
  onAddToSegment?: (customerId: string, segmentId: string) => void
  onCreateSegment?: () => void
  onEditSegment?: (segmentId: string) => void
  onDeleteSegment?: (segmentId: string) => void
}

export function CustomerManagement({
  customers = [],
  segments = [],
  onSearch,
  onFilter,
  onExport,
  onAddCustomer,
  onViewCustomer,
  onEditCustomer,
  onEmailCustomer,
  onAddToSegment,
  onCreateSegment,
  onEditSegment,
  onDeleteSegment
}: CustomerManagementProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSegment, setSelectedSegment] = useState<string>("all")
  const [view, setView] = useState<"list" | "segments">("list")
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle select customer
  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers(prev => [...prev, customerId])
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerId))
    }
  }

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(filteredCustomers.map(customer => customer.id))
    } else {
      setSelectedCustomers([])
    }
  }

  // Filter customers by segment
  const filteredCustomers = selectedSegment === "all"
    ? customers
    : customers.filter(customer => customer.segment === selectedSegment)
  
  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let valueA, valueB;
    
    if (sortField === "name") {
      valueA = a.name;
      valueB = b.name;
    } else if (sortField === "email") {
      valueA = a.email;
      valueB = b.email;
    } else if (sortField === "totalOrders") {
      valueA = a.totalOrders;
      valueB = b.totalOrders;
    } else if (sortField === "totalSpent") {
      valueA = a.totalSpent;
      valueB = b.totalSpent;
    } else if (sortField === "segment") {
      valueA = a.segment || "";
      valueB = b.segment || "";
    } else {
      valueA = a[sortField as keyof typeof a] || "";
      valueB = b[sortField as keyof typeof b] || "";
    }
    
    if (sortDirection === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">
            Manage your customers and segments
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                if (selectedCustomers.length > 0) {
                  // Export only selected customers
                  const selectedCustomersData = customers.filter(customer => selectedCustomers.includes(customer.id));
                  exportToCsv(selectedCustomersData, 'selected-customers.csv', {
                    id: 'ID',
                    name: 'Name',
                    email: 'Email',
                    phone: 'Phone',
                    totalOrders: 'Total Orders',
                    totalSpent: 'Total Spent',
                    segment: 'Segment'
                  });
                } else {
                  // No customers selected, export all filtered customers
                  exportToCsv(filteredCustomers, 'all-customers.csv', {
                    id: 'ID',
                    name: 'Name',
                    email: 'Email',
                    phone: 'Phone',
                    totalOrders: 'Total Orders',
                    totalSpent: 'Total Spent',
                    segment: 'Segment'
                  });
                }
              }}>
                <FileDown className="mr-2 h-4 w-4" />
                {selectedCustomers.length > 0
                  ? `Export ${selectedCustomers.length} Selected Customers`
                  : "Export All Customers"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={onAddCustomer}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      <Tabs defaultValue="customers" className="space-y-4" onValueChange={(value) => setView(value as "list" | "segments")}>
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="customers" className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <form onSubmit={handleSearch} className="flex w-full md:w-1/3">
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none"
              />
              <Button type="submit" variant="secondary" className="rounded-l-none">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter by Segment
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedSegment("all")}>
                  All Customers
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {segments.map((segment) => (
                  <DropdownMenuItem 
                    key={segment.id} 
                    onClick={() => setSelectedSegment(segment.name)}
                  >
                    {segment.name}
                  </DropdownMenuItem>
                ))}
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
                    <div className="flex items-center justify-between cursor-pointer hover:bg-muted p-1 rounded" onClick={() => handleSort("name")}>
                      <span>Name</span>
                      {sortField === "name" && (
                        sortDirection === "asc" ?
                          <ChevronUp className="h-4 w-4" /> :
                          <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex items-center justify-between cursor-pointer hover:bg-muted p-1 rounded" onClick={() => handleSort("email")}>
                      <span>Email</span>
                      {sortField === "email" && (
                        sortDirection === "asc" ?
                          <ChevronUp className="h-4 w-4" /> :
                          <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex items-center justify-between cursor-pointer hover:bg-muted p-1 rounded" onClick={() => handleSort("totalOrders")}>
                      <span>Orders</span>
                      {sortField === "totalOrders" && (
                        sortDirection === "asc" ?
                          <ChevronUp className="h-4 w-4" /> :
                          <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex items-center justify-between cursor-pointer hover:bg-muted p-1 rounded" onClick={() => handleSort("totalSpent")}>
                      <span>Spent</span>
                      {sortField === "totalSpent" && (
                        sortDirection === "asc" ?
                          <ChevronUp className="h-4 w-4" /> :
                          <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex items-center justify-between cursor-pointer hover:bg-muted p-1 rounded" onClick={() => handleSort("segment")}>
                      <span>Segment</span>
                      {sortField === "segment" && (
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

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Customer List</CardTitle>
              <CardDescription>
                {selectedSegment === "all" ? "All customers" : `Customers in ${selectedSegment} segment`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left font-medium">
                        <Checkbox
                          checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </th>
                      <th className="p-2 text-left font-medium">Name</th>
                      <th className="p-2 text-left font-medium">Email</th>
                      <th className="p-2 text-left font-medium">Phone</th>
                      <th className="p-2 text-left font-medium">Orders</th>
                      <th className="p-2 text-left font-medium">Spent</th>
                      <th className="p-2 text-left font-medium">Segment</th>
                      <th className="p-2 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCustomers.length > 0 ? (
                      sortedCustomers.map((customer) => (
                        <tr key={customer.id} className="border-b">
                          <td className="p-2">
                            <Checkbox
                              checked={selectedCustomers.includes(customer.id)}
                              onCheckedChange={(checked) => handleSelectCustomer(customer.id, checked === true)}
                            />
                          </td>
                          <td className="p-2 font-medium">{customer.name}</td>
                          <td className="p-2">{customer.email}</td>
                          <td className="p-2">{customer.phone || "—"}</td>
                          <td className="p-2">{customer.totalOrders}</td>
                          <td className="p-2">${customer.totalSpent.toFixed(2)}</td>
                          <td className="p-2">
                            {customer.segment ? (
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                <Tag className="mr-1 h-3 w-3" />
                                {customer.segment}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="p-2">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => onViewCustomer && onViewCustomer(customer.id)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => onEditCustomer && onEditCustomer(customer.id)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => onEmailCustomer && onEmailCustomer(customer.id)}>
                                <Mail className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Add to Segment</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  {segments.map((segment) => (
                                    <DropdownMenuItem 
                                      key={segment.id} 
                                      onClick={() => onAddToSegment && onAddToSegment(customer.id, segment.id)}
                                    >
                                      {segment.name}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-4 text-center">
                          No customers found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {selectedCustomers.length > 0 && (
            <div className="flex items-center gap-2 bg-muted p-4 rounded-md">
              <span className="text-sm font-medium">{selectedCustomers.length} customers selected</span>
              <div className="flex-1"></div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const selectedCustomersData = customers.filter(customer => selectedCustomers.includes(customer.id));
                  exportToCsv(selectedCustomersData, 'selected-customers.csv', {
                    id: 'ID',
                    name: 'Name',
                    email: 'Email',
                    phone: 'Phone',
                    totalOrders: 'Total Orders',
                    totalSpent: 'Total Spent',
                    segment: 'Segment'
                  });
                }}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export Selected
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedCustomers([])}>
                Clear Selection
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="segments" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={onCreateSegment}>
              <Users className="mr-2 h-4 w-4" />
              Create Segment
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {segments.length > 0 ? (
              segments.map((segment) => (
                <Card key={segment.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Tag className="mr-2 h-5 w-5" />
                      {segment.name}
                    </CardTitle>
                    <CardDescription>{segment.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{segment.customerCount} customers</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => onEditSegment && onEditSegment(segment.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => onDeleteSegment && onDeleteSegment(segment.id)}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <strong>Criteria:</strong> {segment.criteria}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="w-full">
                          <BarChart4 className="mr-2 h-4 w-4" />
                          Analytics
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <Mail className="mr-2 h-4 w-4" />
                          Email
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>No Segments Found</CardTitle>
                  <CardDescription>
                    Create your first customer segment to get started
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button onClick={onCreateSegment}>
                    <Users className="mr-2 h-4 w-4" />
                    Create Segment
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {view === "list" && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
            <CardDescription>
              Key metrics about your customer base
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-muted rounded-md p-4">
                <div className="text-sm font-medium text-muted-foreground">Total Customers</div>
                <div className="text-2xl font-bold mt-1">{customers.length}</div>
              </div>
              <div className="bg-muted rounded-md p-4">
                <div className="text-sm font-medium text-muted-foreground">Average Order Value</div>
                <div className="text-2xl font-bold mt-1">
                  ${customers.length > 0 
                    ? (customers.reduce((sum, c) => sum + c.totalSpent, 0) / 
                       customers.reduce((sum, c) => sum + c.totalOrders, 0)).toFixed(2)
                    : "0.00"}
                </div>
              </div>
              <div className="bg-muted rounded-md p-4">
                <div className="text-sm font-medium text-muted-foreground">Repeat Purchase Rate</div>
                <div className="text-2xl font-bold mt-1">
                  {customers.length > 0
                    ? `${Math.round((customers.filter(c => c.totalOrders > 1).length / customers.length) * 100)}%`
                    : "0%"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}