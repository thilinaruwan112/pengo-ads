
"use client"

import type { Post } from "@/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { Check, ThumbsDown, Clock, ThumbsUp, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface PostCardProps {
  post: Post
  isClientView?: boolean
}

const statusConfig = {
  'needs-approval': { label: 'Needs Approval', color: 'bg-yellow-500', icon: Clock },
  'approved': { label: 'Approved', color: 'bg-green-500', icon: ThumbsUp },
  'rejected': { label: 'Rejected', color: 'bg-red-500', icon: ThumbsDown },
  'scheduled': { label: 'Scheduled', color: 'bg-blue-500', icon: Clock },
  'posted': { label: 'Posted', color: 'bg-gray-500', icon: Check },
};


export function PostCard({ post, isClientView = false }: PostCardProps) {
  const { toast } = useToast();
  const router = useRouter();
  const currentStatus = statusConfig[post.status];

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


  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md">
            <Image src={post.mediaUrl} alt="Post media" fill className="object-cover" data-ai-hint="social media post" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
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
        <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => handleStatusChange('rejected')}>
                <X className="mr-1 h-4 w-4" /> Reject
            </Button>
            <Button size="sm" onClick={() => handleStatusChange('approved')}>
                <Check className="mr-1 h-4 w-4" /> Approve
            </Button>
        </CardFooter>
      )}
    </Card>
  )
}
