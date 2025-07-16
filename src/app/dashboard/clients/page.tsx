import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import type { User } from "@/types"
import { ClientCard } from "./client-card"

async function getUsers(): Promise<User[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/users`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch users')
  }
  return res.json();
}


export default async function ClientsPage() {
  const users = await getUsers();
  
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
      <div className="hidden md:block">
        <DataTable columns={columns} data={users} />
      </div>
       <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {users.map((user: User) => (
            <ClientCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}
