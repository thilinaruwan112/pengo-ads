
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

export function CreateCampaignDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const { toast } = useToast();

  const handleSave = () => {
    // In a real app, you would have a POST API endpoint to save the new campaign
    console.log("Saving campaign:", {
      name,
      description,
      targetAudience,
      accountId: selectedAccount,
    });
    toast({
      title: "Campaign Created",
      description: "Your new campaign has been saved.",
    });
    // Reset state
    setOpen(false);
    setName("");
    setDescription("");
    setTargetAudience("");
    setSelectedAccount("");
  };

  const isSaveDisabled = !name || !description || !targetAudience || !selectedAccount;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Campaign</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
                rows={4}
                placeholder="A compelling, short description for the ad copy."
                />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="campaign-audience" className="text-right pt-2">
                Audience
                </Label>
                <Textarea
                id="campaign-audience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="col-span-3"
                rows={3}
                placeholder="e.g., Fitness enthusiasts aged 25-40"
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
        <DialogFooter>
          <Button onClick={handleSave} disabled={isSaveDisabled}>
            Save Campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
