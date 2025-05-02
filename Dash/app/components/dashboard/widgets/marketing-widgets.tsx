"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetDefinition, LayoutSection } from "@/components/dashboard/customizable-layout";
import { WidgetWrapper } from "./widget-components";
import { RestAdapter } from '@/config/data/adapters/rest.adapter';

// Define interfaces for marketing data
interface CampaignPerformance {
  campaign: string;
  roi: string;
  status: 'active' | 'completed' | 'planned';
  spend: string;
  revenue: string;
}

interface SocialMediaPerformance {
  platform: string;
  followers: string;
  engagement: string;
}

interface EmailMetrics {
  metric: string;
  value: string;
  change: string;
}

// Create a REST adapter for API calls
const restAdapter = new RestAdapter({
  baseUrl: '/api',
  debug: process.env.NODE_ENV === 'development'
});

// Function to fetch campaign performance data
const fetchCampaignPerformance = async (): Promise<CampaignPerformance[]> => {
  try {
    const response = await restAdapter.fetchData<{data: CampaignPerformance[]}>('marketing/campaigns');
    return response.data;
  } catch (error) {
    console.error('Error fetching campaign performance data:', error);
    return [];
  }
};

// Function to fetch social media performance data
const fetchSocialMediaPerformance = async (): Promise<SocialMediaPerformance[]> => {
  try {
    const response = await restAdapter.fetchData<{data: SocialMediaPerformance[]}>('marketing/social-media');
    return response.data;
  } catch (error) {
    console.error('Error fetching social media performance data:', error);
    return [];
  }
};

// Function to fetch email metrics data
const fetchEmailMetrics = async (): Promise<EmailMetrics[]> => {
  try {
    const response = await restAdapter.fetchData<{data: EmailMetrics[]}>('marketing/email-metrics');
    return response.data;
  } catch (error) {
    console.error('Error fetching email metrics data:', error);
    return [];
  }
};

// Create functional components for each widget type
interface CampaignPerformanceWidgetProps {
  data: CampaignPerformance[];
}

const CampaignPerformanceWidget: React.FC<CampaignPerformanceWidgetProps> = ({ data = [] }) => {
  const [campaignData, setCampaignData] = useState<CampaignPerformance[]>(data);
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (data.length === 0) {
        setLoading(true);
        try {
          const fetchedData = await fetchCampaignPerformance();
          setCampaignData(fetchedData);
          setError(null);
        } catch (err) {
          setError('Failed to load campaign performance data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [data]);

  // Function to get ROI color based on value
  const getRoiColor = (roi: string): string => {
    const roiValue = parseInt(roi);
    if (roiValue >= 300) return 'text-green-500';
    if (roiValue >= 200) return 'text-emerald-500';
    if (roiValue >= 100) return 'text-blue-500';
    return 'text-amber-500';
  };

  return (
    <WidgetWrapper
      title="Campaign Performance"
      description="Performance metrics for marketing campaigns"
      chartId="campaign-performance-chart"
      data={campaignData}
      relatedWidgets={getRelatedWidgets("campaign-performance")}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Loading campaign data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </div>
      ) : campaignData.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          No campaign data available
        </div>
      ) : (
        <div className="space-y-4">
          {campaignData.map((campaign, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{campaign.campaign}</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${getRoiColor(campaign.roi)}`}>{campaign.roi}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    campaign.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : campaign.status === 'completed'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                  }`}>
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
      )}
    </WidgetWrapper>
  );
};

interface SocialMediaPerformanceWidgetProps {
  data: SocialMediaPerformance[];
}

const SocialMediaPerformanceWidget: React.FC<SocialMediaPerformanceWidgetProps> = ({ data = [] }) => {
  const [socialData, setSocialData] = useState<SocialMediaPerformance[]>(data);
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (data.length === 0) {
        setLoading(true);
        try {
          const fetchedData = await fetchSocialMediaPerformance();
          setSocialData(fetchedData);
          setError(null);
        } catch (err) {
          setError('Failed to load social media data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [data]);

  // Function to get platform color
  const getPlatformColor = (platform: string): string => {
    switch (platform) {
      case 'Instagram': return 'bg-blue-500';
      case 'Twitter': return 'bg-sky-500';
      case 'YouTube': return 'bg-red-500';
      case 'Facebook': return 'bg-blue-700';
      case 'LinkedIn': return 'bg-blue-900';
      case 'TikTok': return 'bg-black';
      default: return 'bg-purple-500';
    }
  };

  return (
    <WidgetWrapper
      title="Social Media"
      description="Performance by channel"
      chartId="social-media-performance-chart"
      data={socialData}
      relatedWidgets={getRelatedWidgets("social-media-performance")}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Loading social media data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </div>
      ) : socialData.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          No social media data available
        </div>
      ) : (
        <div className="space-y-4">
          {socialData.map((platform, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${getPlatformColor(platform.platform)} mr-2`}></div>
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
      )}
    </WidgetWrapper>
  );
};

interface EmailMetricsWidgetProps {
  data: EmailMetrics[];
}

const EmailMetricsWidget: React.FC<EmailMetricsWidgetProps> = ({ data = [] }) => {
  const [emailData, setEmailData] = useState<EmailMetrics[]>(data);
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (data.length === 0) {
        setLoading(true);
        try {
          const fetchedData = await fetchEmailMetrics();
          setEmailData(fetchedData);
          setError(null);
        } catch (err) {
          setError('Failed to load email metrics data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [data]);

  // Function to determine if a change is positive based on the metric
  const isPositiveChange = (metric: string, change: string): boolean => {
    const isIncreasing = change.startsWith('+');
    
    // For metrics where an increase is good
    if (['Open Rate', 'Click Rate', 'Conversion Rate'].includes(metric)) {
      return isIncreasing;
    }
    
    // For metrics where a decrease is good
    if (['Unsubscribe Rate', 'Bounce Rate', 'Complaint Rate'].includes(metric)) {
      return !isIncreasing;
    }
    
    // Default case
    return isIncreasing;
  };

  return (
    <WidgetWrapper
      title="Email Campaigns"
      description="Performance metrics for email campaigns"
      chartId="email-metrics-chart"
      data={emailData}
      relatedWidgets={getRelatedWidgets("email-metrics")}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Loading email metrics data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </div>
      ) : emailData.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          No email metrics available
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {emailData.map((metric, index) => (
              <div key={index} className="space-y-1">
                <div className="text-sm text-muted-foreground">{metric.metric}</div>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className={`text-xs ${isPositiveChange(metric.metric, metric.change) ? 'text-green-500' : 'text-red-500'}`}>
                  {metric.change} vs last month
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </WidgetWrapper>
  );
};

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
    component: <CampaignPerformanceWidget data={[]} />,
    defaultSize: "large"
  },
  {
    id: "social-media-performance",
    name: "Social Media Performance",
    description: "Performance metrics for social media channels",
    category: "Marketing",
    component: <SocialMediaPerformanceWidget data={[]} />,
    defaultSize: "medium"
  },
  {
    id: "email-metrics",
    name: "Email Campaign Metrics",
    description: "Performance metrics for email campaigns",
    category: "Marketing",
    component: <EmailMetricsWidget data={[]} />,
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