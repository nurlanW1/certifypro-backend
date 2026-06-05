'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export function WelcomeSectionContent({ firstName }: { firstName: string }) {
  const today = formatDate(new Date())

  return (
    <section className="border-b border-divide py-10">
      <p className="label-caps mb-2">{today}</p>
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
        Xush kelibsiz, {firstName}
      </h1>
      <p className="mt-2 text-text-secondary">
        Bugun qaysi tadbirni rejalashtirmoqchisiz?
      </p>
      <Link
        href="/events/new"
        className="btn-primary btn-sm mt-6 inline-flex items-center gap-2"
      >
        Yangi tadbir yaratish
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}
