
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Campaign } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

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
  const [reach, setReach] = useState(campaign.reach.toString());
  const [impressions, setImpressions] = useState(campaign.impressions.toString());
  const [conversions, setConversions] = useState(campaign.conversions.toString());
  const [ctr, setCtr] = useState(campaign.ctr.toString());
  const [cpc, setCpc] = useState(campaign.cpc.toString());
  const [cpm, setCpm] = useState(campaign.cpm.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSave = async () => {
     setIsSubmitting(true);
    const updatedCampaign: Partial<Campaign> = {
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

    // In a real app, you would have a PUT/PATCH API endpoint to save the campaign
    try {
        const response = await fetch(`/api/campaigns/${campaign.id}`, {
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

  return (
    <Card>
        <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
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
                
                 <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={(val: Campaign['status']) => setStatus(val)}>
                        <SelectTrigger id="status" className="w-[180px]">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="paused">Paused</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
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
                        <Label htmlFor="conversions">Conversions</Label>
                        <Input id="conversions" type="number" value={conversions} onChange={e => setConversions(e.target.value)} placeholder="e.g., 250" />
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
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
