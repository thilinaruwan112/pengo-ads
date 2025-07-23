import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

function KpiCardSkeleton() {
    return (
        <div className="flex flex-col space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
        </div>
    )
}

function ChartSkeleton() {
    return <Skeleton className="h-[450px] w-full" />
}

function TableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                 <Skeleton className="h-10 w-1/4" />
                 <Skeleton className="h-10 w-1/6" />
            </div>
            <Skeleton className="h-12 w-full" />
            <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    )
}

export { Skeleton, KpiCardSkeleton, ChartSkeleton, TableSkeleton }
