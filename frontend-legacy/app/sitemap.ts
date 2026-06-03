import { MetadataRoute } from "next"

const base = process.env.NEXT_PUBLIC_APP_URL || "https://gildia.uz"

const routes = [
  "",
  "/templates",
  "/editor",
  "/dashboard",
  "/dashboard/events",
  "/dashboard/events/new",
  "/dashboard/bulk-generate",
  "/dashboard/qr-generator",
  "/dashboard/assets",
  "/pricing",
  "/billing/checkout",
  "/billing/success",
  "/billing/failed",
  "/billing/history",
  "/account/plan",
  "/faq",
  "/contact",
  "/login",
  "/register",
  "/forgot-password",
  "/verify-email",
  "/verify",
  "/account",
  "/about",
  "/privacy",
  "/event-packages",
]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }))
}
