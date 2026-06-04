'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, PenTool } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import type { DashboardDesign } from '@/lib/mock-designs'

export function RecentDesigns() {
  const [designs, setDesigns] = useState<DashboardDesign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void fetch('/api/designs')
      .then((r) => r.json())
      .then((d: { designs: DashboardDesign[] }) => {
        setDesigns(d.designs ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="gildia-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">So&apos;nggi dizaynlar</h2>
        <Link
          href="/templates"
          className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-800"
        >
          Barchasini ko&apos;rish
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-surface-tertiary" />
          ))}
        </div>
      ) : designs.length === 0 ? (
        <EmptyState
          icon={PenTool}
          title="Hali dizayn yo'q"
          description="Shablon tanlang va muharrirda tahrirlang"
          actionLabel="Shablonlar"
          onAction={() => {
            window.location.href = '/templates'
          }}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {designs.slice(0, 4).map((design) => (
            <Link
              key={design.id}
              href={`/editor/${design.id}`}
              className="group overflow-hidden rounded-xl border border-border transition-all duration-150 hover:border-brand-200 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] bg-gradient-to-br from-accent-100 to-brand-100">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  <span className="rounded-sm border-2 border-text-primary bg-accent-500 px-3 py-1.5 text-xs font-bold text-text-primary">
                    Tahrirlash
                  </span>
                </div>
              </div>
              <div className="p-3">
                <p className="line-clamp-1 text-sm font-medium text-text-primary">
                  {design.name}
                </p>
                <p className="line-clamp-1 text-xs text-text-muted">{design.eventName}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
