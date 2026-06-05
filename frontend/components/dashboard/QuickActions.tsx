'use client'

import Link from 'next/link'
import { CalendarPlus, Layout, Award, CreditCard } from 'lucide-react'

const QUICK_ACTIONS = [
  {
    icon: CalendarPlus,
    title: 'Yangi tadbir',
    desc: 'Materiallar ro‘yxati bilan loyiha',
    href: '/events/new',
    primary: true,
  },
  {
    icon: Layout,
    title: 'Tadbirlarim',
    desc: 'Barcha loyihalar',
    href: '/events',
    primary: false,
  },
  {
    icon: Award,
    title: 'Sertifikat shablon',
    desc: 'Katalogdan tanlash',
    href: '/templates?category=CERTIFICATE',
    primary: false,
  },
  {
    icon: CreditCard,
    title: 'Pro rejim',
    desc: "Ko'proq imkoniyat",
    href: '/upgrade',
    primary: false,
    accent: true,
  },
]

export function QuickActions() {
  return (
    <section className="border-b border-divide">
      <p className="label-caps border-b border-divide py-4">Tezkor harakatlar</p>
      <div className="divide-y divide-divide">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group flex items-center gap-4 py-4 transition-colors hover:bg-subtle"
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded ${
                action.primary
                  ? 'bg-accent-dim text-accent-hover'
                  : action.accent
                    ? 'bg-warn/10 text-warn'
                    : 'bg-subtle text-text-tertiary'
              }`}
            >
              <action.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-text-primary">{action.title}</p>
              <p className="text-xs text-text-tertiary">{action.desc}</p>
            </div>
            <span className="text-xs text-text-disabled transition-colors group-hover:text-text-tertiary">
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
