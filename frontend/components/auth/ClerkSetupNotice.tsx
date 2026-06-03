import Link from 'next/link'

export function ClerkSetupNotice() {
  return (
    <div className="gildia-card mx-auto max-w-md p-8 text-center">
      <h1 className="text-xl font-semibold text-text-primary">Clerk sozlanmagan</h1>
      <p className="mt-3 text-sm text-text-muted">
        Lokal ishlatish uchun <code className="rounded bg-brand-50 px-1">.env.local</code> faylida
        Clerk API kalitlarini kiriting (.env.local.example dan nusxa oling).
      </p>
      <Link href="/dashboard" className="gildia-btn-primary mt-6 inline-block px-6 py-2">
        Dashboard (dev)
      </Link>
    </div>
  )
}
