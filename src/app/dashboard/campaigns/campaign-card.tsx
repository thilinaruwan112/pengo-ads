
"use client"

import type { Campaign, DailyPerformance } from "@/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface CampaignCardProps {
  campaign: Campaign
}

function getLatestPerformance(campaign: Campaign): DailyPerformance | null {
    if (!campaign.dailyPerformance || campaign.dailyPerformance.length === 0) {
        return null;
    }
    // Sort by date descending and return the first element
    return campaign.dailyPerformance.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
}


export function CampaignCard({ campaign }: CampaignCardProps) {
  const status = campaign.status;
  const variant = status === "active" ? "default" : status === "paused" ? "secondary" : "destructive";
  const latestPerformance = getLatestPerformance(campaign);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-lg">{campaign.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
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
              <DropdownMenuItem>Assign client</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>{campaign.platform} - {campaign.resultType}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Status</span>
          <Badge variant={variant} className="capitalize">{campaign.status}</Badge>
        </div>
        {latestPerformance ? (
            <>
                <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Impressions</span>
                <span className="font-medium">{new Intl.NumberFormat().format(latestPerformance.impressions)}</span>
                </div>
                <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Results</span>
                <span className="font-medium">{new Intl.NumberFormat().format(latestPerformance.results)}</span>
                </div>
            </>
        ) : (
            <div className="text-sm text-muted-foreground">No performance data.</div>
        )}
      </CardContent>
    </Card>
  )
}
