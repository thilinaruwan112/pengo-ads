
import { EditCompanyForm } from "./edit-form";
import type { Account } from "@/types";
import { accounts } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

async function getCompany(id: string): Promise<Account | undefined> {
  // In a real app, you'd fetch this from your API
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/companies/${id}`, { cache: 'no-store' });
  if (!res.ok) return undefined;
  return res.json();
}

export default async function EditCompanyPage({ params }: { params: { id: string } }) {
  // Check for 'new' to handle creation
  const isNew = params.id === 'new';
  const company = isNew ? null : await getCompany(params.id);

  if (!isNew && !company) {
    return (
        <div className="container mx-auto py-2">
            <h1 className="text-2xl font-bold">Company not found</h1>
            <p>The company you are looking for does not exist.</p>
             <Button asChild variant="outline" className="mt-4">
                <Link href="/dashboard/companies">
                    <ArrowLeft />
                    Back to Companies
                </Link>
            </Button>
        </div>
    )
  }

  const pageTitle = isNew ? "Add New Company" : "Edit Company";
  const pageDescription = isNew 
    ? "Fill in the form to register a new company." 
    : `Update the details for "${company?.companyName}".`;

  return (
    <div className="container mx-auto py-2">
      <div className="flex items-center mb-4 gap-4">
         <Button asChild variant="outline" size="icon">
            <Link href="/dashboard/companies">
                <ArrowLeft />
                <span className="sr-only">Back to Companies</span>
            </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          <p className="text-muted-foreground">
            {pageDescription}
          </p>
        </div>
      </div>
      <EditCompanyForm company={company} isNew={isNew} />
    </div>
  );
}
