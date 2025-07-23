
"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip, Legend } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

const defaultData = [
  { name: "Facebook", value: 400, color: "hsl(var(--chart-1))" },
  { name: "Instagram", value: 300, color: "hsl(var(--chart-2))" },
  { name: "Other", value: 200, color: "hsl(var(--chart-3))" },
]

interface PlatformPerformanceChartProps  extends React.HTMLAttributes<HTMLDivElement> {
    data?: { name: string; value: number; color: string }[];
}

export function PlatformPerformanceChart({ className, data }: PlatformPerformanceChartProps) {
  const chartData = data && data.length > 0 ? data : defaultData;
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Platform Performance</CardTitle>
        <CardDescription>Results by platform</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))'
                }}
            />
            <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
