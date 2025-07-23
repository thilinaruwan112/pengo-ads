import { Skeleton, KpiCardSkeleton, ChartSkeleton, TableSkeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2 flex-col sm:flex-row sm:flex-wrap sm:justify-end">
            <Skeleton className="h-10 w-full sm:w-[200px]" />
            <Skeleton className="h-10 w-full sm:w-[200px]" />
            <Skeleton className="h-10 w-full sm:w-[260px]" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCardSkeleton />
        <KpiCardSkeleton />
        <KpiCardSkeleton />
        <KpiCardSkeleton />
        <KpiCardSkeleton />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-5 mt-6">
        <Skeleton className="h-[450px] w-full xl:col-span-3" />
        <Skeleton className="h-[450px] w-full xl:col-span-2" />
      </div>
       <div className="grid gap-4 md:gap-8 lg:grid-cols-1 mt-6">
         <Skeleton className="h-[400px] w-full" />
      </div>

       <div className="grid gap-4 md:gap-8 lg:grid-cols-2 mt-6">
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    </>
  )
}
