import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/app/providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gildia — Tadbir dizayn platformasi',
  description:
    'Konferentsiya, seminar va korporativ tadbirlar uchun dizayn materiallarini avtomatik generatsiya qiling',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
