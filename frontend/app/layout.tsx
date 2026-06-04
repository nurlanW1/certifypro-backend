import type { Metadata } from 'next'
import { Outfit, Source_Sans_3 } from 'next/font/google'
import { AppProviders } from '@/components/AppProviders'
import { isClerkConfigured } from '@/lib/clerk-config'
import './globals.css'

const display = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700', '800'],
})

const sans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
})

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
  const content = (
    <html lang="uz">
      <body className={`${sans.variable} ${display.variable} font-sans antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )

  if (!isClerkConfigured()) {
    return content
  }

  const { ClerkProvider } = await import('@clerk/nextjs')
  return <ClerkProvider>{content}</ClerkProvider>
}
