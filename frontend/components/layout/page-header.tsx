import { Fragment, ReactNode } from "react"
import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"
import type { BreadcrumbItem as Crumb } from "@/lib/layout/route-meta"

type PageHeaderProps = {
  title: string
  description?: string
  breadcrumbs?: Crumb[]
  actions?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("border-b border-border bg-card px-4 py-6 md:px-8", className)}>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <Fragment key={`${item.label}-${index}`}>
                {index > 0 ? <BreadcrumbSeparator /> : null}
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 || !item.href ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link href={item.href} />}>{item.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h1>
          {description ? (
            <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground md:text-base">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  )
}
