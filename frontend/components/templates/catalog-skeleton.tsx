import { Skeleton } from "@/components/ui/skeleton"

export function CatalogProductCardSkeleton() {
  return (
    <article className="w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-card">
      <Skeleton className="aspect-[297/210] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-8 flex-1 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </article>
  )
}

export function CatalogGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid w-full items-start gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CatalogProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
