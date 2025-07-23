
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { accounts } from "@/lib/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Campaign, Account } from "@/types";
import { useRouter } from "next/navigation";

interface CreateCampaignDialogProps {
    isClient?: boolean;
    clientAccountId?: string;
    clientAccounts?: Account[];
}

export function CreateCampaignDialog({ isClient = false, clientAccountId, clientAccounts = accounts }: CreateCampaignDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>(clientAccountId);
  const [status, setStatus] = useState<Campaign['status']>('active');
  const [platform, setPlatform] = useState<Campaign['platform']>('Facebook');
  const [reach, setReach] = useState("");
  const [impressions, setImpressions] = useState("");
  const [conversions, setConversions] = useState("");
  const [ctr, setCtr] = useState("");
  const [cpc, setCpc] = useState("");
  const [cpm, setCpm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  
  const handleAccountChange = (accountId: string) => {
    setSelectedAccount(accountId);
  }

  const handleSave = async () => {
    setIsSubmitting(true);
    const newCampaignData = {
      accountId: selectedAccount,
      name,
      description,
      status,
      platform,
      reach: parseInt(reach) || 0,
      impressions: parseInt(impressions) || 0,
      conversions: parseInt(conversions) || 0,
      ctr: parseFloat(ctr) || 0,
      cpc: parseFloat(cpc) || 0,
      cpm: parseFloat(cpm) || 0,
    };

    try {
        const response = await fetch('/api/campaigns', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCampaignData),
        });

        if (!response.ok) throw new Error('Failed to create campaign');
        
        toast({
            title: "Campaign Created",
            description: "Your new campaign has been successfully saved.",
        });
        
        // Reset state and close dialog
        setOpen(false);
        setName("");
        setDescription("");
        setSelectedAccount(isClient ? clientAccountId : "");
        setStatus("active");
        setPlatform("Facebook");
        setReach("");
        setImpressions("");
        setConversions("");
        setCtr("");
        setCpc("");
        setCpm("");

        router.refresh(); // Refresh the page to show the new campaign
    } catch (error) {
        toast({
            title: "Error",
            description: "Could not save the new campaign.",
            variant: "destructive"
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const isSaveDisabled = !name || !description || !selectedAccount || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Campaign</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Campaign</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new campaign.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="campaign-name" className="text-right">
                Name
                </Label>
                <Input
                id="campaign-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Summer Sale 2024"
                />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="campaign-description" className="text-right pt-2">
                Description
                </Label>
                <Textarea
                id="campaign-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                rows={3}
                placeholder="A compelling, short description for the ad copy."
                />
            </div>
             {!isClient && (
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="client-account" className="text-right">
                        Client
                    </Label>
                    <Select value={selectedAccount} onValueChange={handleAccountChange}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select an account" />
                        </SelectTrigger>
                        <SelectContent>
                            {clientAccounts.map(acc => (
                                <SelectItem key={acc.id} value={acc.id}>
                                    {acc.companyName} ({acc.clientName})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="platform" className="text-right">
                    Platform
                </Label>
                <Select value={platform} onValueChange={(val: Campaign['platform']) => setPlatform(val)}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                    Status
                </Label>
                <Select value={status} onValueChange={(val: Campaign['status']) => setStatus(val)}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reach" className="text-right">Reach</Label>
                <Input id="reach" type="number" value={reach} onChange={e => setReach(e.target.value)} className="col-span-3" placeholder="e.g., 15000" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="impressions" className="text-right">Impressions</Label>
                <Input id="impressions" type="number" value={impressions} onChange={e => setImpressions(e.target.value)} className="col-span-3" placeholder="e.g., 50000" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="conversions" className="text-right">Conversions</Label>
                <Input id="conversions" type="number" value={conversions} onChange={e => setConversions(e.target.value)} className="col-span-3" placeholder="e.g., 250" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ctr" className="text-right">CTR (%)</Label>
                <Input id="ctr" type="number" value={ctr} onChange={e => setCtr(e.target.value)} className="col-span-3" placeholder="e.g., 2.5" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cpc" className="text-right">CPC ($)</Label>
                <Input id="cpc" type="number" value={cpc} onChange={e => setCpc(e.target.value)} className="col-span-3" placeholder="e.g., 0.75" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cpm" className="text-right">CPM ($)</Label>
                <Input id="cpm" type="number" value={cpm} onChange={e => setCpm(e.target.value)} className="col-span-3" placeholder="e.g., 3.50" />
            </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={isSaveDisabled}>
            {isSubmitting ? 'Saving...' : 'Save Campaign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
