"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetDefinition, LayoutSection } from "@/components/dashboard/customizable-layout";
import { WidgetWrapper } from "./widget-components";
import {
  CustomerSegmentItem,
  CustomerFeedbackItem
} from '@/config/data/types/customer.types';
import { RestAdapter } from '@/config/data/adapters/rest.adapter';

// Create a REST adapter for API calls

// Create a REST adapter for API calls
const restAdapter = new RestAdapter({
  baseUrl: '/api',
  debug: process.env.NODE_ENV === 'development'
});

// Function to fetch customer segmentation data
const fetchCustomerSegmentation = async (): Promise<CustomerSegmentItem[]> => {
  try {
    const response = await restAdapter.fetchData<{data: CustomerSegmentItem[]}>('customers/segmentation');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching customer segmentation data:', error);
    return [];
  }
};

// Function to fetch customer feedback data
const fetchCustomerFeedback = async (): Promise<CustomerFeedbackItem[]> => {
  try {
    const response = await restAdapter.fetchData<{data: CustomerFeedbackItem[]}>('customers/feedback');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching customer feedback data:', error);
    return [];
  }
};

// Function to fetch customer satisfaction data
const fetchCustomerSatisfaction = async (): Promise<{
  rating: string;
  reviewCount: string;
  change: string;
  period: string;
}> => {
  try {
    const response = await restAdapter.fetchData<{
      data: {
        rating: string;
        reviewCount: string;
        change: string;
        period: string;
      }
    }>('customers/satisfaction');
    
    if (response.data) {
      return response.data;
    } else {
      return {
        rating: "0.0/5.0",
        reviewCount: "0",
        change: "0.0",
        period: "from last quarter"
      };
    }
  } catch (error) {
    console.error('Error fetching customer satisfaction data:', error);
    return {
      rating: "0.0/5.0",
      reviewCount: "0",
      change: "0.0",
      period: "from last quarter"
    };
  }
};

// Placeholder for getRelatedWidgets function - will be defined after customerWidgets
let getRelatedWidgets: (widgetId: string) => any[] = () => [];

// Customer Segments Widget Component
interface CustomerSegmentsProps {
  data?: CustomerSegmentItem[];
}

const CustomerSegmentsWidget: React.FC<CustomerSegmentsProps> = ({ data = [] }) => {
  const [segmentData, setSegmentData] = useState<CustomerSegmentItem[]>(data);
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const [error, setError] = useState<string | null>(null);

  // Use the data directly without fetching
  useEffect(() => {
    // If we have data from props, use it
    if (data.length > 0) {
      setSegmentData(data);
      setLoading(false);
    } else {
      // Create mock data if no data is provided
      const mockData: CustomerSegmentItem[] = [
        { segment: "New Customers", count: "250", percentage: 25, value: "$12,500" },
        { segment: "Returning", count: "400", percentage: 40, value: "$28,000" },
        { segment: "Loyal", count: "200", percentage: 20, value: "$18,000" },
        { segment: "VIP", count: "150", percentage: 15, value: "$22,500" }
      ];
      setSegmentData(mockData);
      setLoading(false);
    }
  }, [data]);

  // Define segment colors
  const segmentColors = [
    'bg-purple-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-amber-500',
    'bg-red-500',
    'bg-gray-500'
  ];

  return (
    <WidgetWrapper
      title="Customer Segments"
      description="Distribution of customers by segment"
      chartId="customer-segments-chart"
      data={segmentData}
      relatedWidgets={getRelatedWidgets("customer-segments")}
    >
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            Loading segment data...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[200px] text-red-500">
            {error}
          </div>
        ) : segmentData.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            No segment data available
          </div>
        ) : (
          segmentData.map((segment, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${segmentColors[index % segmentColors.length]} mr-2`}></div>
                <span>{segment.segment}</span>
              </div>
              <span className="font-medium">{segment.percentage}%</span>
            </div>
          ))
        )}
      </div>
    </WidgetWrapper>
  );
};

// Customer Satisfaction Widget Component
interface CustomerSatisfactionProps {
  rating?: string;
  reviewCount?: string;
  change?: string;
  period?: string;
}

const CustomerSatisfactionWidget: React.FC<CustomerSatisfactionProps> = ({
  rating,
  reviewCount,
  change,
  period
}) => {
  const [satisfactionData, setSatisfactionData] = useState<{
    rating: string;
    reviewCount: string;
    change: string;
    period: string;
  }>({
    rating: rating || "0.0/5.0",
    reviewCount: reviewCount || "0",
    change: change || "0.0",
    period: period || "from last quarter"
  });
  const [loading, setLoading] = useState<boolean>(!rating);
  const [error, setError] = useState<string | null>(null);

  // Use the data directly without fetching
  useEffect(() => {
    // If we have data from props, use it
    if (rating) {
      setSatisfactionData({
        rating: rating,
        reviewCount: reviewCount || "0",
        change: change || "0.0",
        period: period || "from last quarter"
      });
      setLoading(false);
    } else {
      // Create mock data if no data is provided
      setSatisfactionData({
        rating: "4.2/5.0",
        reviewCount: "1,245",
        change: "+0.3",
        period: "from last quarter"
      });
      setLoading(false);
    }
  }, [rating, reviewCount, change, period]);

  // Calculate how many full stars to show based on rating
  const ratingValue = satisfactionData.rating ? parseFloat(satisfactionData.rating.split('/')[0]) : 0;
  const fullStars = Math.floor(ratingValue);
  
  return (
    <WidgetWrapper
      title="Customer Satisfaction"
      description="Customer satisfaction metrics"
      chartId="customer-satisfaction-chart"
      data={[satisfactionData]}
      relatedWidgets={getRelatedWidgets("customer-satisfaction")}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Loading satisfaction data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[200px]">
          <div className="text-4xl font-bold">{satisfactionData.rating}</div>
          <div className="flex items-center mt-2">
            {Array(5).fill(0).map((_, i) => (
              <svg key={i} className={`w-5 h-5 ${i < fullStars ? 'text-yellow-400' : 'text-yellow-200'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <div className="text-sm text-muted-foreground mt-2">Based on {satisfactionData.reviewCount} reviews</div>
          <div className="text-sm text-green-500 mt-1">{satisfactionData.change} {satisfactionData.period}</div>
        </div>
      )}
    </WidgetWrapper>
  );
};

