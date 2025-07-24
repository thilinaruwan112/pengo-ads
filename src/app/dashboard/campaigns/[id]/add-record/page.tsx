
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import Link from "next/link";


export default function AddDailyRecordPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;
  const { toast } = useToast();

  const [date, setDate] = useState<Date>();
  const [reach, setReach] = useState("");
  const [impressions, setImpressions] = useState("");
  const [results, setResults] = useState(""); // Renamed from conversions
  const [ctr, setCtr] = useState("");
  const [cpc, setCpc] = useState("");
  const [cpm, setCpm] = useState("");
  const [frequency, setFrequency] = useState("");
  const [amountSpent, setAmountSpent] = useState("");
  const [costPerResult, setCostPerResult] = useState("");
  const [linkClicks, setLinkClicks] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
     if (!date) {
        toast({
            title: "Validation Error",
            description: "Please select a date.",
            variant: "destructive"
        });
        return;
    }
    
    setIsSubmitting(true);
    const newRecord = {
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
    };

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/campaigns/${campaignId}`, {
            method: 'POST', // We use POST on the [id] route to add a sub-resource
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRecord),
        });

        if (!response.ok) throw new Error('Failed to add record');

        toast({
            title: "Record Added",
            description: "The daily performance record has been successfully added.",
        });
        router.push(`/dashboard/campaigns/${campaignId}/edit`);
        router.refresh();
    } catch (error) {
         toast({
            title: "Error",
            description: "Could not save the daily record.",
            variant: "destructive"
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const isSaveDisabled = !date || isSubmitting;

  return (
    <div className="container mx-auto py-2">
       <div className="flex items-center mb-4 gap-4">
         <Button asChild variant="outline" size="icon">
            <Link href={`/dashboard/campaigns/${campaignId}/edit`}>
                <ArrowLeft />
                <span className="sr-only">Back to Campaign</span>
            </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add Daily Record</h1>
          <p className="text-muted-foreground">
            Enter the performance metrics for a specific day.
          </p>
        </div>
      </div>
        <Card>
            <CardHeader>
                <CardTitle>New Performance Record</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                    <div className="space-y-2">
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
                    </div>

                     <div className="grid md:grid-cols-3 gap-6">
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
                     <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                           <Label htmlFor="cost-per-result">Cost Per Result</Label>
                            <Input id="cost-per-result" type="number" value={costPerResult} onChange={e => setCostPerResult(e.target.value)} placeholder="e.g., 2.00" />
                        </div>
                     </div>
                    
                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={isSaveDisabled}>
                            {isSubmitting ? 'Saving...' : 'Add Record'}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
