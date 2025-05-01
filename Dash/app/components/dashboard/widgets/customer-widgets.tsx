import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetDefinition, LayoutSection } from "@/components/dashboard/customizable-layout";
import { WidgetWrapper } from "./widget-components";
import {
  customerSegmentationData,
  customerFeedbackData
} from "../../../../../demo/data/widget-data";

// Get related widgets for a given widget
const getRelatedWidgets = (widgetId: string) => {
  const otherWidgets = customerWidgets.filter(w => w.id !== widgetId);
  return otherWidgets.slice(0, 2); // Return up to 2 related widgets
};

// Define customer insights widgets
export const customerWidgets: WidgetDefinition[] = [
  {
    id: "customer-segments",
    name: "Customer Segments",
    description: "Distribution of customers by segment",
    category: "Customers",
    component: (
      <WidgetWrapper
        title="Customer Segments"
        description="Distribution of customers by segment"
        chartId="customer-segments-chart"
        data={customerSegmentationData}
        relatedWidgets={getRelatedWidgets("customer-segments")}
      >
        <div className="space-y-4">
          {customerSegmentationData.map((segment, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full bg-${index === 0 ? 'purple' : index === 1 ? 'blue' : index === 2 ? 'green' : 'gray'}-500 mr-2`}></div>
                <span>{segment.segment}</span>
              </div>
              <span className="font-medium">{segment.percentage}%</span>
            </div>
          ))}
        </div>
      </WidgetWrapper>
    ),
    defaultSize: "medium"
  },
  {
    id: "customer-satisfaction",
    name: "Customer Satisfaction",
    description: "Customer satisfaction metrics",
    category: "Customers",
    component: (
      <WidgetWrapper
        title="Customer Satisfaction"
        description="Customer satisfaction metrics"
        chartId="customer-satisfaction-chart"
        data={customerFeedbackData}
        relatedWidgets={getRelatedWidgets("customer-satisfaction")}
      >
        <div className="flex flex-col items-center justify-center h-[200px]">
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
      </WidgetWrapper>
    ),
    defaultSize: "small"
  },
  {
    id: "customer-feedback",
    name: "Customer Feedback",
    description: "Feedback by category",
    category: "Customers",
    component: (
      <WidgetWrapper
        title="Customer Feedback"
        description="Feedback by category"
        chartId="customer-feedback-chart"
        data={customerFeedbackData}
        relatedWidgets={getRelatedWidgets("customer-feedback")}
      >
        <div className="space-y-4">
          {customerFeedbackData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{item.category}</span>
                <span className="font-medium">{item.positive}% positive</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full flex">
                  <div className="h-full bg-green-500" style={{ width: `${item.positive}%` }}></div>
                  <div className="h-full bg-gray-300" style={{ width: `${item.neutral}%` }}></div>
                  <div className="h-full bg-red-500" style={{ width: `${item.negative}%` }}></div>
                </div>
              </div>
              <div className="flex text-xs text-muted-foreground justify-between">
                <span>Positive: {item.positive}%</span>
                <span>Neutral: {item.neutral}%</span>
                <span>Negative: {item.negative}%</span>
              </div>
            </div>
          ))}
        </div>
      </WidgetWrapper>
    ),
    defaultSize: "large"
  }
];

// Define default layout for customer widgets
export const defaultCustomerLayout: LayoutSection[] = [
  {
    id: "customer-metrics",
    title: "Customer Metrics",
    widgets: ["customer-segments", "customer-satisfaction", "customer-feedback"]
  }
];