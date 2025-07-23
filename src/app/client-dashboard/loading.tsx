import { Skeleton, KpiCardSkeleton } from "@/components/ui/skeleton";

export default function ClientDashboardLoading() {
  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-start mb-6">
        <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
        </div>
         <Skeleton className="h-10 w-28" />
      </div>

       <div className="grid gap-4 mb-6 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCardSkeleton />
        <KpiCardSkeleton />
        <KpiCardSkeleton />
      </div>
      
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mb-6">
        <Skeleton className="h-[450px] w-full xl:col-span-2" />
        <Skeleton className="h-[400px] w-full" />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-1 mb-6">
         <Skeleton className="h-[400px] w-full" />
      </div>

      <div>
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  )
}
