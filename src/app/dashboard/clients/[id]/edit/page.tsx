
import { EditClientForm } from "./edit-form";
import type { User, Account } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { users, accounts } from "@/lib/data";

async function getClient(id: string): Promise<User | undefined> {
  return users.find(u => u.id === id);
}

async function getAllAccounts(): Promise<Account[]> {
    return accounts;
}

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const client = await getClient(params.id);
  const allAccounts = await getAllAccounts();

  if (!client) {
    return (
        <div className="container mx-auto py-2">
            <h1 className="text-2xl font-bold">Client not found</h1>
            <p>The client you are looking for does not exist.</p>
             <Button asChild variant="outline" className="mt-4">
                <Link href="/dashboard/clients">
                    <ArrowLeft />
                    Back to Clients
                </Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="container mx-auto py-2">
      <div className="flex items-center mb-4 gap-4">
         <Button asChild variant="outline" size="icon">
            <Link href="/dashboard/clients">
                <ArrowLeft />
                <span className="sr-only">Back to Clients</span>
            </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Client</h1>
          <p className="text-muted-foreground">
            Manage companies for "{client.name}".
          </p>
        </div>
      </div>
      <EditClientForm client={client} allAccounts={allAccounts} />
    </div>
  );
}
