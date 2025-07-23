
"use client"

import type { Post, Account, Campaign } from "@/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import Image from "next/image"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { Check, ThumbsDown, Clock, ThumbsUp, X, MoreVertical, Trash2, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

  const handleStatusChange = async (newStatus: 'approved' | 'rejected') => {
    let rejectionReason: string | undefined;
    if (newStatus === 'rejected') {
        rejectionReason = prompt("Please provide a reason for rejecting this post:");
        if (rejectionReason === null) return; // User cancelled prompt
    }

    try {
        const response = await fetch(`/api/posts/${post.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus, rejectionReason }),
        });

        if (!response.ok) throw new Error('Failed to update status');
        
        toast({
            title: `Post ${newStatus}`,
            description: "The post status has been updated.",
        });
        router.refresh();
    } catch (error) {
         toast({
            title: "Error",
            description: "Could not update the post status.",
            variant: "destructive"
        });
    }
  }

  const handleDelete = async () => {
    try {
        const response = await fetch(`/api/posts/${post.id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete post');
        
        toast({
            title: "Post Deleted",
            description: "The post has been successfully deleted.",
        });
        router.refresh();
    } catch (error) {
         toast({
            title: "Error",
            description: "Could not delete the post.",
            variant: "destructive"
        });
    }
  }


  return (
    <>
    <Card className="flex flex-col">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-md">
            <Image src={post.mediaUrl} alt="Post media" fill className="object-cover" data-ai-hint="social media post" />
             {!isClientView && (
                <div className="absolute top-2 right-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="h-8 w-8 bg-black/50 hover:bg-black/70 border-none text-white">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                             <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                                <Edit className="mr-2" /> Edit
                            </DropdownMenuItem>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Trash2 className="mr-2" /> Delete
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
                </div>
            )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 p-4">
        <div className="flex justify-between items-center">
            <Badge className={cn("capitalize text-white", currentStatus.color)}>
                <currentStatus.icon className="h-3 w-3 mr-1" />
                {currentStatus.label}
            </Badge>
            <span className="text-xs text-muted-foreground">
                {format(parseISO(post.scheduledDate), "MMM d, yyyy 'at' h:mm a")}
            </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-4">
            {post.content}
        </p>
        {!isClientView && (
            <CardDescription>{(post as any).companyName}</CardDescription>
        )}
        {post.status === 'rejected' && post.rejectionReason && (
             <div className="p-2 bg-destructive/10 text-destructive text-xs rounded-md border border-destructive/20">
                <strong>Rejection Reason:</strong> {post.rejectionReason}
            </div>
        )}
      </CardContent>
      {isClientView && post.status === 'needs-approval' && (
        <CardFooter className="flex justify-end gap-2 p-4 pt-0">
            <Button variant="outline" size="sm" onClick={() => handleStatusChange('rejected')}>
                <X className="mr-1 h-4 w-4" /> Reject
            </Button>
            <Button size="sm" onClick={() => handleStatusChange('approved')}>
                <Check className="mr-1 h-4 w-4" /> Approve
            </Button>
        </CardFooter>
      )}
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
