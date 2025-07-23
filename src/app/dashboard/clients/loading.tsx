import { Skeleton, TableSkeleton } from "@/components/ui/skeleton";

export default function ClientsLoading() {
  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
       <div className="hidden md:block">
        <TableSkeleton />
      </div>
       <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  )
}