// Customer Feedback Widget Component
interface CustomerFeedbackProps {
  data?: CustomerFeedbackItem[];
}

const CustomerFeedbackWidget: React.FC<CustomerFeedbackProps> = ({ data = [] }) => {
  const [feedbackData, setFeedbackData] = useState<CustomerFeedbackItem[]>(data);
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const [error, setError] = useState<string | null>(null);

  // Use the data directly without fetching
  useEffect(() => {
    // If we have data from props, use it
    if (data.length > 0) {
      setFeedbackData(data);
      setLoading(false);
    } else {
      // Create mock data if no data is provided
      const mockData = [
        { category: "Product Quality", positive: 75, neutral: 15, negative: 10 },
        { category: "Customer Service", positive: 80, neutral: 10, negative: 10 },
        { category: "Shipping Speed", positive: 65, neutral: 20, negative: 15 },
        { category: "Website Experience", positive: 70, neutral: 20, negative: 10 }
      ];
      setFeedbackData(mockData);
      setLoading(false);
    }
  }, [data]);

  return (
    <WidgetWrapper
      title="Customer Feedback"
      description="Feedback by category"
      chartId="customer-feedback-chart"
      data={feedbackData}
      relatedWidgets={getRelatedWidgets("customer-feedback")}
    >
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            Loading feedback data...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[200px] text-red-500">
            {error}
          </div>
        ) : feedbackData.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            No feedback data available
          </div>
        ) : (
          feedbackData.map((item, index) => (
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
          ))
        )}
      </div>
    </WidgetWrapper>
  );
};

// Define customer insights widgets with optional data parameters
export const createCustomerWidgets = (
  customerSegmentationData?: CustomerSegmentItem[],
  customerSatisfactionData?: {
    rating: string;
    reviewCount: string;
    change: string;
    period: string;
  },
  customerFeedbackData?: CustomerFeedbackItem[]
): WidgetDefinition[] => [
  {
    id: "customer-segments",
    name: "Customer Segments",
    description: "Distribution of customers by segment",
    category: "Customers",
    component: <CustomerSegmentsWidget data={customerSegmentationData || []} />,
    defaultSize: "medium"
  },
  {
    id: "customer-satisfaction",
    name: "Customer Satisfaction",
    description: "Customer satisfaction metrics",
    category: "Customers",
    component: customerSatisfactionData ?
      <CustomerSatisfactionWidget
        rating={customerSatisfactionData.rating}
        reviewCount={customerSatisfactionData.reviewCount}
        change={customerSatisfactionData.change}
        period={customerSatisfactionData.period}
      /> :
      <CustomerSatisfactionWidget />,
    defaultSize: "small"
  },
  {
    id: "customer-feedback",
    name: "Customer Feedback",
    description: "Feedback by category",
    category: "Customers",
    component: <CustomerFeedbackWidget data={customerFeedbackData || []} />,
    defaultSize: "large"
  }
];

// Export default customer widgets for backward compatibility
export const customerWidgets = createCustomerWidgets();

// Now that customerWidgets is defined, we can create the getRelatedWidgets function
getRelatedWidgets = (widgetId: string) => {
  const otherWidgets = customerWidgets.filter(w => w.id !== widgetId);
  return otherWidgets.slice(0, 2); // Return up to 2 related widgets
};

// Define default layout for customer widgets
export const defaultCustomerLayout: LayoutSection[] = [
  {
    id: "customer-metrics",
    title: "Customer Metrics",
    widgets: ["customer-segments", "customer-satisfaction", "customer-feedback"]
  }
];