import { cn } from '@/lib/utils'

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={cn('skeleton', className)} />
}

export function TemplateSkeleton() {
  return (
    <div className="overflow-hidden rounded border border-divide">
      <div className="aspect-[3/4] skeleton" />
      <div className="border-t border-divide bg-ink px-3 py-2.5">
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    </div>
  )
}

export function EventCardSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-divide py-4">
      <div className="skeleton h-8 w-8 shrink-0 rounded" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3.5 w-40 rounded" />
        <div className="skeleton h-2.5 w-24 rounded" />
      </div>
    </div>
  )
}
