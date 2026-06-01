'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export function WelcomeSectionContent({ firstName }: { firstName: string }) {
  const today = formatDate(new Date())

  return (
    <section className="gildia-card p-6 md:p-8">
      <p className="text-sm text-text-muted">{today}</p>
      <h1 className="mt-1 text-2xl font-semibold text-text-primary md:text-3xl">
        Xush kelibsiz, {firstName}!
      </h1>
      <p className="mt-2 text-text-muted">Bugun qaysi tadbirni rejalashtirmoqchisiz?</p>
      <Link
        href="/events/new"
        className="gildia-btn-primary mt-6 inline-flex items-center gap-2"
      >
        Yangi tadbir yaratish
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}
