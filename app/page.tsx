import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AuthButtons } from '@/components/auth/AuthButtons'
import { isClerkConfigured } from '@/lib/clerk-config'

export default async function HomePage() {
  if (isClerkConfigured()) {
    const { auth } = await import('@clerk/nextjs/server')
    const { userId } = auth()
    if (userId) redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-surface-secondary">
      <nav className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
            <span className="text-sm font-semibold text-text-inverse">G</span>
          </div>
          <span className="font-semibold text-text-primary">Gildia</span>
        </div>
        <div className="flex items-center gap-3">
          <AuthButtons />
        </div>
      </nav>

      {!isClerkConfigured() && (
        <div className="border-b border-amber-200 bg-amber-50 px-6 py-2 text-center text-sm text-amber-900">
          Dev rejim: Clerk kalitlari yo&apos;q —{' '}
          <Link href="/dashboard" className="font-medium underline">
            Dashboard
          </Link>
          ga o&apos;tishingiz mumkin.
        </div>
      )}

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-600">
          Tadbir dizaynini avtomatlashtiring
        </div>
        <h1 className="mb-6 text-4xl font-semibold leading-tight text-text-primary md:text-5xl">
          Tadbir materiallarini
          <br />
          <span className="text-brand-600">bir zumda</span> tayyor qiling
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-text-muted">
          Ma&apos;lumotni bir marta kiriting — sertifikat, nishon, taklifnoma, flayer va
          boshqa 20+ dizayn materiali avtomatik tayyorlanadi.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <AuthButtons size="hero" />
          <Link href="/templates" className="gildia-btn-secondary px-8 py-3 text-base">
            Shablonlarni ko&apos;rish
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              icon: '⚡',
              title: 'Bir marta kirit',
              desc: "Tadbir ma'lumotlarini bir marta kiritasiz — barcha materiallarda avtomatik paydo bo'ladi",
            },
            {
              icon: '🎨',
              title: '24 ta material turi',
              desc: "Sertifikat, nishon, taklifnoma, flayer, banner va boshqa ko'plab materiallar",
            },
            {
              icon: '📥',
              title: 'PNG va PDF eksport',
              desc: "Professional sifatda yuklab oling, to'g'ridan-to'g'ri chop etishga tayyor",
            },
          ].map((f) => (
            <div key={f.title} className="gildia-card p-6 text-center">
              <div className="mb-4 text-3xl">{f.icon}</div>
              <h3 className="mb-2 font-semibold text-text-primary">{f.title}</h3>
              <p className="text-sm text-text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
