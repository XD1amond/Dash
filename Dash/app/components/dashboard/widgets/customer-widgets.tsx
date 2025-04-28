import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetDefinition, LayoutSection } from "@/components/dashboard/customizable-layout";

// Define customer insights widgets
export const customerWidgets: WidgetDefinition[] = [
  {
    id: "customer-segments",
    name: "Customer Segments",
    description: "Distribution of customers by segment",
    category: "Customers",
    component: (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Customer Segments</CardTitle>
          <CardDescription>
            Distribution of customers by segment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                <span>Loyal Customers</span>
              </div>
              <span className="font-medium">32%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span>Regular Shoppers</span>
              </div>
              <span className="font-medium">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>New Customers</span>
              </div>
              <span className="font-medium">18%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                <span>One-time Shoppers</span>
              </div>
              <span className="font-medium">5%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    defaultSize: "medium"
  },
  {
    id: "customer-satisfaction",
    name: "Customer Satisfaction",
    description: "Customer satisfaction metrics",
    category: "Customers",
    component: (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Customer Satisfaction</CardTitle>
          <CardDescription>
            Customer satisfaction metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[200px]">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-4xl font-bold">4.7/5.0</div>
            <div className="flex items-center mt-2">
              {Array(5).fill(0).map((_, i) => (
                <svg key={i} className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-yellow-200'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div className="text-sm text-muted-foreground mt-2">Based on 1,248 reviews</div>
            <div className="text-sm text-green-500 mt-1">+0.3 from last quarter</div>
          </div>
        </CardContent>
      </Card>
    ),
    defaultSize: "small"
  },
  {
    id: "geographic-distribution",
    name: "Geographic Distribution",
    description: "Customer distribution by region",
    category: "Customers",
    component: (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
          <CardDescription>
            Customer distribution by region
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>North America</span>
                <span className="font-medium">42%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "42%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Europe</span>
                <span className="font-medium">28%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "28%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Asia Pacific</span>
                <span className="font-medium">18%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "18%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Latin America</span>
                <span className="font-medium">8%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "8%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Middle East & Africa</span>
                <span className="font-medium">4%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "4%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    defaultSize: "large"
  }
];

// Define default layout for customer widgets
export const defaultCustomerLayout: LayoutSection[] = [
  {
    id: "customer-metrics",
    title: "Customer Metrics",
    widgets: ["customer-segments", "customer-satisfaction", "geographic-distribution"]
  }
];