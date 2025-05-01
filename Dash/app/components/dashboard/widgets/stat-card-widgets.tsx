"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatCardData } from "@/types/dashboard"
import { WidgetWrapper } from "./widget-components"

export interface StatCardWidgetProps {
  stats: StatCardData[]
  selectedStats: number[]
}

// Get related widgets for a given widget
const getRelatedWidgets = (widgetId: string, allWidgets: any[]) => {
  const otherWidgets = allWidgets.filter(w => w.id !== widgetId);
  return otherWidgets.slice(0, 2); // Return up to 2 related widgets
};

export function createStatCardWidgets(stats: StatCardData[]): any[] {
  const widgets = stats.map((stat, index) => ({
    id: `stat-card-${index}`,
    name: stat.title,
    description: `${stat.title} metric`,
    category: "Stats",
    component: null, // Placeholder to be filled after all widgets are created
    defaultSize: "small"
  }));
  
  // Now that we have all widgets, we can set up the components with proper related widgets
  return widgets.map((widget, index) => {
    const stat = stats[index];
    return {
      ...widget,
      component: (
        <WidgetWrapper
          title={stat.title}
          description={`${stat.title} metric`}
          chartId={`stat-card-${index}-chart`}
          data={[{
            metric: stat.title,
            value: stat.value,
            change: `${stat.change}%`,
            direction: stat.changeType
          }]}
          relatedWidgets={getRelatedWidgets(`stat-card-${index}`, widgets)}
        >
          <div className="p-2">
            <StatCard
              title={stat.title}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
            />
          </div>
        </WidgetWrapper>
      )
    };
  });
}