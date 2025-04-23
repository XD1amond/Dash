"use client"

import { useTheme } from "next-themes"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { RevenueData } from "@/types/dashboard"

interface RevenueChartProps {
  data: RevenueData[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 0,
        }}
      >
        <XAxis
          dataKey="name"
          stroke={isDark ? "#888888" : "#888888"}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={isDark ? "#888888" : "#888888"}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <Card>
                  <CardContent className="py-2 px-3">
                    <p className="text-sm font-medium">{payload[0].payload.name}</p>
                    <p className="text-sm font-bold">${payload[0].value}</p>
                  </CardContent>
                </Card>
              )
            }
            return null
          }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke={isDark ? "#10b981" : "#10b981"}
          strokeWidth={2}
          dot={false}
          activeDot={{
            r: 6,
            style: { fill: isDark ? "#10b981" : "#10b981", opacity: 0.8 },
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}