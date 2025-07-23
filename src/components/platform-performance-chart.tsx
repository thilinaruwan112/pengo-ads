
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

interface PlatformPerformanceChartProps {
    data?: { name: string; value: number; color: string }[];
}

export function PlatformPerformanceChart({ data = defaultData }: PlatformPerformanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Performance</CardTitle>
        <CardDescription>Results by platform</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))'
                }}
            />
            <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
