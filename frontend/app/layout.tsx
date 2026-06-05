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

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="uz"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeScript />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!isClerkConfigured()) {
    return <RootShell>{children}</RootShell>
  }

  const { ClerkProvider } = await import('@clerk/nextjs')
  return (
    <ClerkProvider>
      <RootShell>{children}</RootShell>
    </ClerkProvider>
  )
}
