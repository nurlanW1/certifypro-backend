export type BreadcrumbItem = {
  label: string
  href?: string
}

export type PageMeta = {
  title: string
  description?: string
  breadcrumbs: BreadcrumbItem[]
}

const DASHBOARD_ROOT: BreadcrumbItem = { label: "Dashboard", href: "/dashboard" }

export const DASHBOARD_ROUTE_META: Record<string, PageMeta> = {
  "/dashboard": {
    title: "Boshqaruv paneli",
    description: "Tadbirlar, dizaynlar, qoralamalar va eksportlar",
    breadcrumbs: [DASHBOARD_ROOT],
  },
  "/dashboard/events": {
    title: "Mening tadbirlarim",
    description: "Barcha tadbir workspace’lari",
    breadcrumbs: [DASHBOARD_ROOT, { label: "Tadbirlar" }],
  },
  "/dashboard/events/new": {
    title: "Tadbir yaratish",
    description: "Tadbir ma’lumotlari va brending",
    breadcrumbs: [
      DASHBOARD_ROOT,
      { label: "Tadbirlar", href: "/dashboard/events" },
      { label: "Yangi tadbir" },
    ],
  },
  "/dashboard/bulk-generate": {
    title: "Bulk generate",
    description: "Excel orqali ommaviy material yaratish",
    breadcrumbs: [DASHBOARD_ROOT, { label: "Bulk generate" }],
  },
  "/dashboard/qr-generator": {
    title: "QR generator",
    description: "Tadbir QR kodlari va registratsiya kartalari",
    breadcrumbs: [DASHBOARD_ROOT, { label: "QR generator" }],
  },
  "/dashboard/assets": {
    title: "Aktivlar kutubxonasi",
    description: "Logo, imzo, muhr va yuklangan fayllar",
    breadcrumbs: [DASHBOARD_ROOT, { label: "Aktivlar" }],
  },
  "/billing/history": {
    title: "To‘lov tarixi",
    description: "Buyurtmalar va to‘lovlar",
    breadcrumbs: [DASHBOARD_ROOT, { label: "To‘lov tarixi" }],
  },
}

export function getDashboardPageMeta(pathname: string): PageMeta | null {
  if (DASHBOARD_ROUTE_META[pathname]) {
    return DASHBOARD_ROUTE_META[pathname]
  }

  const builderMatch = pathname.match(/^\/dashboard\/events\/([^/]+)\/builder$/)
  if (builderMatch && builderMatch[1] !== "new") {
    return {
      title: "Event Builder",
      description: "Material katalogi — Ha/Yo‘q va mockup",
      breadcrumbs: [
        DASHBOARD_ROOT,
        { label: "Tadbirlar", href: "/dashboard/events" },
        { label: "Yangi tadbir", href: "/dashboard/events/new" },
        { label: "Event Builder" },
      ],
    }
  }

  const eventMatch = pathname.match(/^\/dashboard\/events\/([^/]+)$/)
  if (eventMatch && eventMatch[1] !== "new") {
    return {
      title: "Tadbir workspace",
      description: "Shablonlar, ishtirokchilar, aktivlar va eksportlar",
      breadcrumbs: [
        DASHBOARD_ROOT,
        { label: "Tadbirlar", href: "/dashboard/events" },
        { label: "Workspace" },
      ],
    }
  }

  return null
}

const AUTH_PATHS = new Set(["/login", "/register", "/forgot-password", "/verify-email"])

export type LayoutMode = "public" | "dashboard" | "fullbleed" | "editor" | "auth"

export function getLayoutMode(pathname: string): LayoutMode {
  if (pathname.startsWith("/editor")) return "editor"
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/billing/history")) {
    return "dashboard"
  }
  if (AUTH_PATHS.has(pathname)) return "auth"
  if (pathname === "/templates" || pathname.match(/^\/templates\/[^/]+$/)) {
    return "fullbleed"
  }
  return "public"
}
