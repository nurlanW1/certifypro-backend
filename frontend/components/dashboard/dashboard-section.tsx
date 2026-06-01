import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type Props = {
  id: string
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function DashboardSection({
  id,
  title,
  description,
  action,
  children,
  className,
}: Props) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  )
}
