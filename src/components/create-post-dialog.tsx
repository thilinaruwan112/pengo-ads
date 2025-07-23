
"use client"

import { useState, useEffect } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Account, Campaign, Post } from "@/types"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { cn } from "@/lib/utils"

interface CreatePostDialogProps {
    accounts: Account[];
    campaigns: (Campaign & { companyName: string })[];
    postToEdit?: Post;
    isOpen?: boolean;
    setIsOpen?: (open: boolean) => void;
}

export function CreatePostDialog({ accounts, campaigns, postToEdit, isOpen, setIsOpen }: CreatePostDialogProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = setIsOpen !== undefined ? setIsOpen : setInternalOpen;

  const isEditMode = !!postToEdit;

  // Form State
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | undefined>();
  const [status, setStatus] = useState<Post['status']>('needs-approval');

  const [filteredCampaigns, setFilteredCampaigns] = useState<(Campaign & { companyName: string })[]>([]);

  useEffect(() => {
    if (isEditMode && postToEdit) {
      setContent(postToEdit.content);
      setMediaUrl(postToEdit.mediaUrl);
      const formattedDate = postToEdit.scheduledDate.substring(0, 16); // "yyyy-MM-ddTHH:mm"
      setScheduledDate(formattedDate);
      setSelectedAccountId(postToEdit.accountId);
      setSelectedCampaignId(postToEdit.campaignId);
      setStatus(postToEdit.status);
    }
  }, [postToEdit, isEditMode]);

  useEffect(() => {
    if (selectedAccountId) {
      const account = accounts.find(acc => acc.id === selectedAccountId);
      if (account) {
        setFilteredCampaigns(campaigns.filter(c => account.campaigns.some(ac => ac.id === c.id)));
      }
    } else {
      setFilteredCampaigns([]);
    }
    if (!isEditMode) {
     setSelectedCampaignId(undefined);
    }
  }, [selectedAccountId, accounts, campaigns, isEditMode]);


  const resetForm = () => {
    setContent("");
    setMediaUrl("");
    setScheduledDate("");
    setSelectedAccountId(undefined);
    setSelectedCampaignId(undefined);
    setStatus("needs-approval");
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    
    const postData = {
      content,
      mediaUrl: mediaUrl || "https://placehold.co/1080x1080.png", // Default placeholder
      mediaType: 'image' as const,
      scheduledDate: new Date(scheduledDate).toISOString(),
      accountId: selectedAccountId,
      campaignId: selectedCampaignId,
      status,
    };
    
    const url = isEditMode ? `/api/posts/${postToEdit.id}` : '/api/posts';
    const method = isEditMode ? 'PATCH' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save post');
        }
        
        toast({
            title: isEditMode ? "Post Updated" : "Post Created",
            description: `The post has been successfully ${isEditMode ? 'updated' : 'saved'}.`,
        });
        
        setOpen(false);
        if (!isEditMode) {
          resetForm();
        }
        router.refresh(); 
    } catch (error: any) {
        toast({
            title: "Error",
            description: error.message || `Could not ${isEditMode ? 'update' : 'save'} the post.`,
            variant: "destructive"
        });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const isSaveDisabled = isSubmitting || !content || !scheduledDate || !selectedAccountId || !selectedCampaignId;

  const trigger = !isEditMode ? <Button>Create Post</Button> : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Post' : 'Create New Post'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the details for this post.' : 'Fill in the details below to create a new post for approval.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="account-id">Client Account</Label>
                 <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                    <SelectTrigger id="account-id">
                        <SelectValue placeholder="Select an account" />
                    </SelectTrigger>
                    <SelectContent>
                        {accounts.map(acc => (
                            <SelectItem key={acc.id} value={acc.id}>
                                {acc.companyName} ({acc.clientName})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="campaign-id">Campaign</Label>
                <Select value={selectedCampaignId} onValueChange={setSelectedCampaignId} disabled={!selectedAccountId}>
                    <SelectTrigger id="campaign-id">
                        <SelectValue placeholder="Select a campaign" />
                    </SelectTrigger>
                    <SelectContent>
                        {filteredCampaigns.map(camp => (
                            <SelectItem key={camp.id} value={camp.id}>
                                {camp.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="content">Post Content</Label>
                <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write the post copy here..." rows={5} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="media-url">Media URL</Label>
                <Input id="media-url" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="https://placehold.co/1080x1080.png" />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="scheduled-date">Scheduled Date & Time</Label>
                    <Input id="scheduled-date" type="datetime-local" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={(val: Post['status']) => setStatus(val)}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                             {Object.entries(statusConfig).map(([key, config]) => (
                                <SelectItem key={key} value={key}>{config.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={isSaveDisabled}>
            {isSubmitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Post')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
