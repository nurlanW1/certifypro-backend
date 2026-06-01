'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-surface-secondary">
      <Sidebar />
      <MobileNav />
      <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  )
}
