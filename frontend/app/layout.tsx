import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { AppProviders } from '@/components/AppProviders'
import { ClerkAppProvider } from '@/components/auth/ClerkAppProvider'
import { ThemeScript } from '@/components/theme/ThemeScript'
import { getClerkPublishableKey, isClerkConfigured } from '@/lib/clerk-config'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gildia — Tadbir dizayn platformasi',
  description:
    'Konferentsiya, seminar, forum va korporativ tadbirlar uchun dizayn materiallarini avtomatik generatsiya qilish.',
}

/** Read Clerk env at request time (Vercel runtime vars work without rebuild). */
export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const publishableKey = getClerkPublishableKey()
  const clerkEnabled = isClerkConfigured()

  return (
    <html
      lang="uz"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ClerkAppProvider
          config={{
            enabled: clerkEnabled,
            publishableKey,
          }}
        >
          <ThemeScript />
          <AppProviders>{children}</AppProviders>
        </ClerkAppProvider>
      </body>
    </html>
  )
}
