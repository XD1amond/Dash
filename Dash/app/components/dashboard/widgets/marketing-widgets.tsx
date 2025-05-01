import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetDefinition, LayoutSection } from "@/components/dashboard/customizable-layout";
import { WidgetWrapper } from "./widget-components";
import {
  campaignPerformanceData,
  socialMediaPerformanceData
} from "../../../../../demo/data/widget-data";

// Get related widgets for a given widget
const getRelatedWidgets = (widgetId: string) => {
  const otherWidgets = marketingWidgets.filter(w => w.id !== widgetId);
  return otherWidgets.slice(0, 2); // Return up to 2 related widgets
};

// Define marketing widgets
export const marketingWidgets: WidgetDefinition[] = [
  {
    id: "campaign-performance",
    name: "Campaign Performance",
    description: "Performance metrics for marketing campaigns",
    category: "Marketing",
    component: (
      <WidgetWrapper
        title="Campaign Performance"
        description="Performance metrics for marketing campaigns"
        chartId="campaign-performance-chart"
        data={campaignPerformanceData}
        relatedWidgets={getRelatedWidgets("campaign-performance")}
      >
        <div className="space-y-4">
          {campaignPerformanceData.map((campaign, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{campaign.campaign}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-green-500">{campaign.roi}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${campaign.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'}`}>
                    {campaign.status}
                  </span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${Math.min(parseInt(campaign.roi), 600) / 6}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Spend: {campaign.spend}</span>
                <span>Revenue: {campaign.revenue}</span>
              </div>
            </div>
          ))}
        </div>
      </WidgetWrapper>
    ),
    defaultSize: "large"
  },
  {
    id: "social-media-performance",
    name: "Social Media Performance",
    description: "Performance metrics for social media channels",
    category: "Marketing",
    component: (
      <WidgetWrapper
        title="Social Media"
        description="Performance by channel"
        chartId="social-media-performance-chart"
        data={socialMediaPerformanceData}
        relatedWidgets={getRelatedWidgets("social-media-performance")}
      >
        <div className="space-y-4">
          {socialMediaPerformanceData.map((platform, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${
                  platform.platform === 'Instagram' ? 'bg-blue-500' :
                  platform.platform === 'Twitter' ? 'bg-sky-500' :
                  platform.platform === 'YouTube' ? 'bg-red-500' :
                  platform.platform === 'Facebook' ? 'bg-blue-700' :
                  platform.platform === 'LinkedIn' ? 'bg-blue-900' :
                  'bg-purple-500'
                } mr-2`}></div>
                <span>{platform.platform}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">{platform.followers}</span>
                <span className={`text-xs ${parseFloat(platform.engagement) > 2 ? 'text-green-500' : 'text-red-500'}`}>
                  {platform.engagement}
                </span>
              </div>
            </div>
          ))}
        </div>
      </WidgetWrapper>
    ),
    defaultSize: "medium"
  },
  {
    id: "email-metrics",
    name: "Email Campaign Metrics",
    description: "Performance metrics for email campaigns",
    category: "Marketing",
    component: (
      <WidgetWrapper
        title="Email Campaigns"
        description="Performance metrics for email campaigns"
        chartId="email-metrics-chart"
        data={[
          { metric: "Open Rate", value: "24.8%", change: "+2.1%" },
          { metric: "Click Rate", value: "3.6%", change: "+0.8%" },
          { metric: "Conversion", value: "2.4%", change: "+0.3%" },
          { metric: "Unsubscribe", value: "0.8%", change: "+0.1%" }
        ]}
        relatedWidgets={getRelatedWidgets("email-metrics")}
      >
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
      </WidgetWrapper>
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