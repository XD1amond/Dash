import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetDefinition, LayoutSection } from "@/components/dashboard/customizable-layout";

// Define marketing widgets
export const marketingWidgets: WidgetDefinition[] = [
  {
    id: "campaign-performance",
    name: "Campaign Performance",
    description: "Performance metrics for marketing campaigns",
    category: "Marketing",
    component: (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>
            Performance metrics for marketing campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Summer Sale</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-green-500">4.2% CTR</span>
                  <span className="text-sm text-blue-500">$12.40 CPC</span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "78%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">New Collection</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-green-500">3.8% CTR</span>
                  <span className="text-sm text-blue-500">$9.20 CPC</span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Holiday Special</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-green-500">5.1% CTR</span>
                  <span className="text-sm text-blue-500">$14.80 CPC</span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "82%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    defaultSize: "large"
  },
  {
    id: "social-media-performance",
    name: "Social Media Performance",
    description: "Performance metrics for social media channels",
    category: "Marketing",
    component: (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>
            Performance by channel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span>Instagram</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">12.4K</span>
                <span className="text-xs text-green-500">+8%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-sky-500 mr-2"></div>
                <span>Twitter</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">8.7K</span>
                <span className="text-xs text-green-500">+12%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span>YouTube</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">4.2K</span>
                <span className="text-xs text-green-500">+15%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-700 mr-2"></div>
                <span>Facebook</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">9.1K</span>
                <span className="text-xs text-red-500">-2%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    defaultSize: "medium"
  },
  {
    id: "email-metrics",
    name: "Email Campaign Metrics",
    description: "Performance metrics for email campaigns",
    category: "Marketing",
    component: (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Email Campaigns</CardTitle>
          <CardDescription>
            Performance metrics for email campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Open Rate</div>
                <div className="text-2xl font-bold">24.8%</div>
                <div className="text-xs text-green-500">+2.1% vs last month</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Click Rate</div>
                <div className="text-2xl font-bold">3.6%</div>
                <div className="text-xs text-green-500">+0.8% vs last month</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Conversion</div>
                <div className="text-2xl font-bold">2.4%</div>
                <div className="text-xs text-green-500">+0.3% vs last month</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Unsubscribe</div>
                <div className="text-2xl font-bold">0.8%</div>
                <div className="text-xs text-red-500">+0.1% vs last month</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    defaultSize: "medium"
  }
];

// Define default layout for marketing widgets
export const defaultMarketingLayout: LayoutSection[] = [
  {
    id: "marketing-metrics",
    title: "Marketing Metrics",
    widgets: ["campaign-performance", "social-media-performance", "email-metrics"]
  }
];