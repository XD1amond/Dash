"use client"

import { useTheme } from "next-themes"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { ConversionData } from "@/types/dashboard"

interface ConversionChartProps {
  data: ConversionData[]
}

export function ConversionChart({ data }: ConversionChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
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
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <Card>
                  <CardContent className="py-2 px-3">
                    <p className="text-sm font-medium">{payload[0].payload.name}</p>
                    <p className="text-sm font-bold">{payload[0].value}%</p>
                  </CardContent>
                </Card>
              )
            }
            return null
          }}
        />
        <Area
          type="monotone"
          dataKey="conversion"
          stroke="#8b5cf6"
          fill={isDark ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.1)"}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}