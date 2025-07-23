
"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card"
import { cn } from "@/lib/utils"

const defaultData = [
  { date: "Jan", cost: 500, conversions: 50 },
  { date: "Feb", cost: 600, conversions: 70 },
  { date: "Mar", cost: 450, conversions: 60 },
  { date: "Apr", cost: 700, conversions: 90 },
  { date: "May", cost: 550, conversions: 80 },
  { date: "Jun", cost: 800, conversions: 120 },
]

interface CostAnalysisChartProps extends React.HTMLAttributes<HTMLDivElement> {
    data?: { date: string; cost: number; conversions: number }[];
}

export function CostAnalysisChart({ className, data }: CostAnalysisChartProps) {
  const chartData = data && data.length > 0 ? data : defaultData;
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Cost vs. Conversions</CardTitle>
        <CardDescription>Monthly trend of ad spend against conversions.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#888888" fontSize={12} />
            <YAxis yAxisId="left" stroke="hsl(var(--primary))" fontSize={12} tickFormatter={(value) => `$${value}`} />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" fontSize={12} />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))'
                }}
            />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="cost" name="Cost ($)" stroke="hsl(var(--primary))" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="conversions" name="Conversions" stroke="hsl(var(--accent))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
