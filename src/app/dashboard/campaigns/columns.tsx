
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import type { Campaign, DailyPerformance } from "@/types"

function getLatestPerformance(campaign: Campaign): DailyPerformance | null {
    if (!campaign.dailyPerformance || campaign.dailyPerformance.length === 0) {
        return null;
    }
    return campaign.dailyPerformance.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
}

export const columns: ColumnDef<Campaign>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant = status === "active" ? "default" : status === "paused" ? "secondary" : "destructive";
      return <Badge variant={variant} className="capitalize">{status}</Badge>;
    },
  },
  {
    accessorKey: "platform",
    header: "Platform",
  },
  {
    accessorKey: "results",
    header: "Results",
    cell: ({ row }) => {
        const campaign = row.original;
        const latest = getLatestPerformance(campaign);
        if (!latest) return <div className="text-left">-</div>;
        const amount = latest.results;
        return <div className="text-left font-medium">{new Intl.NumberFormat().format(amount)}</div>
    },
  },
    {
    accessorKey: "impressions",
    header: "Impressions",
    cell: ({ row }) => {
        const campaign = row.original;
        const latest = getLatestPerformance(campaign);
        if (!latest) return <div className="text-left">-</div>;
        const amount = latest.impressions;
        return <div className="text-left font-medium">{new Intl.NumberFormat().format(amount)}</div>
    },
  },
    {
    accessorKey: "amountSpent",
    header: "Amount Spent",
    cell: ({ row }) => {
        const campaign = row.original;
        const latest = getLatestPerformance(campaign);
        if (!latest || latest.amountSpent === undefined) return <div className="text-left">-</div>;
        const amount = latest.amountSpent;
        return <div className="text-left font-medium">{campaign.currency} {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    },
  },
  {
    accessorKey: "linked",
    header: "Linked",
    cell: ({ row }) => {
      return <Switch checked={row.getValue("linked")} aria-label="Link campaign" />
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const campaign = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
                <Link href={`/dashboard/campaigns/${campaign.id}/edit`}>Edit / View Details</Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
                <Link href={`/dashboard/campaigns/${campaign.id}/add-record`}>Add Daily Record</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(campaign.id)}
            >
              Copy campaign ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Assign Company</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
