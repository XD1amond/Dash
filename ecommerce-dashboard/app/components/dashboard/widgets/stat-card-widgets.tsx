"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatCardData } from "@/types/dashboard"

export interface StatCardWidgetProps {
  stats: StatCardData[]
  selectedStats: number[]
}

export function createStatCardWidgets(stats: StatCardData[]): any[] {
  return stats.map((stat, index) => ({
    id: `stat-card-${index}`,
    name: stat.title,
    description: `${stat.title} metric`,
    category: "Stats",
    component: (
      <Card>
        <CardContent className="p-6">
          <StatCard
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
          />
        </CardContent>
      </Card>
    ),
    defaultSize: "small"
  }));
}