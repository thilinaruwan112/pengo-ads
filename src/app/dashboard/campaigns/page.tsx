
import { columns } from "./columns"
import { DataTable } from "./data-table"
import type { Campaign } from "@/types"
import { CampaignCard } from "./campaign-card"
import { CreateCampaignDialog } from "@/components/create-campaign-dialog"
import { ExcelImporter } from "@/components/excel-importer"

async function getCampaigns(): Promise<Campaign[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/campaigns`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage all ad campaigns fetched from Meta.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <ExcelImporter />
            <CreateCampaignDialog />
        </div>
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
