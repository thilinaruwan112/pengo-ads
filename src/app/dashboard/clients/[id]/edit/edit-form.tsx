
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User, Account } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";


interface EditClientFormProps {
    client: User;
    allAccounts: Account[];
}

export function EditClientForm({ client, allAccounts }: EditClientFormProps) {
  const router = useRouter();

  const [name, setName] = useState(client.name);
  const [email, setEmail] = useState(client.email);
  
  const clientCompanies = allAccounts.filter(acc => client.adAccountIds?.includes(acc.id));

  return (
    <div className="grid gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Client Details</CardTitle>
                <CardDescription>View client information and their assigned companies.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="client-name">Name</Label>
                            <Input id="client-name" value={name} readOnly disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="client-email">Email</Label>
                            <Input id="client-email" value={email} readOnly disabled />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Assigned Companies</CardTitle>
                <CardDescription>This client has access to the following companies. Assignments are managed from the Companies page.</CardDescription>
            </CardHeader>
            <CardContent>
                {clientCompanies.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                        {clientCompanies.map(company => (
                            <li key={company.id} className="text-sm">{company.companyName}</li>
                        ))}
                    </ul>
                ): (
                    <p className="text-sm text-muted-foreground">No companies assigned to this client yet.</p>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
