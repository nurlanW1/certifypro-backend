import { ReactNode } from "react"
import { Inbox } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: string
  description?: string
  action?: ReactNode
  icon?: ReactNode
  className?: string
}) {
  return (
    <Empty
      className={cn(
        "rounded-2xl border border-dashed border-border bg-muted/30 py-14",
        className
      )}
    >
      <EmptyHeader>
        <EmptyMedia variant="icon" className="size-12 rounded-2xl bg-background shadow-sm ring-1 ring-border">
          {icon ?? <Inbox className="size-5" aria-hidden />}
        </EmptyMedia>
        <EmptyTitle className="text-base font-semibold">{title}</EmptyTitle>
        {description ? (
          <EmptyDescription className="max-w-sm">{description}</EmptyDescription>
        ) : null}
      </EmptyHeader>
      {action ? <EmptyContent>{action}</EmptyContent> : null}
    </Empty>
  )
}
