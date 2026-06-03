"use client"

import { usePathname } from "next/navigation"

import { SiteHeader } from "@/components/layout/site-header"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { PageContainer } from "@/components/layout/page-container"
import { PublicFooter } from "@/components/layout/public-footer"
import { getLayoutMode } from "@/lib/layout/route-meta"

/** Marketing pages with full-bleed sections (no outer max-width wrapper) */
function isFullWidthPublicPage(pathname: string) {
  return pathname === "/"
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ""
  const mode = getLayoutMode(pathname)
  const fullWidthPublic = isFullWidthPublicPage(pathname)

  return (
    <>
      {mode !== "auth" ? <SiteHeader /> : null}
      {mode === "dashboard" ? (
        <DashboardShell>{children}</DashboardShell>
      ) : mode === "auth" || mode === "fullbleed" || mode === "editor" ? (
        <main className="flex-1">{children}</main>
      ) : (
        <main className="flex-1">
          {fullWidthPublic ? children : <PageContainer>{children}</PageContainer>}
        </main>
      )}
      {mode === "public" ? <PublicFooter /> : null}
    </>
  )
}
