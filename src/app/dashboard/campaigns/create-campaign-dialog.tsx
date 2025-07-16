
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
import { generateCampaign, GenerateCampaignOutput } from "@/ai/flows/generate-campaign-flow";
import { Loader2 } from "lucide-react";
import { accounts } from "@/lib/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CreateCampaignDialog() {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState("");
  const [generatedData, setGeneratedData] = useState<GenerateCampaignOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!product) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please enter a product or goal first.",
      });
      return;
    }
    setIsGenerating(true);
    setGeneratedData(null);
    try {
      const result = await generateCampaign({ product });
      setGeneratedData(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "AI Generation Failed",
        description: "There was an error generating campaign ideas. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    // In a real app, you would have a POST API endpoint to save the new campaign
    console.log("Saving campaign:", {
      ...generatedData,
      accountId: selectedAccount,
    });
    toast({
      title: "Campaign Created",
      description: "Your new campaign has been saved.",
    });
    // Reset state
    setOpen(false);
    setProduct("");
    setGeneratedData(null);
    setSelectedAccount("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Campaign</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Campaign</DialogTitle>
          <DialogDescription>
            Describe your product or goal, and let AI generate campaign ideas for you.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="product" className="text-right">
              Product/Goal
            </Label>
            <Input
              id="product"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Eco-friendly running shoes"
            />
          </div>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate with AI"
            )}
          </Button>

          {generatedData && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="campaign-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="campaign-name"
                  value={generatedData.name}
                  onChange={(e) => setGeneratedData({ ...generatedData, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="campaign-description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="campaign-description"
                  value={generatedData.description}
                  onChange={(e) => setGeneratedData({ ...generatedData, description: e.target.value })}
                  className="col-span-3"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="campaign-audience" className="text-right pt-2">
                  Audience
                </Label>
                <Textarea
                  id="campaign-audience"
                  value={generatedData.targetAudience}
                  onChange={(e) => setGeneratedData({ ...generatedData, targetAudience: e.target.value })}
                  className="col-span-3"
                  rows={3}
                />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="client-account" className="text-right">
                  Client
                </Label>
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select an account" />
                    </SelectTrigger>
                    <SelectContent>
                        {accounts.map(acc => (
                            <SelectItem key={acc.id} value={acc.id}>
                                {acc.clientName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!generatedData || !selectedAccount}>
            Save Campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
