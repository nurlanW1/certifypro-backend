'use client'

import Link from 'next/link'
import { ArrowRight, Calendar, Palette, Sparkles } from 'lucide-react'
import { APP_NAME } from '@/lib/constants'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-secondary">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-semibold text-text-primary">{APP_NAME}</span>
          <nav className="flex items-center gap-3">
            <Link href="/sign-in" className="gildia-btn-secondary">
              Kirish
            </Link>
            <Link href="/sign-up" className="gildia-btn-primary flex items-center gap-2">
              Boshlash
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        <section className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm text-brand-800">
            <Sparkles className="h-4 w-4" />
            Tadbir dizaynini avtomatlashtiring
          </div>
          <h1 className="mb-4 text-text-primary">
            Konferentsiya va seminarlar uchun professional materiallar
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-text-secondary">
            Sertifikat, badge, poster va boshqa dizayn materiallarini bir platformada
            yarating, tahrirlang va eksport qiling.
          </p>
          <Link
            href="/sign-up"
            className="gildia-btn-primary inline-flex items-center gap-2 px-6 py-3 text-base"
          >
            Bepul boshlash
            <ArrowRight className="h-5 w-5" />
          </Link>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Calendar,
              title: 'Tadbir boshqaruvi',
              desc: 'Konferentsiya, seminar va forumlar uchun tadbir yaratish',
            },
            {
              icon: Palette,
              title: 'Shablon kutubxonasi',
              desc: 'Tayyor shablonlar bilan tez dizayn yaratish',
            },
            {
              icon: Sparkles,
              title: 'Fabric editor',
              desc: 'Professional kanvas muharriri bilan tahrirlash',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="gildia-card p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-text-primary">{title}</h3>
              <p className="text-sm text-text-muted">{desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
