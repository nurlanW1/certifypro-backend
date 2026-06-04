import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { isClerkConfigured } from '@/lib/clerk-config'
import { isProduction } from '@/lib/env'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (isProduction() && !isClerkConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-secondary p-6">
        <div className="gildia-card max-w-md p-8 text-center">
          <h1 className="text-lg font-semibold text-text-primary">Sozlash kerak</h1>
          <p className="mt-2 text-sm text-text-muted">
            Production uchun Clerk kalitlari (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY va
            CLERK_SECRET_KEY) Vercel muhitida belgilanishi shart.
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

  return <DashboardShell>{children}</DashboardShell>
}
