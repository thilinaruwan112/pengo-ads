import { Skeleton } from "@/components/ui/skeleton";

export default function PostsLoading() {
  const PostCardSkeleton = () => (
    <div className="flex flex-col">
      <Skeleton className="aspect-[4/5] w-full rounded-t-md" />
      <div className="flex-grow space-y-3 p-4 bg-card rounded-b-md">
         <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-2">
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-2">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
        <div>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-28" />
        </div>
      </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    </div>
  )
}
