"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetDefinition, LayoutSection } from "@/components/dashboard/customizable-layout";
import { WidgetWrapper } from "./widget-components";
import { RestAdapter } from '@/config/data/adapters/rest.adapter';

// Define interfaces for product data
interface TopProduct {
  product: string;
  units: string;
  sales: string;
  profit: string;
}

interface ProductInventory {
  category: string;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

interface ProductReturn {
  category: string;
  rate: string;
}

// Create a REST adapter for API calls
const restAdapter = new RestAdapter({
  baseUrl: '/api',
  debug: process.env.NODE_ENV === 'development'
});

// Function to fetch top products data
const fetchTopProducts = async (): Promise<TopProduct[]> => {
  try {
    const response = await restAdapter.fetchData<{data: TopProduct[]}>('products/top-products');
    return response.data;
  } catch (error) {
    console.error('Error fetching top products data:', error);
    return [];
  }
};

// Function to fetch product inventory data
const fetchProductInventory = async (): Promise<ProductInventory[]> => {
  try {
    const response = await restAdapter.fetchData<{data: ProductInventory[]}>('products/inventory');
    return response.data;
  } catch (error) {
    console.error('Error fetching product inventory data:', error);
    return [];
  }
};

// Function to fetch product returns data
const fetchProductReturns = async (): Promise<ProductReturn[]> => {
  try {
    const response = await restAdapter.fetchData<{data: ProductReturn[]}>('products/returns');
    return response.data;
  } catch (error) {
    console.error('Error fetching product returns data:', error);
    return [];
  }
};

// Create functional components for each widget type
interface TopProductsWidgetProps {
  data: TopProduct[];
}

const TopProductsWidget: React.FC<TopProductsWidgetProps> = ({ data = [] }) => {
  const [productsData, setProductsData] = useState<TopProduct[]>(data);
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (data.length === 0) {
        setLoading(true);
        try {
          const fetchedData = await fetchTopProducts();
          setProductsData(fetchedData);
          setError(null);
        } catch (err) {
          setError('Failed to load top products data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [data]);

  // Function to calculate growth percentage based on profit
  const calculateGrowth = (profit: string): string => {
    const profitNum = parseInt(profit.replace(/[^0-9]/g, ''));
    if (profitNum > 30000) return '+12%';
    if (profitNum > 20000) return '+8%';
    return '-3%';
  };

  // Function to determine growth color
  const getGrowthColor = (growth: string): string => {
    return growth.startsWith('+') ? 'text-green-500' : 'text-red-500';
  };

  return (
    <WidgetWrapper
      title="Top Products"
      description="Best selling products by revenue"
      chartId="top-products-chart"
      data={productsData}
      relatedWidgets={getRelatedWidgets("top-products")}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Loading top products data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </div>
      ) : productsData.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          No product data available
        </div>
      ) : (
        <div className="space-y-4">
          {productsData.map((product, index) => {
            const growth = calculateGrowth(product.profit);
            return (
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
                  <div className={`text-xs ${getGrowthColor(growth)}`}>
                    {growth}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </WidgetWrapper>
  );
};

interface InventoryStatusWidgetProps {
  data: ProductInventory[];
}

const InventoryStatusWidget: React.FC<InventoryStatusWidgetProps> = ({ data = [] }) => {
  const [inventoryData, setInventoryData] = useState<ProductInventory[]>(data);
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (data.length === 0) {
        setLoading(true);
        try {
          const fetchedData = await fetchProductInventory();
          setInventoryData(fetchedData);
          setError(null);
        } catch (err) {
          setError('Failed to load inventory data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [data]);

  // Function to get status color based on in-stock percentage
  const getStatusColor = (inStockPercent: number): string => {
    if (inStockPercent > 70) return '';
    if (inStockPercent > 40) return 'text-amber-500';
    return 'text-red-500';
  };

  // Function to get status background color based on in-stock percentage
  const getStatusBgColor = (inStockPercent: number): string => {
    if (inStockPercent > 70) return 'bg-green-500';
    if (inStockPercent > 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <WidgetWrapper
      title="Inventory Status"
      description="Current inventory levels by category"
      chartId="inventory-status-chart"
      data={inventoryData}
      relatedWidgets={getRelatedWidgets("inventory-status")}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Loading inventory data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </div>
      ) : inventoryData.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          No inventory data available
        </div>
      ) : (
        <div className="space-y-4">
          {inventoryData.map((category, index) => {
            const total = category.inStock + category.lowStock + category.outOfStock;
            const inStockPercent = Math.round((category.inStock / total) * 100);
            const lowStockPercent = Math.round((category.lowStock / total) * 100);
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{category.category}</span>
                  <span className={`font-medium ${getStatusColor(inStockPercent)}`}>
                    {inStockPercent}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div
                    className={`h-full ${getStatusBgColor(inStockPercent)} rounded-full`}
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
      )}
    </WidgetWrapper>
  );
};

interface ProductReturnsWidgetProps {
  data: ProductReturn[];
}

const ProductReturnsWidget: React.FC<ProductReturnsWidgetProps> = ({ data = [] }) => {
  const [returnsData, setReturnsData] = useState<ProductReturn[]>(data);
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (data.length === 0) {
        setLoading(true);
        try {
          const fetchedData = await fetchProductReturns();
          setReturnsData(fetchedData);
          setError(null);
        } catch (err) {
          setError('Failed to load product returns data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [data]);

  // Function to get category color
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Electronics': return 'bg-red-500';
      case 'Clothing': return 'bg-amber-500';
      case 'Home & Kitchen': return 'bg-green-500';
      case 'Beauty': return 'bg-purple-500';
      case 'Sports': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <WidgetWrapper
      title="Product Returns"
      description="Return rate by product category"
      chartId="product-returns-chart"
      data={returnsData}
      relatedWidgets={getRelatedWidgets("product-returns")}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Loading product returns data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </div>
      ) : returnsData.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          No product returns data available
        </div>
      ) : (
        <div className="space-y-4">
          {returnsData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${getCategoryColor(item.category)} mr-2`}></div>
                <span>{item.category}</span>
              </div>
              <span className="font-medium">{item.rate}</span>
            </div>
          ))}
        </div>
      )}
    </WidgetWrapper>
  );
};

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
    component: <TopProductsWidget data={[]} />,
    defaultSize: "medium"
  },
  {
    id: "inventory-status",
    name: "Inventory Status",
    description: "Current inventory levels by category",
    category: "Products",
    component: <InventoryStatusWidget data={[]} />,
    defaultSize: "medium"
  },
  {
    id: "product-returns",
    name: "Product Returns",
    description: "Return rate by product category",
    category: "Products",
    component: <ProductReturnsWidget data={[]} />,
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