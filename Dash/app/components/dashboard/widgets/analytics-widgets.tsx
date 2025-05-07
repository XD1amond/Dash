"use client"

import React, { useState, useEffect } from 'react'
import { WidgetWrapper } from "./widget-components"
import {
  SalesFunnelDataPoint,
  CohortAnalysisDataPoint,
  ABTestingResult
} from '@/config/data/types';
import { RestAdapter } from '@/config/data/adapters/rest.adapter'

// Define mock data for fallback
const salesFunnelData: SalesFunnelDataPoint[] = [
  { stage: 'Visits', count: 24500, percentage: 100 },
  { stage: 'Product Views', count: 18300, percentage: 74.7 },
  { stage: 'Add to Cart', count: 7350, percentage: 30.0 },
  { stage: 'Checkout', count: 4900, percentage: 20.0 },
  { stage: 'Purchase', count: 3675, percentage: 15.0 }
];

const cohortAnalysisData: CohortAnalysisDataPoint[] = [
  { cohort: 'Jan 2023', 'Month 0': '100%', 'Month 1': '64%', 'Month 2': '48%', 'Month 3': '42%', 'Month 4': '38%', 'Month 5': '35%' },
  { cohort: 'Feb 2023', 'Month 0': '100%', 'Month 1': '68%', 'Month 2': '52%', 'Month 3': '45%', 'Month 4': '41%', 'Month 5': '' },
  { cohort: 'Mar 2023', 'Month 0': '100%', 'Month 1': '72%', 'Month 2': '56%', 'Month 3': '48%', 'Month 4': '', 'Month 5': '' },
  { cohort: 'Apr 2023', 'Month 0': '100%', 'Month 1': '75%', 'Month 2': '58%', 'Month 3': '', 'Month 4': '', 'Month 5': '' },
  { cohort: 'May 2023', 'Month 0': '100%', 'Month 1': '78%', 'Month 2': '', 'Month 3': '', 'Month 4': '', 'Month 5': '' },
  { cohort: 'Jun 2023', 'Month 0': '100%', 'Month 1': '', 'Month 2': '', 'Month 3': '', 'Month 4': '', 'Month 5': '' }
];

const abTestingData: ABTestingResult[] = [
  { test: 'Homepage Redesign', variant: 'A (Control)', metric: 'Conversion', value: '2.8%', change: '' },
  { test: 'Homepage Redesign', variant: 'B (Test)', metric: 'Conversion', value: '3.15%', change: '+12.5%' },
  { test: 'Checkout Flow', variant: 'A (Control)', metric: 'Completion', value: '62.4%', change: '' },
  { test: 'Checkout Flow', variant: 'B (Test)', metric: 'Completion', value: '67.8%', change: '+8.7%' },
  { test: 'Product Page CTA', variant: 'A (Control)', metric: 'Click Rate', value: '14.2%', change: '' },
  { test: 'Product Page CTA', variant: 'B (Test)', metric: 'Click Rate', value: '13.9%', change: '-2.1%' }
];

// Create a REST adapter for API calls
const restAdapter = new RestAdapter({
  baseUrl: '/api',
  debug: process.env.NODE_ENV === 'development'
});

// Function to fetch sales funnel data
const fetchSalesFunnel = async (): Promise<SalesFunnelDataPoint[]> => {
  try {
    const response = await restAdapter.fetchData<{data: SalesFunnelDataPoint[]}>('analytics/sales-funnel');
    return response.data.length > 0 ? response.data : salesFunnelData;
  } catch (error) {
    console.error('Error fetching sales funnel data:', error);
    return salesFunnelData;
  }
};

// Function to fetch cohort analysis data
const fetchCohortAnalysis = async (): Promise<CohortAnalysisDataPoint[]> => {
  try {
    const response = await restAdapter.fetchData<{data: CohortAnalysisDataPoint[]}>('analytics/cohort-analysis');
    return response.data.length > 0 ? response.data : cohortAnalysisData;
  } catch (error) {
    console.error('Error fetching cohort analysis data:', error);
    return cohortAnalysisData;
  }
};

