'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileImage, LayoutTemplate } from 'lucide-react'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { EditorLayersPanel } from '@/components/editor/EditorLayersPanel'
import { useEditorStore } from '@/store/editorStore'
import { cn } from '@/lib/utils'
import { MATERIAL_LABELS, type EventMaterial } from '@/types/event'

interface WorkspaceLeftPanelProps {
  designId: string
  eventId?: string | null
}

export function WorkspaceLeftPanel({ designId, eventId }: WorkspaceLeftPanelProps) {
  const { layersOpen } = useEditorStore()
  const [materials, setMaterials] = useState<EventMaterial[]>([])

  useEffect(() => {
    if (!eventId) {
      setMaterials([])
      return
    }

    void fetch(`/api/events/${eventId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { event?: { materials?: EventMaterial[] } } | null) => {
        setMaterials(data?.event?.materials ?? [])
      })
      .catch(() => setMaterials([]))
  }, [eventId])

  return (
    <div className="flex h-full min-h-0">
      <EditorToolbar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="border-b border-divide px-3 py-2.5">
          <p className="label-caps">Shablonlar</p>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {eventId && materials.length > 0 ? (
            <ul className="space-y-1">
              {materials.map((material) => {
                const active = material.designId === designId
                const href = material.designId
                  ? `/editor/${material.designId}?eventId=${eventId}&asset=1`
                  : null

                return (
                  <li key={material.id}>
                    {href ? (
                      <Link
                        href={href}
                        className={cn(
                          'flex items-start gap-2 rounded px-2 py-2 text-left transition-colors',
                          active
                            ? 'border border-accent-border bg-accent-dim'
                            : 'hover:bg-subtle'
                        )}
                      >
                        <FileImage size={14} className="mt-0.5 shrink-0 text-text-tertiary" />
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-medium text-text-primary">
                            {MATERIAL_LABELS[material.category] ?? material.category}
                          </span>
                          <span className="block truncate text-[10px] text-text-disabled">
                            {material.status}
                          </span>
                        </span>
                      </Link>
                    ) : (
                      <div className="flex items-start gap-2 rounded px-2 py-2 opacity-60">
                        <FileImage size={14} className="mt-0.5 shrink-0 text-text-tertiary" />
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-medium text-text-primary">
                            {MATERIAL_LABELS[material.category] ?? material.category}
                          </span>
                          <span className="block truncate text-[10px] text-text-disabled">
                            Tayyor emas
                          </span>
                        </span>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center px-2 py-8 text-center">
              <LayoutTemplate size={20} className="text-text-disabled" />
              <p className="mt-2 text-xs text-text-disabled">
                {eventId ? 'Materiallar topilmadi' : 'Tadbir kontekstisiz ishlayapsiz'}
              </p>
            </div>
          )}
        </div>

        {layersOpen && (
          <div className="border-t border-divide p-2">
            <EditorLayersPanel inline />
          </div>
        )}
      </div>
    </div>
  )
}
