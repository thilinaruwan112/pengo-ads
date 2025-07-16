"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lightbulb, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { campaigns } from "@/lib/data";
import type { Campaign } from "@/types";
import { getCampaignSuggestions } from "./actions";

const formSchema = z.object({
  campaignName: z.string(),
  reach: z.coerce.number(),
  impressions: z.coerce.number(),
  conversions: z.coerce.number(),
  clickThroughRate: z.coerce.number(),
  costPerClick: z.coerce.number(),
  costPerMille: z.coerce.number(),
  campaignDescription: z.string(),
});

export default function AiInsightsPage() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const lowPerformingCampaigns = campaigns.filter(c => c.ctr < 1.0 || c.cpc > 2.0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campaignName: "",
      reach: 0,
      impressions: 0,
      conversions: 0,
      clickThroughRate: 0,
      costPerClick: 0,
      costPerMille: 0,
      campaignDescription: "",
    },
  });

  const handleCampaignSelect = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      setSelectedCampaign(campaign);
      form.reset({
        campaignName: campaign.name,
        reach: campaign.reach,
        impressions: campaign.impressions,
        conversions: campaign.conversions,
        clickThroughRate: campaign.ctr,
        costPerClick: campaign.cpc,
        costPerMille: campaign.cpm,
        campaignDescription: campaign.description,
      });
      setSuggestions(null);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setSuggestions(null);
    const result = await getCampaignSuggestions(values);
    if (result.success) {
      setSuggestions(result.suggestions);
    } else {
      setSuggestions(`Error: ${result.error}`);
    }
    setIsLoading(false);
  };

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>AI Campaign Improvement</CardTitle>
            <CardDescription>
              Select a low-performing campaign to get AI-powered suggestions for improvement.
            </CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="campaign">Campaign</Label>
                  <Controller
                    control={form.control}
                    name="campaignName"
                    render={({ field }) => (
                       <Select onValueChange={handleCampaignSelect} defaultValue={field.value}>
                        <SelectTrigger id="campaign" aria-label="Select campaign">
                          <SelectValue placeholder="Select a campaign" />
                        </SelectTrigger>
                        <SelectContent>
                          {lowPerformingCampaigns.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {selectedCampaign && (
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    <div className="grid gap-3">
                      <Label htmlFor="reach">Reach</Label>
                      <Input id="reach" type="number" {...form.register("reach")} />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="impressions">Impressions</Label>
                      <Input id="impressions" type="number" {...form.register("impressions")} />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="conversions">Conversions</Label>
                      <Input id="conversions" type="number" {...form.register("conversions")} />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="ctr">Click-Through Rate (%)</Label>
                      <Input id="ctr" type="number" step="0.01" {...form.register("clickThroughRate")} />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="cpc">Cost Per Click ($)</Label>
                      <Input id="cpc" type="number" step="0.01" {...form.register("costPerClick")} />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="cpm">Cost Per Mille ($)</Label>
                      <Input id="cpm" type="number" step="0.01" {...form.register("costPerMille")} />
                    </div>
                     <div className="grid gap-3 col-span-full">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" {...form.register("campaignDescription")} className="min-h-24" />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
               <Button type="submit" disabled={!selectedCampaign || isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                Get Suggestions
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      <div className="lg:col-span-1">
        {isLoading && (
            <Card className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Generating suggestions...</p>
                </div>
            </Card>
        )}
        {suggestions && (
          <Card>
            <CardHeader>
              <CardTitle>Suggested Improvements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                {suggestions}
              </div>
            </CardContent>
          </Card>
        )}
        {!suggestions && !isLoading && (
            <Card className="flex items-center justify-center h-96 border-dashed">
                 <div className="flex flex-col items-center gap-4 text-center">
                    <Lightbulb className="h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Ready for Insights?</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">Select a campaign and click "Get Suggestions" to see how AI can help you optimize your marketing efforts.</p>
                </div>
            </Card>
        )}
      </div>
    </div>
  );
}
