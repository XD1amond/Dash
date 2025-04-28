import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetDefinition, LayoutSection } from "@/components/dashboard/customizable-layout";

// Define product performance widgets
export const productWidgets: WidgetDefinition[] = [
  {
    id: "top-products",
    name: "Top Products",
    description: "Best selling products by revenue",
    category: "Products",
    component: (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
          <CardDescription>
            Best selling products by revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-muted rounded mr-3"></div> {/* Placeholder for image */}
                <div>
                  <div className="font-medium">Wireless Headphones</div>
                  <div className="text-xs text-muted-foreground">Electronics</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">$24,500</div>
                <div className="text-xs text-green-500">+12%</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-muted rounded mr-3"></div> {/* Placeholder for image */}
                <div>
                  <div className="font-medium">Smart Watch</div>
                  <div className="text-xs text-muted-foreground">Electronics</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">$18,300</div>
                <div className="text-xs text-green-500">+8%</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-muted rounded mr-3"></div> {/* Placeholder for image */}
                <div>
                  <div className="font-medium">Designer Bag</div>
                  <div className="text-xs text-muted-foreground">Fashion</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">$12,750</div>
                <div className="text-xs text-red-500">-3%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    defaultSize: "medium"
  },
  {
    id: "inventory-status",
    name: "Inventory Status",
    description: "Current inventory levels by category",
    category: "Products",
    component: (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Inventory Status</CardTitle>
          <CardDescription>
            Current inventory levels by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Electronics</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "78%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Clothing</span>
                <span className="font-medium text-amber-500">42%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "42%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Home & Kitchen</span>
                <span className="font-medium">65%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Beauty</span>
                <span className="font-medium text-red-500">18%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-red-500 rounded-full" style={{ width: "18%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    defaultSize: "medium"
  },
  {
    id: "product-returns",
    name: "Product Returns",
    description: "Return rate by product category",
    category: "Products",
    component: (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Product Returns</CardTitle>
          <CardDescription>
            Return rate by product category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span>Electronics</span>
              </div>
              <span className="font-medium">4.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                <span>Clothing</span>
              </div>
              <span className="font-medium">8.7%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Home & Kitchen</span>
              </div>
              <span className="font-medium">2.1%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span>Beauty</span>
              </div>
              <span className="font-medium">3.5%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    defaultSize: "small"
  }
];

// Define default layout for product widgets
export const defaultProductLayout: LayoutSection[] = [
  {
    id: "product-metrics",
    title: "Product Metrics",
    widgets: ["top-products", "inventory-status", "product-returns"]
  }
];