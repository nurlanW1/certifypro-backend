'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { ArrowRight, PenTool } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { TemplateSkeleton } from '@/components/ui/Skeleton'
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
    <section className="mt-8">
      <div className="flex items-center justify-between border-b border-divide py-4">
        <p className="label-caps">So&apos;nggi dizaynlar</p>
        <Link
          href="/templates"
          className="flex items-center gap-1 text-xs text-text-tertiary transition-colors hover:text-text-secondary"
        >
          Barchasini ko&apos;rish
          <ArrowRight size={11} />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 pt-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <TemplateSkeleton key={i} />
          ))}
        </div>
      ) : designs.length === 0 ? (
        <div className="py-8">
          <EmptyState
            icon={PenTool}
            title="Hali dizayn yo'q"
            description="Shablon tanlang va muharrirda tahrirlang"
            actionLabel="Shablonlar"
            onAction={() => {
              window.location.href = '/templates'
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 pt-4 md:grid-cols-4">
          {designs.slice(0, 4).map((design) => (
            <Link
              key={design.id}
              href={`/editor/${design.id}`}
              className="group overflow-hidden rounded border border-divide transition-all duration-150 hover:border-text-disabled"
            >
              <div className="relative aspect-[3/4] bg-subtle">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  <span className="btn-accent btn-xs">Tahrirlash</span>
                </div>
              </div>
              <div className="border-t border-divide bg-ink px-3 py-2.5">
                <p className="line-clamp-1 text-xs text-text-secondary">{design.name}</p>
                <p className="line-clamp-1 text-[10px] text-text-tertiary">{design.eventName}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
