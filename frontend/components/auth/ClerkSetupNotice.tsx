import Link from 'next/link'

export function ClerkSetupNotice() {
  return (
    <div className="gildia-card mx-auto max-w-md p-8 text-center">
      <h1 className="text-xl font-semibold text-text-primary">Kirish keyinroq</h1>
      <p className="mt-3 text-sm text-text-muted">
        Clerk hali ulanmagan. Hozircha mehmon rejimida dashboard va barcha sahifalarni
        ko‘rib chiqishingiz mumkin.
      </p>
      <Link href="/dashboard" className="gildia-btn-primary mt-6 inline-block px-6 py-2">
        Dashboardga o‘tish
      </Link>
      <p className="mt-4 text-xs text-text-muted">
        Clerk tayyor bo‘lganda Vercel → Environment Variables ga kalitlarni qo‘shing.
      </p>
    </div>
  )
}
