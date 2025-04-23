"use client"

import { useTheme } from "next-themes"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { VisitorsData } from "@/types/dashboard"

interface VisitorsChartProps {
  data: VisitorsData[]
}

export function VisitorsChart({ data }: VisitorsChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const renderLegend = (props: any) => {
    const { payload } = props

    return (
      <div className="flex flex-wrap justify-center gap-4 text-xs">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-1">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={0}
          outerRadius={80}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload
              return (
                <Card>
                  <CardContent className="py-2 px-3">
                    <p className="text-sm font-medium">{data.name}</p>
                    <p className="text-sm font-bold">{data.value}%</p>
                  </CardContent>
                </Card>
              )
            }
            return null
          }}
        />
        <Legend content={renderLegend} verticalAlign="bottom" />
      </PieChart>
    </ResponsiveContainer>
  )
}