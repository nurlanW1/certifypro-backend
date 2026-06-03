"use client"

import {
  CreditCard,
  FolderKanban,
  Receipt,
  LayoutDashboard,
  PackagePlus,
  QrCode,
  Settings,
  Sparkles,
  TableProperties,
  Upload,
} from "lucide-react"

import { Sidebar, type SidebarNavItem } from "@/components/ui/sidebar"
import { LinkButton } from "@/components/ui/button"

const DASHBOARD_NAV: SidebarNavItem[] = [
  { href: "/dashboard", label: "Bosh sahifa", icon: <LayoutDashboard /> },
  { href: "/dashboard/events", label: "Tadbirlar", icon: <FolderKanban /> },
  { href: "/dashboard/events/new", label: "Tadbir yaratish", icon: <PackagePlus /> },
  { href: "/templates", label: "Shablonlar", icon: <Sparkles /> },
  { href: "/dashboard/bulk-generate", label: "Bulk generate", icon: <TableProperties /> },
  { href: "/dashboard/qr-generator", label: "QR generator", icon: <QrCode /> },
  { href: "/dashboard/assets", label: "Aktivlar", icon: <Upload /> },
  { href: "/account", label: "Hisob", icon: <Settings /> },
  { href: "/account/plan", label: "Reja", icon: <CreditCard /> },
  { href: "/billing/history", label: "To‘lovlar", icon: <Receipt /> },
  { href: "/pricing", label: "Tariflar", icon: <CreditCard /> },
]

export function DashboardSidebar() {
  return (
    <Sidebar
      className="min-h-0 shrink-0"
      brand={
        <div>
          <p className="text-sm font-semibold text-sidebar-foreground">Workspace</p>
          <p className="text-[11px] text-muted-foreground">Tadbir materiallari</p>
        </div>
      }
      items={DASHBOARD_NAV}
      footer={
        <LinkButton href="/editor" variant="outline" size="sm" className="w-full justify-center">
          Editorni ochish
        </LinkButton>
      }
    />
  )
}
