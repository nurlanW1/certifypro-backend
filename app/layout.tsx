import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { AppProviders } from '@/components/AppProviders'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gildia — Tadbir dizayn platformasi',
  description:
    'Konferentsiya, seminar, forum va korporativ tadbirlar uchun dizayn materiallarini avtomatik generatsiya qilish.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="uz">
        <body className={inter.className}>
          <AppProviders>{children}</AppProviders>
        </body>
      </html>
    </ClerkProvider>
  )
}
