import type { Metadata } from "next"
import { Inter, Geist } from "next/font/google"
import "./globals.css"
import { AppShell } from "@/components/layout/app-shell"
import { BRAND, SEO_KEYWORDS } from "@/lib/constants/brand"
import { APP_URL } from "@/lib/constants/env"
import { cn } from "@/lib/utils"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/sonner"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
})

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${BRAND.name}.uz — Konferensiya va tadbir dizayn platformasi`,
    template: `%s | ${BRAND.name}.uz`,
  },
  description: BRAND.description,
  keywords: SEO_KEYWORDS,
  applicationName: BRAND.name,
  manifest: "/site.webmanifest",
  openGraph: {
    title: `${BRAND.name}.uz — Event design automation`,
    description: BRAND.description,
    url: BRAND.domain,
    siteName: `${BRAND.name}.uz`,
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name}.uz`,
    description: BRAND.description,
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="uz"
      className={cn("h-full", "antialiased", inter.variable, "font-sans", geist.variable)}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Providers>
          <AppShell>{children}</AppShell>
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  )
}
