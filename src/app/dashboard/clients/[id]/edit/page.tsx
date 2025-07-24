
import { EditClientForm } from "./edit-form";
import type { User, Account } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

async function getClient(id: string): Promise<User | undefined> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/users/${id}`, { cache: 'no-store' });
  if (!res.ok) return undefined;
  return res.json();
}

async function getAllAccounts(): Promise<Account[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/companies`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
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
