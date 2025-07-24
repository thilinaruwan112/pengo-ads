
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Campaign } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface EditCampaignFormProps {
    campaign: Campaign;
}

export function EditCampaignForm({ campaign }: EditCampaignFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  // Initialize state with the campaign data
  const [name, setName] = useState(campaign.name);
  const [description, setDescription] = useState(campaign.description);
  const [status, setStatus] = useState<Campaign['status']>(campaign.status);
  const [platform, setPlatform] = useState<Campaign['platform']>(campaign.platform);
  const [age, setAge] = useState(campaign.age || "");
  const [gender, setGender] = useState<Campaign['gender']>(campaign.gender || "All");
  const [pageName, setPageName] = useState(campaign.pageName || "");
  const [attributionSetting, setAttributionSetting] = useState(campaign.attributionSetting || "");
  const [resultType, setResultType] = useState(campaign.resultType || "");
  const [currency, setCurrency] = useState(campaign.currency || "USD");

  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSave = async () => {
     setIsSubmitting(true);
    const updatedCampaign: Partial<Campaign> = {
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
    };

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/campaigns/${campaign.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedCampaign),
        });

        if (!response.ok) throw new Error('Failed to update campaign');

        toast({
            title: "Campaign Updated",
            description: "Your campaign has been successfully saved.",
        });
        router.push("/dashboard/campaigns"); // Redirect back to the list
        router.refresh(); // Refresh server components
    } catch (error) {
         toast({
            title: "Error",
            description: "Could not save campaign changes.",
            variant: "destructive"
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const isSaveDisabled = !name || !description || isSubmitting;
  
  const sortedPerformance = campaign.dailyPerformance?.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="grid gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
                 <CardDescription>Update the core details of your campaign here.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="campaign-name">Name</Label>
                            <Input
                            id="campaign-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Summer Sale 2024"
                            />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="page-name">Page Name</Label>
                            <Input
                            id="page-name"
                            value={pageName}
                            onChange={(e) => setPageName(e.target.value)}
                            placeholder="e.g., Your Brand's Page"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="campaign-description">Description</Label>
                        <Textarea
                        id="campaign-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="A compelling, short description for the ad copy."
                        />
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
                    
                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={isSaveDisabled}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Daily Performance</CardTitle>
                        <CardDescription>View and add daily performance metrics for this campaign.</CardDescription>
                    </div>
                    <Button onClick={() => router.push(`/dashboard/campaigns/${campaign.id}/add-record`)}>
                        Add Daily Record
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Reach</TableHead>
                            <TableHead className="text-right">Impressions</TableHead>
                            <TableHead className="text-right">Results</TableHead>
                            <TableHead className="text-right">CTR (%)</TableHead>
                            <TableHead className="text-right">Amount Spent</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedPerformance.length > 0 ? sortedPerformance.map((record) => (
                            <TableRow key={record.date}>
                                <TableCell>{format(new Date(record.date), "PPP")}</TableCell>
                                <TableCell className="text-right">{record.reach.toLocaleString()}</TableCell>
                                <TableCell className="text-right">{record.impressions.toLocaleString()}</TableCell>
                                <TableCell className="text-right">{record.results.toLocaleString()}</TableCell>
                                <TableCell className="text-right">{record.ctr.toFixed(2)}</TableCell>
                                <TableCell className="text-right">{campaign.currency} {record.amountSpent?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">No performance records found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
