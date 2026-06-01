import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AppProviders } from '@/components/AppProviders'
import { isClerkConfigured } from '@/lib/clerk-config'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
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