// Function to fetch A/B testing data
const fetchABTesting = async (): Promise<ABTestingResult[]> => {
  try {
    const response = await restAdapter.fetchData<{data: ABTestingResult[]}>('analytics/ab-testing');
    return response.data.length > 0 ? response.data : abTestingData;
  } catch (error) {
    console.error('Error fetching A/B testing data:', error);
    return abTestingData;
  }
};

// Define the widget size type
type WidgetSize = "small" | "medium" | "large" | "full";

// Define props interfaces for each widget component
interface SalesFunnelWidgetProps {
  data: SalesFunnelDataPoint[];
}

interface CohortAnalysisWidgetProps {
  data: CohortAnalysisDataPoint[];
}

interface ABTestingWidgetProps {
  data: ABTestingResult[];
}

// Create functional components for each widget type
const SalesFunnelWidget: React.FC<SalesFunnelWidgetProps> = ({ data = [] }) => {
  const [funnelData, setFunnelData] = useState<SalesFunnelDataPoint[]>(data);
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (data.length === 0) {
        setLoading(true);
        try {
          const fetchedData = await fetchSalesFunnel();
          setFunnelData(fetchedData);
          setError(null);
        } catch (err) {
          setError('Failed to load sales funnel data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [data]);

  return (
    <WidgetWrapper
      title="Sales Funnel"
      description="Conversion funnel from visit to purchase"
      chartId="sales-funnel-chart"
      data={funnelData}
      relatedWidgets={getRelatedWidgets("sales-funnel")}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Loading sales funnel data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </div>
      ) : funnelData.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          No sales funnel data available
        </div>
      ) : (
        <div className="space-y-8 pt-4">
          {funnelData.map((item, index) => (
            <div key={index} className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{item.stage}</span>
                <span className="text-sm">{item.count.toLocaleString()}</span>
              </div>
              <div className="h-8 bg-blue-100 dark:bg-blue-900/30 w-full rounded-md">
                <div
                  className="h-8 bg-blue-500 dark:bg-blue-500/70 rounded-md"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </WidgetWrapper>
  );
};

const CohortAnalysisWidget: React.FC<CohortAnalysisWidgetProps> = ({ data = [] }) => {
  const [cohortData, setCohortData] = useState<CohortAnalysisDataPoint[]>(data);
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (data.length === 0) {
        setLoading(true);
        try {
          const fetchedData = await fetchCohortAnalysis();
          setCohortData(fetchedData);
          setError(null);
        } catch (err) {
          setError('Failed to load cohort analysis data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [data]);

  return (
    <WidgetWrapper
      title="Cohort Analysis"
      description="Customer retention by cohort"
      chartId="cohort-analysis-chart"
      data={cohortData}
      relatedWidgets={getRelatedWidgets("cohort-analysis")}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Loading cohort analysis data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </div>
      ) : cohortData.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          No cohort analysis data available
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left font-medium p-2">Cohort</th>
                <th className="text-center font-medium p-2">Month 0</th>
                <th className="text-center font-medium p-2">Month 1</th>
                <th className="text-center font-medium p-2">Month 2</th>
                <th className="text-center font-medium p-2">Month 3</th>
                <th className="text-center font-medium p-2">Month 4</th>
                <th className="text-center font-medium p-2">Month 5</th>
              </tr>
            </thead>
            <tbody>
              {cohortData.map((row, index) => (
                <tr key={index}>
                  <td className="p-2 font-medium">{row.cohort}</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">{row['Month 0']}</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">{row['Month 1']}</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">{row['Month 2']}</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">{row['Month 3']}</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">{row['Month 4']}</td>
                  <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">{row['Month 5']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </WidgetWrapper>
  );
};

const ABTestingWidget: React.FC<ABTestingWidgetProps> = ({ data = [] }) => {
  const [testingData, setTestingData] = useState<ABTestingResult[]>(data);
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [groupedTests, setGroupedTests] = useState<Record<string, ABTestingResult[]>>({});

  useEffect(() => {
    const loadData = async () => {
      if (data.length === 0) {
        setLoading(true);
        try {
          const fetchedData = await fetchABTesting();
          setTestingData(fetchedData);
          
          // Group tests by test name
          const grouped: Record<string, ABTestingResult[]> = {};
          fetchedData.forEach(item => {
            if (!grouped[item.test]) {
              grouped[item.test] = [];
            }
            grouped[item.test].push(item);
          });
          
          setGroupedTests(grouped);
          setError(null);
        } catch (err) {
          setError('Failed to load A/B testing data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        // Group the provided data
        const grouped: Record<string, ABTestingResult[]> = {};
        data.forEach(item => {
          if (!grouped[item.test]) {
            grouped[item.test] = [];
          }
          grouped[item.test].push(item);
        });
        setGroupedTests(grouped);
      }
    };

    loadData();
  }, [data]);

  // Calculate the change between control and test variants
  const calculateChange = (testGroup: ABTestingResult[]): { change: string, isPositive: boolean, winner: boolean } => {
    const control = testGroup.find(item => item.variant.includes('Control'));
    const test = testGroup.find(item => item.variant.includes('Test'));
    
    if (!control || !test) {
      return { change: '0%', isPositive: false, winner: false };
    }
    
    // Extract numeric values from the value strings
    const controlValue = parseFloat(control.value.replace('%', ''));
    const testValue = parseFloat(test.value.replace('%', ''));
    
    const diff = testValue - controlValue;
    const percentChange = (diff / controlValue) * 100;
    const isPositive = percentChange > 0;
    
    // Determine if the test is a winner (significant positive change)
    const winner = isPositive && Math.abs(percentChange) > 5;
    
    return {
      change: `${isPositive ? '+' : ''}${percentChange.toFixed(1)}%`,
      isPositive,
      winner
    };
  };

  return (
    <WidgetWrapper
      title="A/B Testing Results"
      description="Results from recent A/B tests"
      chartId="ab-testing-chart"
      data={testingData}
      relatedWidgets={getRelatedWidgets("ab-testing")}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Loading A/B testing data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </div>
      ) : Object.keys(groupedTests).length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          No A/B testing data available
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTests).map(([testName, testGroup], index) => {
            const { change, isPositive, winner } = calculateChange(testGroup);
            const control = testGroup.find(item => item.variant.includes('Control'));
            const test = testGroup.find(item => item.variant.includes('Test'));
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{testName}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {change} {control?.metric}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      winner
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : isPositive
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {winner ? 'Winner' : isPositive ? 'Promising' : 'Inconclusive'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {control && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">{control.variant}</div>
                      <div className="text-sm">{control.value} {control.metric}</div>
                    </div>
                  )}
                  {test && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">{test.variant}</div>
                      <div className="text-sm">{test.value} {test.metric}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </WidgetWrapper>
  );
};

// Define the analytics widgets with default empty data
export const analyticsWidgets = [
  {
    id: "sales-funnel",
    name: "Sales Funnel",
    description: "Conversion funnel from visit to purchase",
    category: "Analytics",
    component: <SalesFunnelWidget data={[]} />,
    defaultSize: "medium" as WidgetSize
  },
  {
    id: "cohort-analysis",
    name: "Cohort Analysis",
    description: "Customer retention by cohort",
    category: "Analytics",
    component: <CohortAnalysisWidget data={[]} />,
    defaultSize: "full" as WidgetSize
  },
  {
    id: "ab-testing",
    name: "A/B Testing Results",
    description: "Results from recent A/B tests",
    category: "Analytics",
    component: <ABTestingWidget data={[]} />,
    defaultSize: "medium" as WidgetSize
  }
];

// Now that analyticsWidgets is defined, we can create the getRelatedWidgets function
const getRelatedWidgets = (widgetId: string) => {
  const otherWidgets = analyticsWidgets.filter(w => w.id !== widgetId);
  return otherWidgets.slice(0, 2); // Return up to 2 related widgets
};

// No need to update widget components here as relatedWidgets are already set in each component

export const defaultAnalyticsLayout = [
  {
    id: "analytics-metrics",
    title: "Analytics Metrics",
    widgets: ["sales-funnel", "cohort-analysis", "ab-testing"]
  }
];