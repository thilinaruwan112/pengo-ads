
"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

interface ReportData {
    name: string;
    client?: string;
    reach: number;
    impressions: number;
    results: number;
    spent: number;
    cpr: number;
}

interface CampaignReportTableProps {
    data: ReportData[];
}

export function CampaignReportTable({ data }: CampaignReportTableProps) {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Campaign Report</CardTitle>
            <CardDescription>Performance breakdown by individual campaign.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead className="text-right">Reach</TableHead>
                    <TableHead className="text-right">Results</TableHead>
                    <TableHead className="text-right">Spent</TableHead>
                    <TableHead className="text-right">CPR</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? data.map((row) => (
                    <TableRow key={row.name}>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell>{row.client}</TableCell>
                        <TableCell className="text-right">{row.reach.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{row.results.toLocaleString()}</TableCell>
                        <TableCell className="text-right">${row.spent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-right">${row.cpr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    </TableRow>
                    )) : (
                         <TableRow>
                            <TableCell colSpan={6} className="text-center">No campaign data for this period.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  )
}
