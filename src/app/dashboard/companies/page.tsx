
import { Button } from "@/components/ui/button"
import type { Account } from "@/types"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import Link from "next/link"
import { accounts } from "@/lib/data"

async function getCompanies(): Promise<Account[]> {
  return accounts;
}

export default async function CompaniesPage() {
  const companies = await getCompanies();
  
  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Companies</h1>
          <p className="text-muted-foreground">
            View and manage all client companies.
          </p>
        </div>
        <Button asChild>
            <Link href="/dashboard/companies/new">Add Company</Link>
        </Button>
      </div>
        <DataTable columns={columns} data={companies} />
    </div>
  )
}
