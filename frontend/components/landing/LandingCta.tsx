import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function LandingCta() {
  return (
    <section className="w-full border-t border-divide bg-ink">
      <div className="mx-auto max-w-screen-xl px-6 py-20 lg:px-10 xl:px-16">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="mb-3 text-3xl font-semibold tracking-tight text-text-primary">
              Bugun boshlang
            </h2>
            <p className="max-w-md text-sm text-text-secondary">
              Birinchi tadbiringizni 30 daqiqada yarating. Karta kerak emas.
            </p>
          </div>
          <Link href="/events/new" className="btn-primary btn-lg inline-flex items-center gap-2">
            Bepul boshlash
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
