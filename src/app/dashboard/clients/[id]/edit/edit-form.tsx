
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { User, Account } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { MultiSelect } from "@/components/ui/multi-select";


interface EditClientFormProps {
    client: User;
    allAccounts: Account[];
}

export function EditClientForm({ client, allAccounts }: EditClientFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState(client.name);
  const [email, setEmail] = useState(client.email);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(client.adAccountIds || []);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const accountOptions = allAccounts.map(acc => ({
    value: acc.id,
    label: acc.companyName,
  }));

  const handleSave = async () => {
    setIsSubmitting(true);
    
    try {
        const response = await fetch(`/api/users/${client.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adAccountIds: selectedAccounts }),
        });

        if (!response.ok) throw new Error('Failed to update client');

        toast({
            title: "Client Updated",
            description: "The client's associated companies have been updated.",
        });
        router.push("/dashboard/clients");
        router.refresh();
    } catch (error) {
         toast({
            title: "Error",
            description: "Could not save client changes.",
            variant: "destructive"
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const isSaveDisabled = isSubmitting;

  return (
    <Card>
        <CardHeader>
            <CardTitle>Client Details</CardTitle>
            <CardDescription>Update client information and assigned companies.</CardDescription>
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

                <div className="space-y-2">
                    <Label htmlFor="companies">Assigned Companies</Label>
                    <MultiSelect
                        options={accountOptions}
                        selected={selectedAccounts}
                        onChange={setSelectedAccounts}
                        className="w-full"
                    />
                     <p className="text-sm text-muted-foreground">
                        Select one or more companies this client can access.
                    </p>
                </div>
                
                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaveDisabled}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
