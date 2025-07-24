
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
import type { Account, Campaign, Post, User } from "@/types"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { cn } from "@/lib/utils"
import { Check, ThumbsDown, Clock, ThumbsUp } from "lucide-react"
import { users } from "@/lib/data"

interface CreatePostDialogProps {
    accounts: Account[];
    campaigns: (Campaign & { companyName: string })[];
    postToEdit?: Post;
    isOpen?: boolean;
    setIsOpen?: (open: boolean) => void;
    isClient?: boolean;
    clientAccountId?: string;
    clientAccounts?: Account[];
}

const statusConfig = {
  'needs-approval': { label: 'Needs Approval', icon: Clock },
  'approved': { label: 'Approved', icon: ThumbsUp },
  'rejected': { label: 'Rejected', icon: ThumbsDown },
  'scheduled': { label: 'Scheduled', icon: Clock },
  'posted': { label: 'Posted', icon: Check },
};

export function CreatePostDialog({ accounts, campaigns, postToEdit, isOpen, setIsOpen, isClient, clientAccountId }: CreatePostDialogProps) {
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
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>();
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(isClient ? clientAccountId : undefined);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | undefined>();
  const [status, setStatus] = useState<Post['status']>('needs-approval');

  const [clients, setClients] = useState<User[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<(Campaign & { companyName: string })[]>([]);

  useEffect(() => {
    // In a real app, you'd fetch this. For now, using mock data.
    setClients(users.filter(u => u.role === 'client'));
  }, []);

  useEffect(() => {
    if (isEditMode && postToEdit) {
      setContent(postToEdit.content);
      setMediaUrl(postToEdit.mediaUrl);
      const formattedDate = postToEdit.scheduledDate.substring(0, 16); // "yyyy-MM-ddTHH:mm"
      setScheduledDate(formattedDate);
      setSelectedAccountId(postToEdit.accountId);
      setSelectedCampaignId(postToEdit.campaignId);
      setStatus(postToEdit.status);

      const client = clients.find(c => c.adAccountIds.includes(postToEdit.accountId));
      setSelectedClientId(client?.id);
    }
  }, [postToEdit, isEditMode, clients]);

   useEffect(() => {
    if (selectedClientId) {
      const client = clients.find(c => c.id === selectedClientId);
      if (client) {
        setFilteredAccounts(accounts.filter(acc => client.adAccountIds.includes(acc.id)));
      }
    } else {
      setFilteredAccounts(isClient ? accounts.filter(a => a.id === clientAccountId) : []);
    }
     if (!isEditMode || (isEditMode && postToEdit?.accountId !== selectedAccountId)) {
        setSelectedAccountId(undefined);
    }
  }, [selectedClientId, clients, accounts, isEditMode, postToEdit, isClient, clientAccountId]);

  useEffect(() => {
    if (selectedAccountId) {
      const account = accounts.find(acc => acc.id === selectedAccountId);
      if (account) {
        setFilteredCampaigns(campaigns.filter(c => account.campaigns.some(ac => ac.id === c.id)));
      }
    } else {
      setFilteredCampaigns([]);
    }
     if (!isEditMode || (isEditMode && postToEdit?.campaignId !== selectedCampaignId)) {
        setSelectedCampaignId(undefined);
    }
  }, [selectedAccountId, accounts, campaigns, isEditMode, postToEdit]);


  const resetForm = () => {
    setContent("");
    setMediaUrl("");
    setScheduledDate("");
    setSelectedClientId(undefined);
    setSelectedAccountId(isClient ? clientAccountId : undefined);
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
    
    const url = isEditMode ? `${process.env.NEXT_PUBLIC_URL}/api/posts/${postToEdit.id}` : `${process.env.NEXT_PUBLIC_URL}/api/posts`;
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

  const triggerText = isClient ? 'Create Post' : 'Create Post';
  const trigger = !isEditMode ? <Button>{triggerText}</Button> : null;

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
            {!isClient && (
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
            )}
            <div className="space-y-2">
                <Label htmlFor="account-id">Company</Label>
                 <Select value={selectedAccountId} onValueChange={setSelectedAccountId} disabled={!isClient && !selectedClientId}>
                    <SelectTrigger id="account-id">
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
