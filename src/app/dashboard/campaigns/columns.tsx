
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
import type { Campaign } from "@/types"

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
    accessorKey: "impressions",
    header: "Impressions",
    cell: ({ row }) => {
        const amount = parseFloat(row.getValue("impressions"))
        return <div className="text-left font-medium">{new Intl.NumberFormat().format(amount)}</div>
    },
  },
  {
    accessorKey: "ctr",
    header: "CTR",
    cell: ({ row }) => {
        const amount = parseFloat(row.getValue("ctr"))
        return <div className="text-left font-medium">{amount.toFixed(2)}%</div>
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
                <Link href={`/dashboard/campaigns/${campaign.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(campaign.id)}
            >
              Copy campaign ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Assign Company</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
