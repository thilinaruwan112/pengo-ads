import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { AnimatedCounter } from "./animated-counter";

interface KpiCardProps {
  title: string;
  value: number | string;
  description: string;
  Icon: LucideIcon;
  prefix?: string;
  suffix?: string;
}

export function KpiCard({ title, value, description, Icon, prefix, suffix }: KpiCardProps) {
  const isNumeric = typeof value === 'number';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
            {isNumeric ? (
                <AnimatedCounter 
                    value={value} 
                    prefix={prefix} 
                    suffix={suffix} 
                    decimals={Number.isInteger(value) ? 0 : 2}
                />
            ) : (
                <>{prefix}{value}{suffix}</>
            )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
