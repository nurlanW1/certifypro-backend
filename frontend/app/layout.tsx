import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { AppProviders } from '@/components/AppProviders'
import { ThemeScript } from '@/components/theme/ThemeScript'
import { isClerkConfigured } from '@/lib/clerk-config'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gildia — Tadbir dizayn platformasi',
  description:
    'Konferentsiya, seminar, forum va korporativ tadbirlar uchun dizayn materiallarini avtomatik generatsiya qilish.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const appBody = (
    <>
      <ThemeScript />
      <AppProviders>{children}</AppProviders>
    </>
  )

  if (!isClerkConfigured()) {
    return (
      <html
        lang="uz"
        className={`${GeistSans.variable} ${GeistMono.variable}`}
        suppressHydrationWarning
      >
        <body className="font-sans antialiased">{appBody}</body>
      </html>
    )
  }

  const { ClerkProvider } = await import('@clerk/nextjs')

  return (
    <html
      lang="uz"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ClerkProvider>{appBody}</ClerkProvider>
      </body>
    </html>
  )
}
