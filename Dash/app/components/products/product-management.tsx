"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Filter,
  Download,
  Plus,
  ChevronDown,
  ChevronUp,
  Tag,
  Edit,
  Copy,
  Trash2,
  MoreHorizontal,
  Image as ImageIcon,
  Package,
  Layers,
  BarChart4,
  Settings,
  ArrowUpDown
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProductManagementProps {
  products: any[]
  categories: any[]
  onSearch?: (query: string) => void
  onFilter?: (filter: string) => void
  onExport?: () => void
  onAddProduct?: () => void
  onEditProduct?: (productId: string) => void
  onDuplicateProduct?: (productId: string) => void
  onDeleteProduct?: (productId: string) => void
  onAddCategory?: () => void
  onEditCategory?: (categoryId: string) => void
  onDeleteCategory?: (categoryId: string) => void
  onBulkAction?: (action: string, productIds: string[]) => void
}

export function ProductManagement({
  products = [],
  categories = [],
  onSearch,
  onFilter,
  onExport,
  onAddProduct,
  onEditProduct,
  onDuplicateProduct,
  onDeleteProduct,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onBulkAction
}: ProductManagementProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [productSortField, setProductSortField] = useState<string>("name")
  const [productSortDirection, setProductSortDirection] = useState<"asc" | "desc">("asc")

  const handleProductSort = (field: string) => {
    if (field === productSortField) {
      setProductSortDirection(prev => prev === "asc" ? "desc" : "asc")
    } else {
      setProductSortField(field)
      setProductSortDirection("asc")
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(product => product.id))
    }
  }

  // Filter products by category
  const filteredProducts = categoryFilter === "all"
    ? products
    : products.filter(product => product.category === categoryFilter)
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let valueA, valueB;
    
    if (productSortField === "name") {
      valueA = a.name;
      valueB = b.name;
    } else if (productSortField === "category") {
      valueA = a.category;
      valueB = b.category;
    } else if (productSortField === "price") {
      valueA = a.price;
      valueB = b.price;
    } else if (productSortField === "inventory") {
      valueA = a.inventory;
      valueB = b.inventory;
    } else {
      valueA = a[productSortField as keyof typeof a] || "";
      valueB = b[productSortField as keyof typeof b] || "";
    }
    
    if (productSortDirection === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={onAddProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 md:flex-row">
          <form onSubmit={handleSearch} className="flex w-full md:w-auto">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-r-none w-full md:w-80"
            />
            <Button type="submit" variant="secondary" className="rounded-l-none">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Category
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setCategoryFilter("all")}>
                All Categories
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {categories.map((category) => (
                <DropdownMenuItem 
                  key={category.id} 
                  onClick={() => setCategoryFilter(category.name)}
                >
                  {category.name}
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
                  <div className="flex items-center justify-between cursor-pointer hover:bg-muted p-1 rounded" onClick={() => handleProductSort("name")}>
                    <span>Name</span>
                    {productSortField === "name" && (
                      productSortDirection === "asc" ?
                        <ChevronUp className="h-4 w-4" /> :
                        <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex items-center justify-between cursor-pointer hover:bg-muted p-1 rounded" onClick={() => handleProductSort("category")}>
                    <span>Category</span>
                    {productSortField === "category" && (
                      productSortDirection === "asc" ?
                        <ChevronUp className="h-4 w-4" /> :
                        <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex items-center justify-between cursor-pointer hover:bg-muted p-1 rounded" onClick={() => handleProductSort("price")}>
                    <span>Price</span>
                    {productSortField === "price" && (
                      productSortDirection === "asc" ?
                        <ChevronUp className="h-4 w-4" /> :
                        <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex items-center justify-between cursor-pointer hover:bg-muted p-1 rounded" onClick={() => handleProductSort("inventory")}>
                    <span>Inventory</span>
                    {productSortField === "inventory" && (
                      productSortDirection === "asc" ?
                        <ChevronUp className="h-4 w-4" /> :
                        <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant={view === "grid" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setView("grid")}
            className="h-8 w-8 p-0"
          >
            <Layers className="h-4 w-4" />
          </Button>
          <Button 
            variant={view === "list" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setView("list")}
            className="h-8 w-8 p-0"
          >
            <Package className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {selectedProducts.length > 0 && (
        <div className="bg-muted p-2 rounded-md flex items-center justify-between">
          <span>{selectedProducts.length} products selected</span>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Bulk Actions
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onBulkAction && onBulkAction("export", selectedProducts)}>
                  Export Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onBulkAction && onBulkAction("category", selectedProducts)}>
                  Change Category
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onBulkAction && onBulkAction("price", selectedProducts)}>
                  Update Price
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onBulkAction && onBulkAction("inventory", selectedProducts)}>
                  Update Inventory
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onBulkAction && onBulkAction("delete", selectedProducts)}>
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="sm" onClick={() => setSelectedProducts([])}>
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-4">
          {view === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="aspect-square relative bg-muted">
                      {product.images && product.images.length > 0 ? (
                        <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${product.images[0]})` }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground opacity-50" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                        />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium truncate">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onEditProduct && onEditProduct(product.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onDuplicateProduct && onDuplicateProduct(product.id)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => onDeleteProduct && onDeleteProduct(product.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            {product.category}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Stock: {product.inventory}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {product.tags && product.tags.map((tag: string, index: number) => (
                            <span key={index} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full">
                  <CardHeader>
                    <CardTitle>No Products Found</CardTitle>
                    <CardDescription>
                      Add your first product to get started
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <Button onClick={onAddProduct}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium">
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              className="mr-2"
                              checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                              onChange={handleSelectAll}
                            />
                            Product
                          </div>
                        </th>
                        <th className="p-2 text-left font-medium">Category</th>
                        <th className="p-2 text-left font-medium">Price</th>
                        <th className="p-2 text-left font-medium">Inventory</th>
                        <th className="p-2 text-left font-medium">Tags</th>
                        <th className="p-2 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedProducts.length > 0 ? (
                        sortedProducts.map((product) => (
                          <tr key={product.id} className="border-b">
                            <td className="p-2">
                              <div className="flex items-center">
                                <input 
                                  type="checkbox" 
                                  className="mr-2"
                                  checked={selectedProducts.includes(product.id)}
                                  onChange={() => handleSelectProduct(product.id)}
                                />
                                <div className="flex items-center">
                                  <div className="h-8 w-8 rounded bg-muted mr-2 flex items-center justify-center overflow-hidden">
                                    {product.images && product.images.length > 0 ? (
                                      <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                                    ) : (
                                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </div>
                                  {product.name}
                                </div>
                              </div>
                            </td>
                            <td className="p-2">{product.category}</td>
                            <td className="p-2">${product.price.toFixed(2)}</td>
                            <td className="p-2">{product.inventory}</td>
                            <td className="p-2">
                              <div className="flex flex-wrap gap-1">
                                {product.tags && product.tags.map((tag: string, index: number) => (
                                  <span key={index} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => onEditProduct && onEditProduct(product.id)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => onDuplicateProduct && onDuplicateProduct(product.id)}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => onDeleteProduct && onDeleteProduct(product.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-4 text-center">
                            No products found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button onClick={onAddCategory}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Tag className="mr-2 h-5 w-5" />
                      {category.name}
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{category.productCount} products</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => onEditCategory && onEditCategory(category.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => onDeleteCategory && onDeleteCategory(category.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="w-full">
                          <BarChart4 className="mr-2 h-4 w-4" />
                          Analytics
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>No Categories Found</CardTitle>
                  <CardDescription>
                    Create your first product category to get started
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button onClick={onAddCategory}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}