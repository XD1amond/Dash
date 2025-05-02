"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatCardData } from "@/types/dashboard"
import { WidgetWrapper } from "./widget-components"
import { WidgetDefinition } from "@/components/dashboard/customizable-layout"
import { RestAdapter } from '@/config/data/adapters/rest.adapter'
import { StatCardDataPoint } from '@/config/data/types'

export interface StatCardWidgetProps {
  stats: StatCardData[]
  selectedStats: number[]
}

// Create a REST adapter for API calls
const restAdapter = new RestAdapter({
  baseUrl: '/api',
  debug: process.env.NODE_ENV === 'development'
});

// Function to fetch stat card data
const fetchStatCardData = async (): Promise<StatCardData[]> => {
  try {
    const response = await restAdapter.fetchData<StatCardDataPoint[]>('analytics/stats');
    
    // Convert from API format to component format
    return response.map(item => ({
      title: item.title,
      value: item.value,
      change: item.change,
      changeType: item.changeType
    }));
  } catch (error) {
    console.error('Error fetching stat card data:', error);
    return [];
  }
};

// Create a functional component for a single stat card
interface SingleStatCardWidgetProps {
  data?: StatCardData | null;
}

const SingleStatCardWidget: React.FC<SingleStatCardWidgetProps> = ({ data }) => {
  const [statData, setStatData] = useState<StatCardData | null>(data || null);
  const [loading, setLoading] = useState<boolean>(!data);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!data) {
        setLoading(true);
        try {
          const fetchedData = await fetchStatCardData();
          // If we don't have specific data, just use the first item from the fetched data
          if (fetchedData.length > 0) {
            setStatData(fetchedData[0]);
          }
          setError(null);
        } catch (err) {
          setError('Failed to load stat card data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setStatData(data);
      }
    };

    loadData();
  }, [data]);

  if (loading) {
    return (
      <WidgetWrapper
        title="Loading..."
        description="Loading stat card data"
        chartId="loading-stat-card-chart"
        data={[]}
        relatedWidgets={[]}
      >
        <div className="flex items-center justify-center h-[100px] text-muted-foreground">
          Loading stat card data...
        </div>
      </WidgetWrapper>
    );
  }

  if (error || !statData) {
    return (
      <WidgetWrapper
        title="Error"
        description="Error loading stat card data"
        chartId="error-stat-card-chart"
        data={[]}
        relatedWidgets={[]}
      >
        <div className="flex items-center justify-center h-[100px] text-red-500">
          {error || 'Failed to load stat card data'}
        </div>
      </WidgetWrapper>
    );
  }

  return (
    <WidgetWrapper
      title={statData.title}
      description={`${statData.title} metric`}
      chartId={`stat-card-${statData.title.toLowerCase().replace(/\s+/g, '-')}-chart`}
      data={[{
        metric: statData.title,
        value: statData.value,
        change: `${statData.change}%`,
        direction: statData.changeType
      }]}
      relatedWidgets={[]} // Will be updated by the dashboard system
    >
      <div className="p-2">
        <StatCard
          title={statData.title}
          value={statData.value}
          change={statData.change}
          changeType={statData.changeType}
        />
      </div>
    </WidgetWrapper>
  );
};

// Get related widgets for a given widget
const getRelatedWidgets = (widgetId: string, allWidgets: WidgetDefinition[]) => {
  const otherWidgets = allWidgets.filter(w => w.id !== widgetId);
  return otherWidgets.slice(0, 2); // Return up to 2 related widgets
};

export function createStatCardWidgets(stats: StatCardData[] = []): WidgetDefinition[] {
  if (stats.length === 0) {
    // If no stats are provided, create a widget that will fetch data on its own
    return [{
      id: `stat-card-default`,
      name: "Key Metric",
      description: "Key performance metric",
      category: "Stats",
      component: <SingleStatCardWidget />,
      defaultSize: "small"
    }];
  }
  
  return stats.map((stat, index) => ({
    id: `stat-card-${index}`,
    name: stat.title,
    description: `${stat.title} metric`,
    category: "Stats",
    component: <SingleStatCardWidget data={stat} />,
    defaultSize: "small"
  }));
}