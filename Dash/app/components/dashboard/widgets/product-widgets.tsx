import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetDefinition, LayoutSection } from "@/components/dashboard/customizable-layout";
import { WidgetWrapper } from "./widget-components";
import {
  topProductsData,
  productInventoryData
} from "../../../../../demo/data/widget-data";

// Get related widgets for a given widget
const getRelatedWidgets = (widgetId: string) => {
  const otherWidgets = productWidgets.filter(w => w.id !== widgetId);
  return otherWidgets.slice(0, 2); // Return up to 2 related widgets
};

// Define product performance widgets
export const productWidgets: WidgetDefinition[] = [
  {
    id: "top-products",
    name: "Top Products",
    description: "Best selling products by revenue",
    category: "Products",
    component: (
      <WidgetWrapper
        title="Top Products"
        description="Best selling products by revenue"
        chartId="top-products-chart"
        data={topProductsData}
        relatedWidgets={getRelatedWidgets("top-products")}
      >
        <div className="space-y-4">
          {topProductsData.map((product, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-muted rounded mr-3"></div> {/* Placeholder for image */}
                <div>
                  <div className="font-medium">{product.product}</div>
                  <div className="text-xs text-muted-foreground">
                    {product.units} units sold
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{product.sales}</div>
                <div className="text-xs text-green-500">
                  {parseInt(product.profit.replace(/[^0-9]/g, '')) > 30000 ? '+12%' :
                   parseInt(product.profit.replace(/[^0-9]/g, '')) > 20000 ? '+8%' : '-3%'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </WidgetWrapper>
    ),
    defaultSize: "medium"
  },
  {
    id: "inventory-status",
    name: "Inventory Status",
    description: "Current inventory levels by category",
    category: "Products",
    component: (
      <WidgetWrapper
        title="Inventory Status"
        description="Current inventory levels by category"
        chartId="inventory-status-chart"
        data={productInventoryData}
        relatedWidgets={getRelatedWidgets("inventory-status")}
      >
        <div className="space-y-4">
          {productInventoryData.map((category, index) => {
            const total = category.inStock + category.lowStock + category.outOfStock;
            const inStockPercent = Math.round((category.inStock / total) * 100);
            const lowStockPercent = Math.round((category.lowStock / total) * 100);
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{category.category}</span>
                  <span className={`font-medium ${
                    inStockPercent > 70 ? '' :
                    inStockPercent > 40 ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {inStockPercent}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div
                    className={`h-full ${
                      inStockPercent > 70 ? 'bg-green-500' :
                      inStockPercent > 40 ? 'bg-amber-500' : 'bg-red-500'
                    } rounded-full`}
                    style={{ width: `${inStockPercent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>In Stock: {category.inStock}</span>
                  <span>Low Stock: {category.lowStock}</span>
                  <span>Out of Stock: {category.outOfStock}</span>
                </div>
              </div>
            );
          })}
        </div>
      </WidgetWrapper>
    ),
    defaultSize: "medium"
  },
  {
    id: "product-returns",
    name: "Product Returns",
    description: "Return rate by product category",
    category: "Products",
    component: (
      <WidgetWrapper
        title="Product Returns"
        description="Return rate by product category"
        chartId="product-returns-chart"
        data={[
          { category: "Electronics", rate: "4.2%" },
          { category: "Clothing", rate: "8.7%" },
          { category: "Home & Kitchen", rate: "2.1%" },
          { category: "Beauty", rate: "3.5%" }
        ]}
        relatedWidgets={getRelatedWidgets("product-returns")}
      >
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
      </WidgetWrapper>
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