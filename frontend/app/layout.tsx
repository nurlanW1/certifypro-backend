import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { AppProviders } from '@/components/AppProviders'
import { isClerkConfigured } from '@/lib/clerk-config'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
})

const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700', '800'],
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
      <body className={`${jakarta.variable} ${display.variable} font-sans antialiased`}>
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
