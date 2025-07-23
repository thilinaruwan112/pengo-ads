
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
import type { Campaign, Account, DailyPerformance } from "@/types";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

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
  const [date, setDate] = useState<Date>();
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

  const resetForm = () => {
    setName("");
    setDescription("");
    setSelectedAccount(isClient ? clientAccountId : "");
    setStatus("active");
    setPlatform("Facebook");
    setDate(undefined);
    setReach("");
    setImpressions("");
    setConversions("");
    setCtr("");
    setCpc("");
    setCpm("");
  }

  const handleSave = async () => {
    if (!date) {
        toast({
            title: "Validation Error",
            description: "Please select a date for the initial performance record.",
            variant: "destructive"
        });
        return;
    }

    setIsSubmitting(true);

    const initialPerformance: DailyPerformance = {
        date: format(date, "yyyy-MM-dd"),
        reach: parseInt(reach) || 0,
        impressions: parseInt(impressions) || 0,
        conversions: parseInt(conversions) || 0,
        ctr: parseFloat(ctr) || 0,
        cpc: parseFloat(cpc) || 0,
        cpm: parseFloat(cpm) || 0,
    }

    const newCampaignData = {
      accountId: selectedAccount,
      name,
      description,
      status,
      platform,
      dailyPerformance: [initialPerformance]
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
        
        setOpen(false);
        resetForm();
        router.refresh(); 
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

  const isSaveDisabled = !name || !description || !selectedAccount || !date || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Campaign</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Campaign</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new campaign and its initial daily performance record.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="campaign-name">Name</Label>
                    <Input id="campaign-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Summer Sale 2024" />
                </div>
                {!isClient && (
                    <div className="space-y-2">
                        <Label htmlFor="client-account">Client Account</Label>
                        <Select value={selectedAccount} onValueChange={handleAccountChange}>
                            <SelectTrigger id="client-account">
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
            </div>

            <div className="space-y-2">
                <Label htmlFor="campaign-description">Description</Label>
                <Textarea id="campaign-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="A compelling, short description for the ad copy." />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select value={platform} onValueChange={(val: Campaign['platform']) => setPlatform(val)}>
                        <SelectTrigger id="platform">
                            <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Facebook">Facebook</SelectItem>
                            <SelectItem value="Instagram">Instagram</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={(val: Campaign['status']) => setStatus(val)}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="paused">Paused</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            <div className="border-t pt-6">
                 <h4 className="text-md font-medium mb-4">Initial Performance Record</h4>
                 <div className="grid md:grid-cols-3 gap-6">
                     <div className="space-y-2 md:col-span-3">
                         <Label htmlFor="date">Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                     </div>
                    <div className="space-y-2">
                        <Label htmlFor="reach">Reach</Label>
                        <Input id="reach" type="number" value={reach} onChange={e => setReach(e.target.value)} placeholder="e.g., 15000" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="impressions">Impressions</Label>
                        <Input id="impressions" type="number" value={impressions} onChange={e => setImpressions(e.target.value)} placeholder="e.g., 50000" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="conversions">Conversions</Label>
                        <Input id="conversions" type="number" value={conversions} onChange={e => setConversions(e.target.value)} placeholder="e.g., 250" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ctr">CTR (%)</Label>
                        <Input id="ctr" type="number" value={ctr} onChange={e => setCtr(e.target.value)} placeholder="e.g., 2.5" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="cpc">CPC ($)</Label>
                        <Input id="cpc" type="number" value={cpc} onChange={e => setCpc(e.target.value)} placeholder="e.g., 0.75" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="cpm">CPM ($)</Label>
                        <Input id="cpm" type="number" value={cpm} onChange={e => setCpm(e.target.value)} placeholder="e.g., 3.50" />
                    </div>
                </div>
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
