import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { GuestModeBanner } from '@/components/layout/GuestModeBanner'
import { isClerkConfigured } from '@/lib/clerk-config'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (isClerkConfigured()) {
    const { auth } = await import('@clerk/nextjs/server')
    const { userId } = auth()
    if (!userId) redirect('/sign-in')
  }

  return (
    <>
      <GuestModeBanner />
      <DashboardShell>{children}</DashboardShell>
    </>
  )
}
