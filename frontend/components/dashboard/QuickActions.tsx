'use client'

import Link from 'next/link'
import {
  CalendarPlus,
  Layout,
  Award,
  CreditCard,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickAction {
  icon: LucideIcon
  title: string
  desc: string
  href: string
  color: 'brand' | 'success' | 'warning'
  isPro?: boolean
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: CalendarPlus,
    title: 'Yangi tadbir',
    desc: 'Materiallar ro‘yxati bilan loyiha',
    href: '/events/new',
    color: 'brand',
  },
  {
    icon: Layout,
    title: 'Tadbirlarim',
    desc: 'Barcha loyihalar',
    href: '/events',
    color: 'success',
  },
  {
    icon: Award,
    title: 'Sertifikat shablon',
    desc: 'Katalogdan (tadbirga bog‘lash tavsiya etiladi)',
    href: '/templates?category=CERTIFICATE',
    color: 'warning',
  },
  {
    icon: CreditCard,
    title: 'Pro rejim',
    desc: "Ko'proq imkoniyat",
    href: '/upgrade',
    color: 'brand',
    isPro: true,
  },
]

const colorMap = {
  brand: 'bg-brand-50 text-brand-600',
  success: 'bg-success-light text-success-dark',
  warning: 'bg-warning-light text-warning-dark',
}

export function QuickActions() {
  return (
    <section className="gildia-card p-6">
      <h2 className="mb-4 text-lg font-semibold text-text-primary">Tezkor harakatlar</h2>
      <div className="space-y-3">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={cn(
              'flex items-center gap-4 rounded-xl border border-border p-4',
              'cursor-pointer transition-all duration-150 hover:border-brand-200 hover:shadow-md',
              action.isPro && 'border-warning/30 bg-warning-light/30'
            )}
          >
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                colorMap[action.color]
              )}
            >
              <action.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-text-primary">{action.title}</p>
              <p className="text-xs text-text-muted">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
