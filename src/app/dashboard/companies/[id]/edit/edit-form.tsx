
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Account, User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface EditCompanyFormProps {
    company: Account | null;
    isNew: boolean;
    clients: User[];
}

export function EditCompanyForm({ company, isNew, clients }: EditCompanyFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const getInitialClientId = () => {
    if (company) {
        const client = clients.find(c => c.adAccountIds.includes(company.id));
        return client?.id;
    }
    return undefined;
  }
  const initialClientId = getInitialClientId();

  const [companyName, setCompanyName] = useState(company?.companyName || "");
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(initialClientId);
  const [logoUrl, setLogoUrl] = useState(company?.logoUrl || "");
  const [address, setAddress] = useState(company?.address || "");
  const [employeeRange, setEmployeeRange] = useState(company?.employeeRange || "");
  const [facebook, setFacebook] = useState(company?.socialLinks?.facebook || "");
  const [instagram, setInstagram] = useState(company?.socialLinks?.instagram || "");
  const [linkedin, setLinkedin] = useState(company?.socialLinks?.linkedin || "");
  const [twitter, setTwitter] = useState(company?.socialLinks?.twitter || "");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (company) {
        setSelectedClientId(initialClientId);
    }
  }, [company, initialClientId]);


  const handleSave = async () => {
    setIsSubmitting(true);
    
    const selectedClient = clients.find(c => c.id === selectedClientId);

    if (!selectedClient) {
        toast({ title: "Error", description: "You must select a client.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }

    const clientName = selectedClient.name;
    
    const companyData: Partial<Account> = {
      companyName,
      clientName,
      logoUrl,
      address,
      employeeRange,
      socialLinks: { facebook, instagram, linkedin, twitter },
    };

    const url = isNew ? `/api/companies` : `/api/companies/${company?.id}`;
    const method = isNew ? 'POST' : 'PATCH';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(companyData),
        });

        if (!response.ok) throw new Error(`Failed to ${isNew ? 'create' : 'update'} company`);
        
        const savedCompany = await response.json();

        // If the client has changed, update both old and new clients
        if (initialClientId !== selectedClientId) {
            // Remove from old client if there was one
            if (initialClientId) {
                const oldClient = clients.find(c => c.id === initialClientId);
                if (oldClient) {
                    const updatedAdAccountIds = oldClient.adAccountIds.filter(id => id !== savedCompany.id);
                     await fetch(`/api/users/${oldClient.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ adAccountIds: updatedAdAccountIds })
                    });
                }
            }
             // Add to new client
            const newClient = clients.find(c => c.id === selectedClientId);
             if (newClient) {
                const updatedAdAccountIds = [...newClient.adAccountIds, savedCompany.id];
                await fetch(`/api/users/${newClient.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ adAccountIds: updatedAdAccountIds })
                });
             }
        }
        

        toast({
            title: isNew ? "Company Created" : "Company Updated",
            description: `The company details have been successfully saved.`,
        });
        router.push("/dashboard/companies");
        router.refresh();
    } catch (error: any) {
         toast({
            title: "Error",
            description: error.message || `Could not save company details.`,
            variant: "destructive"
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const isSaveDisabled = isSubmitting || !companyName || !selectedClientId;

  return (
    <div className="grid gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Update the core details of the company.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="company-name">Company Name</Label>
                            <Input
                                id="company-name"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="e.g., Acme Inc."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="client-name">Primary Client</Label>
                             <Select 
                                value={selectedClientId} 
                                onValueChange={setSelectedClientId}
                            >
                                <SelectTrigger id="client-name">
                                    <SelectValue placeholder="Select a client..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients.map(client => (
                                        <SelectItem key={client.id} value={client.id}>
                                            {client.name} ({client.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="logo-url">Logo URL</Label>
                        <Input
                            id="logo-url"
                            value={logoUrl}
                            onChange={(e) => setLogoUrl(e.target.value)}
                            placeholder="https://example.com/logo.png"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="123 Main St, Anytown, USA 12345"
                        />
                    </div>

                     <div className="space-y-2">
                        <Label htmlFor="employee-range">Number of Employees</Label>
                        <Select value={employeeRange} onValueChange={setEmployeeRange}>
                            <SelectTrigger id="employee-range">
                                <SelectValue placeholder="Select a range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1-10">1-10</SelectItem>
                                <SelectItem value="11-50">11-50</SelectItem>
                                <SelectItem value="51-200">51-200</SelectItem>
                                <SelectItem value="201-500">201-500</SelectItem>
                                <SelectItem value="501+">501+</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>Enter the company's social media profile URLs.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input id="facebook" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="https://facebook.com/..." />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input id="instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/..." />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input id="linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/company/..." />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter / X</Label>
                        <Input id="twitter" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://twitter.com/..." />
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaveDisabled}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
        </div>
    </div>
  );
}
