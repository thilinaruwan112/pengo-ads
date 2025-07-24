
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
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
import type { Account } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "companyName",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Company Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    cell: ({ row }) => {
      const account = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={account.logoUrl} alt={account.companyName} data-ai-hint="logo" />
            <AvatarFallback>{account.companyName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{account.companyName}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "clientName",
    header: "Primary Contact",
  },
    {
    accessorKey: "campaigns",
    header: "Campaigns",
    cell: ({ row }) => {
        const campaigns = row.getValue("campaigns") as any[];
        return <span>{campaigns?.length || 0}</span>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const account = row.original

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
                <Link href={`/dashboard/companies/${account.id}/edit`}>Edit Company</Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
                <Link href={`/dashboard/campaigns?accountId=${account.id}`}>View Campaigns</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(account.id)}
            >
              Copy company ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
