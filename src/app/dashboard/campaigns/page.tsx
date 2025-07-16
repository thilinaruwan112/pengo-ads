import { campaigns } from "@/lib/data"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"

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
      <DataTable columns={columns} data={campaigns} />
    </div>
  )
}
