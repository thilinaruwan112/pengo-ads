
"use client"

import type { Post, Account, Campaign } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import Image from "next/image"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { Check, ThumbsDown, Clock, ThumbsUp, MoreVertical, Trash2, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreatePostDialog } from "./create-post-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { posts } from "@/lib/data"


interface PostCardProps {
  post: Post
  isClientView?: boolean
  accounts: Account[]
  campaigns: (Campaign & { companyName: string })[]
}

const statusConfig = {
  'needs-approval': { label: 'Needs Approval', color: 'bg-yellow-500', icon: Clock },
  'approved': { label: 'Approved', color: 'bg-green-500', icon: ThumbsUp },
  'rejected': { label: 'Rejected', color: 'bg-red-500', icon: ThumbsDown },
  'scheduled': { label: 'Scheduled', color: 'bg-blue-500', icon: Clock },
  'posted': { label: 'Posted', color: 'bg-gray-500', icon: Check },
};


export function PostCard({ post, isClientView = false, accounts, campaigns }: PostCardProps) {
  const { toast } = useToast();
  const router = useRouter();
  const currentStatus = statusConfig[post.status];
  const [isEditOpen, setIsEditOpen] = useState(false);
  const company = accounts.find(acc => acc.id === post.accountId);
  const campaign = campaigns.find(c => c.id === post.campaignId);

  const handleStatusChange = async (newStatus: 'approved' | 'rejected') => {
    let rejectionReason: string | undefined;
    if (newStatus === 'rejected') {
        rejectionReason = prompt("Please provide a reason for rejecting this post:");
        if (rejectionReason === null) return; // User cancelled prompt
    }

    const postIndex = posts.findIndex(p => p.id === post.id);
    if (postIndex === -1) {
        toast({ title: "Error", description: "Could not find the post to update.", variant: "destructive" });
        return;
    }
    posts[postIndex].status = newStatus;
    if (newStatus === 'rejected') {
        posts[postIndex].rejectionReason = rejectionReason;
    } else {
        delete posts[postIndex].rejectionReason;
    }

    toast({
        title: `Post ${newStatus}`,
        description: "The post status has been updated.",
    });
    router.refresh();
  }

  const handleDelete = async () => {
    const postIndex = posts.findIndex(p => p.id === post.id);
    if (postIndex > -1) {
        posts.splice(postIndex, 1);
        toast({
            title: "Post Deleted",
            description: "The post has been successfully deleted.",
        });
        router.refresh();
    } else {
        toast({
            title: "Error",
            description: "Could not delete the post.",
            variant: "destructive"
        });
    }
  }


  return (
    <>
    <Card>
      <CardContent className="flex items-start gap-4 p-4">
        <div className="relative aspect-square w-24 h-24 md:w-32 md:h-32 overflow-hidden rounded-md shrink-0">
          <Image src={post.mediaUrl} alt="Post media" fill className="object-cover" data-ai-hint="social media post" />
        </div>
        <div className="flex-grow space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-sm">{company?.companyName || 'Unknown Company'}</p>
                <p className="text-xs text-muted-foreground">{campaign?.name || 'Unknown Campaign'}</p>
                <p className="text-xs text-muted-foreground pt-1">
                  Scheduled for: {format(parseISO(post.scheduledDate), "MMM d, h:mm a")}
                </p>
              </div>
              <Badge className={cn("capitalize text-white text-xs", currentStatus.color)}>
                  <currentStatus.icon className="h-3 w-3 mr-1" />
                  {currentStatus.label}
              </Badge>
            </div>
          
            <p className="text-sm text-muted-foreground line-clamp-3">
              {post.content}
            </p>

            {post.status === 'rejected' && post.rejectionReason && (
              <div className="p-2 bg-destructive/10 text-destructive text-xs rounded-md border border-destructive/20">
                  <strong>Rejection Reason:</strong> {post.rejectionReason}
              </div>
            )}
        </div>
        <div className="flex flex-col items-center gap-2">
            {isClientView && post.status === 'needs-approval' && (
              <div className="flex flex-col sm:flex-row md:flex-col gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleStatusChange('rejected')}>
                       Reject
                  </Button>
                  <Button size="sm" onClick={() => handleStatusChange('approved')}>
                      Approve
                  </Button>
              </div>
            )}
            {!isClientView && (
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <AlertDialog>
                          <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the post.
                                  </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleDelete} className={buttonVariants({variant: "destructive"})}>
                                      Delete
                                  </AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                  </DropdownMenuContent>
              </DropdownMenu>
            )}
        </div>
      </CardContent>
    </Card>
     <CreatePostDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        postToEdit={post}
        accounts={accounts}
        campaigns={campaigns}
    />
    </>
  )
}
