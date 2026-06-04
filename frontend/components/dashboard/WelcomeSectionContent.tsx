'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export function WelcomeSectionContent({ firstName }: { firstName: string }) {
  const today = formatDate(new Date())

  return (
    <section className="relative overflow-hidden rounded-2xl border border-brand-200 bg-brand-gradient p-6 text-text-inverse shadow-md md:p-8">
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <p className="relative text-xs font-medium uppercase tracking-wider text-brand-100">
        {today}
      </p>
      <h1 className="relative mt-2 font-display text-2xl font-bold md:text-3xl">
        Xush kelibsiz, {firstName}!
      </h1>
      <p className="relative mt-2 text-brand-100/90">
        Bugun qaysi tadbirni rejalashtirmoqchisiz?
      </p>
      <Link
        href="/events/new"
        className="relative mt-6 inline-flex items-center gap-2 rounded-xl bg-surface px-5 py-2.5 text-sm font-semibold text-brand-800 shadow-sm transition-all hover:bg-brand-50"
      >
        Yangi tadbir yaratish
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}
