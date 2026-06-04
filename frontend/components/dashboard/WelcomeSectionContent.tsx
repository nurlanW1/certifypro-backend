'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export function WelcomeSectionContent({ firstName }: { firstName: string }) {
  const today = formatDate(new Date())

  return (
    <section className="relative overflow-hidden rounded-md border-2 border-text-primary bg-brand-900 p-6 text-text-inverse shadow-brutal md:p-8">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-sm bg-accent-500/30" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-black/20 to-transparent" />
      <p className="relative text-xs font-bold uppercase tracking-widest text-brand-200">{today}</p>
      <h1 className="relative mt-2 font-display text-2xl font-extrabold md:text-3xl">
        Xush kelibsiz, {firstName}!
      </h1>
      <p className="relative mt-2 text-brand-100/80">
        Bugun qaysi tadbirni rejalashtirmoqchisiz?
      </p>
      <Link
        href="/events/new"
        className="relative mt-6 inline-flex items-center gap-2 rounded-sm border-2 border-text-primary bg-accent-500 px-5 py-2.5 text-sm font-bold text-text-primary shadow-brutal-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
      >
        Yangi tadbir yaratish
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}
