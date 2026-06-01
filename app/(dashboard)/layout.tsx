'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-surface-secondary">
      <Sidebar
        collapsed={!sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
