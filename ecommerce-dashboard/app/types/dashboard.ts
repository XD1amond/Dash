// Analytics Types
export interface RevenueData {
  name: string;
  revenue: number;
}

export interface SalesData {
  name: string;
  value: number;
  color: string;
}

export interface VisitorsData {
  name: string;
  value: number;
  color: string;
}

export interface ConversionData {
  name: string;
  conversion: number;
}

export interface StatCardData {
  title: string;
  value: string;
  change: number;
  changeType: "increase" | "decrease";
}

// Content Management Types
export interface Page {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  name: string;
  type: "image" | "video" | "document";
  url: string;
  size: number;
  createdAt: string;
}

// Order Management Types
export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  segment?: string;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  customerCount: number;
  criteria: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inventory: number;
  category: string;
  tags: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

// Data Pipeline Types
export interface DataNode {
  id: string;
  name: string;
  type: string;
  status: "active" | "inactive" | "error";
  inputs: string[];
  outputs: string[];
  position: {
    x: number;
    y: number;
  };
}

export interface DataConnection {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface DataFlow {
  nodes: DataNode[];
  connections: DataConnection[];
}

// System Configuration Types
export interface SystemConfig {
  theme: "light" | "dark" | "system";
  businessInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  notifications: {
    email: boolean;
    browser: boolean;
    mobile: boolean;
  };
  integrations: {
    id: string;
    name: string;
    status: "connected" | "disconnected";
  }[];
}