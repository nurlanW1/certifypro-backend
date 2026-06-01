"use client"

import { usePathname } from "next/navigation"

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { PageHeader } from "@/components/layout/page-header"
import { getDashboardPageMeta } from "@/lib/layout/route-meta"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ""
  const meta = getDashboardPageMeta(pathname)

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] bg-muted/30">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {meta ? (
          <PageHeader
            title={meta.title}
            description={meta.description}
            breadcrumbs={meta.breadcrumbs}
          />
        ) : null}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  )
}
