import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { GuestModeBanner } from '@/components/layout/GuestModeBanner'
import { isClerkConfigured } from '@/lib/clerk-config'
import { isGuestMode } from '@/lib/env'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!isClerkConfigured() && !isGuestMode()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-secondary p-6">
        <div className="gildia-card max-w-md p-8 text-center">
          <h1 className="text-lg font-semibold text-text-primary">Sozlash kerak</h1>
          <p className="mt-2 text-sm text-text-muted">
            Production uchun Clerk kalitlari (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY va
            CLERK_SECRET_KEY) belgilanishi shart, yoki vaqtincha{' '}
            <code className="rounded bg-brand-50 px-1 text-xs">GILDIA_REQUIRE_CLERK</code>{' '}
            o‘chirilgan holda mehmon rejimidan foydalaning.
          </p>
        </div>
      </div>
    )
  }

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
