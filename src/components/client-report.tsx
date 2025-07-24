
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Separator } from "./ui/separator";

export interface ClientReportData {
    client: string;
    companyName: string;
    reach: number;
    impressions: number;
    results: number;
    spent: number;
    campaigns: number;
    cpr: number; // Cost Per Result
}

interface ClientReportProps {
    data: ClientReportData[];
}

export function ClientReport({ data }: ClientReportProps) {
    if (data.length === 0) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Client Report</CardTitle>
                <CardDescription>Performance breakdown by client.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {data.map((item) => (
                        <Card key={item.client} className="flex flex-col">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base">{item.companyName}</CardTitle>
                                <CardDescription>{item.client} &middot; {item.campaigns} campaign(s)</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-3">
                                 <div className="flex justify-between items-baseline">
                                    <span className="text-sm text-muted-foreground">Reach</span>
                                    <span className="font-semibold">{item.reach.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm text-muted-foreground">Results</span>
                                    <span className="font-semibold">{item.results.toLocaleString()}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm text-muted-foreground">Total Spent</span>
                                    <span className="font-semibold">${item.spent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm text-muted-foreground">Cost Per Result</span>
                                    <span className="font-semibold">${item.cpr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
