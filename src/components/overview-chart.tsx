
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card"
import { cn } from "@/lib/utils"

const defaultData = [
  { name: "Jan", reach: 4000, impressions: 2400 },
  { name: "Feb", reach: 3000, impressions: 1398 },
  { name: "Mar", reach: 2000, impressions: 9800 },
  { name: "Apr", reach: 2780, impressions: 3908 },
  { name: "May", reach: 1890, impressions: 4800 },
  { name: "Jun", reach: 2390, impressions: 3800 },
  { name: "Jul", reach: 3490, impressions: 4300 },
  { name: "Aug", reach: 3490, impressions: 4300 },
  { name: "Sep", reach: 2390, impressions: 3800 },
  { name: "Oct", reach: 1890, impressions: 4800 },
  { name: "Nov", reach: 2780, impressions: 3908 },
  { name: "Dec", reach: 2000, impressions: 9800 },
]

interface OverviewChartProps extends React.HTMLAttributes<HTMLDivElement> {
    data?: { name: string; reach: number; impressions: number }[];
    title?: string;
    description?: string;
}

export function OverviewChart({ className, data = defaultData, title = "Overview", description = "Monthly campaign reach and impressions." }: OverviewChartProps) {
  return (
    <Card className={cn(className)}>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data}>
                    <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    />
                    <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value / 1000}K`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            borderColor: 'hsl(var(--border))'
                        }}
                    />
                    <Legend />
                    <Bar dataKey="reach" fill="hsl(var(--primary))" name="Reach" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="impressions" fill="hsl(var(--accent))" name="Impressions" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
  )
}
