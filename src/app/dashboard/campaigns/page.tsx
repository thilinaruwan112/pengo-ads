import { campaigns } from "@/lib/data"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { CampaignCard } from "./campaign-card"
import type { Campaign } from "@/types"

export default function CampaignsPage() {
  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage all ad campaigns fetched from Meta.
          </p>
        </div>
        <Button>Add Campaign</Button>
      </div>
      <div className="hidden md:block">
        <DataTable columns={columns} data={campaigns} />
      </div>
      <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {campaigns.map((campaign: Campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  )
}
