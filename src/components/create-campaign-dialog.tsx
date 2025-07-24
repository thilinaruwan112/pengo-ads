
"use client"

import { useState, useEffect } from "react";
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
import { accounts as mockAccounts, users as mockUsers } from "@/lib/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Campaign, Account, DailyPerformance, User } from "@/types";
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

export function CreateCampaignDialog({ isClient = false, clientAccountId, clientAccounts: initialClientAccounts = mockAccounts }: CreateCampaignDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Campaign Details
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>(clientAccountId);
  const [status, setStatus] = useState<Campaign['status']>('active');
  const [platform, setPlatform] = useState<Campaign['platform']>('Facebook');
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Campaign['gender']>("All");
  const [pageName, setPageName] = useState("");
  const [attributionSetting, setAttributionSetting] = useState("");
  const [resultType, setResultType] = useState("");
  const [currency, setCurrency] = useState("USD");

  // Client and Company filtering
  const [clients, setClients] = useState<User[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>();
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>(initialClientAccounts);

  // Initial Performance Record
  const [date, setDate] = useState<Date>();
  const [reach, setReach] = useState("");
  const [impressions, setImpressions] = useState("");
  const [results, setResults] = useState("");
  const [ctr, setCtr] = useState("");
  const [cpc, setCpc] = useState("");
  const [cpm, setCpm] = useState("");
  const [frequency, setFrequency] = useState("");
  const [amountSpent, setAmountSpent] = useState("");
  const [costPerResult, setCostPerResult] = useState("");
  const [linkClicks, setLinkClicks] = useState("");

  useEffect(() => {
    setClients(mockUsers.filter(u => u.role === 'client'));
  }, []);

  useEffect(() => {
    if (isClient) {
        setFilteredAccounts(initialClientAccounts);
    } else if (selectedClientId) {
        const client = mockUsers.find(u => u.id === selectedClientId);
        if (client) {
            setFilteredAccounts(mockAccounts.filter(acc => client.adAccountIds.includes(acc.id)));
        }
    } else {
        setFilteredAccounts([]);
    }
    // Reset company selection when client changes
    setSelectedAccount(undefined);
  }, [selectedClientId, isClient, initialClientAccounts]);


  const resetForm = () => {
    setName("");
    setDescription("");
    setSelectedAccount(isClient ? clientAccountId : "");
    setSelectedClientId(undefined);
    setStatus("active");
    setPlatform("Facebook");
    setAge("");
    setGender("All");
    setPageName("");
    setAttributionSetting("");
    setResultType("");
    setCurrency("USD");
    setDate(undefined);
    setReach("");
    setImpressions("");
    setResults("");
    setCtr("");
    setCpc("");
    setCpm("");
    setFrequency("");
    setAmountSpent("");
    setCostPerResult("");
    setLinkClicks("");
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
        results: parseInt(results) || 0,
        ctr: parseFloat(ctr) || 0,
        cpc: parseFloat(cpc) || 0,
        cpm: parseFloat(cpm) || 0,
        frequency: parseFloat(frequency) || 0,
        amountSpent: parseFloat(amountSpent) || 0,
        costPerResult: parseFloat(costPerResult) || 0,
        linkClicks: parseInt(linkClicks) || 0,
    }

    const newCampaign: Campaign = {
        id: `CAM${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        name,
        description,
        status,
        platform,
        age,
        gender,
        pageName,
        attributionSetting,
        resultType,
        currency,
        dailyPerformance: [initialPerformance],
        linked: true,
    };
    
    try {
        const account = mockAccounts.find(acc => acc.id === selectedAccount);
        if (!account) {
            throw new Error("Account not found");
        }
        account.campaigns.push(newCampaign);
        
        toast({
            title: "Campaign Created",
            description: "Your new campaign has been successfully saved. (Note: Changes are in-memory).",
        });
        
        setOpen(false);
        resetForm();
        router.refresh(); 
    } catch (error: any) {
        toast({
            title: "Error",
            description: error.message || "Could not save the new campaign.",
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
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Campaign</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new campaign and its initial daily performance record.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
            {/* Campaign Details Section */}
            <h4 className="text-md font-medium">Campaign Details</h4>
            
            {!isClient && (
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                         <Label htmlFor="client-id">Client</Label>
                         <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                            <SelectTrigger id="client-id">
                                <SelectValue placeholder="Select a client" />
                            </SelectTrigger>
                            <SelectContent>
                                {clients.map(client => (
                                    <SelectItem key={client.id} value={client.id}>
                                        {client.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="company-account">Company</Label>
                        <Select value={selectedAccount} onValueChange={setSelectedAccount} disabled={!selectedClientId}>
                            <SelectTrigger id="company-account">
                                <SelectValue placeholder="Select a company" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredAccounts.map(acc => (
                                    <SelectItem key={acc.id} value={acc.id}>
                                        {acc.companyName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="campaign-name">Name</Label>
                    <Input id="campaign-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Summer Sale 2024" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="page-name">Page Name</Label>
                    <Input id="page-name" value={pageName} onChange={(e) => setPageName(e.target.value)} placeholder="e.g., Your Brand's Page" />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="campaign-description">Description</Label>
                <Textarea id="campaign-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="A compelling, short description for the ad copy." />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
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
                 <div className="space-y-2">
                    <Label htmlFor="result-type">Result Type</Label>
                    <Input id="result-type" value={resultType} onChange={(e) => setResultType(e.target.value)} placeholder="e.g., Link Clicks" />
                </div>
            </div>
             <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 18-65+" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={gender} onValueChange={(val: Campaign['gender']) => setGender(val)}>
                        <SelectTrigger id="gender">
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="e.g., USD" />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="attribution-setting">Attribution Setting</Label>
                <Input id="attribution-setting" value={attributionSetting} onChange={(e) => setAttributionSetting(e.target.value)} placeholder="e.g., 7-day click or 1-day view" />
            </div>

            {/* Initial Performance Record Section */}
            <div className="border-t pt-6">
                 <h4 className="text-md font-medium mb-4">Initial Performance Record</h4>
                 <div className="space-y-2 mb-6">
                     <Label htmlFor="date">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
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
                 <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="reach">Reach</Label>
                        <Input id="reach" type="number" value={reach} onChange={e => setReach(e.target.value)} placeholder="e.g., 15000" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="impressions">Impressions</Label>
                        <Input id="impressions" type="number" value={impressions} onChange={e => setImpressions(e.target.value)} placeholder="e.g., 50000" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="results">Results</Label>
                        <Input id="results" type="number" value={results} onChange={e => setResults(e.target.value)} placeholder="e.g., 250" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="link-clicks">Link Clicks</Label>
                        <Input id="link-clicks" type="number" value={linkClicks} onChange={e => setLinkClicks(e.target.value)} placeholder="e.g., 1200" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="amount-spent">Amount Spent</Label>
                        <Input id="amount-spent" type="number" value={amountSpent} onChange={e => setAmountSpent(e.target.value)} placeholder="e.g., 500.00" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="frequency">Frequency</Label>
                        <Input id="frequency" type="number" value={frequency} onChange={e => setFrequency(e.target.value)} placeholder="e.g., 1.8" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ctr">CTR (%)</Label>
                        <Input id="ctr" type="number" value={ctr} onChange={e => setCtr(e.target.value)} placeholder="e.g., 2.5" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="cpc">CPC</Label>
                        <Input id="cpc" type="number" value={cpc} onChange={e => setCpc(e.target.value)} placeholder="e.g., 0.75" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="cpm">CPM</Label>
                        <Input id="cpm" type="number" value={cpm} onChange={e => setCpm(e.target.value)} placeholder="e.g., 3.50" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="cost-per-result">Cost Per Result</Label>
                        <Input id="cost-per-result" type="number" value={costPerResult} onChange={e => setCostPerResult(e.target.value)} placeholder="e.g., 2.00" />
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
