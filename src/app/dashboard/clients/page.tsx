import { users } from "@/lib/data"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"

export default function ClientsPage() {
  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground">
            View and manage client accounts.
          </p>
        </div>
        <Button>Add Client</Button>
      </div>
      <DataTable columns={columns} data={users} />
    </div>
  )
}
