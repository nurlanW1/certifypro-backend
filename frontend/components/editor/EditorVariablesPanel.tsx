'use client'

import { useEffect, useState } from 'react'
import { Braces, User, Eye, Maximize2 } from 'lucide-react'
import { autoFitTextInCanvasJson } from '@/lib/editor/auto-fit'
import toast from 'react-hot-toast'
import { fabric } from 'fabric'
import { useEditorStore } from '@/store/editorStore'
import {
  EVENT_VARIABLES,
  resolveVariableText,
  type EventVariableContext,
} from '@/lib/editor/variables'
import { Button } from '@/components/ui/Button'

interface ParticipantRow {
  id: string
  fullName: string
}

interface EditorVariablesPanelProps {
  eventId?: string | null
}

export function EditorVariablesPanel({ eventId }: EditorVariablesPanelProps) {
  const {
    fabricCanvas,
    eventContext,
    previewParticipantName,
    setPreviewParticipantName,
    pushHistory,
  } = useEditorStore()
  const [participants, setParticipants] = useState<ParticipantRow[]>([])

  useEffect(() => {
    if (!eventId) return
    void fetch(`/api/events/${eventId}/participants`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { participants?: ParticipantRow[] } | null) => {
        setParticipants(d?.participants ?? [])
      })
      .catch(() => setParticipants([]))
  }, [eventId])

  const insertPlaceholder = (placeholder: string) => {
    if (!fabricCanvas) return
    const text = new fabric.IText(placeholder, {
      left: 100,
      top: 200,
      fontSize: 22,
      fill: '#26215C',
      fontFamily: 'Arial',
    })
    fabricCanvas.add(text)
    fabricCanvas.setActiveObject(text)
    fabricCanvas.renderAll()
    pushHistory()
  }

  const applyPreview = () => {
    if (!fabricCanvas || !eventContext) {
      toast.error('Tadbir konteksti yo‘q')
      return
    }
    const ctx: EventVariableContext = {
      ...eventContext,
      participantName: previewParticipantName || eventContext.participantName,
    }
    const objects = fabricCanvas.getObjects()
    let changed = false
    for (const obj of objects) {
      if (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox') {
        const t = obj as fabric.IText
        const raw = t.text ?? ''
        if (raw.includes('{{')) {
          t.set('text', resolveVariableText(raw, ctx))
          changed = true
        }
      }
    }
    if (changed) {
      fabricCanvas.renderAll()
      pushHistory()
      toast.success('Ko‘rinish qo‘llandi')
    } else {
      toast('Matnda {{o‘zgaruvchi}} topilmadi — paneldan qo‘shing')
    }
  }

  if (!eventId) {
    return (
      <div className="border-b border-border p-4 text-xs text-text-muted">
        Tadbir o‘zgaruvchilari uchun materialni tadbir orqali oching.
      </div>
    )
  }

  return (
    <div className="border-b border-border">
      <div className="flex items-center gap-2 px-4 py-3">
        <Braces className="h-4 w-4 text-brand-600" />
        <h2 className="text-sm font-semibold text-text-primary">O‘zgaruvchilar</h2>
      </div>
      <div className="space-y-3 px-4 pb-4">
        <div className="flex flex-wrap gap-1.5">
          {EVENT_VARIABLES.map((v) => (
            <button
              key={v.key}
              type="button"
              onClick={() => insertPlaceholder(v.placeholder)}
              className="rounded-md bg-brand-50 px-2 py-1 text-xs font-medium text-brand-800 hover:bg-brand-100"
            >
              {v.placeholder}
            </button>
          ))}
        </div>

        {participants.length > 0 && (
          <label className="block text-xs">
            <span className="mb-1 flex items-center gap-1 font-medium text-text-secondary">
              <User className="h-3.5 w-3.5" />
              Ishtirokchi ko‘rinishi
            </span>
            <select
              className="gildia-input py-1.5 text-sm"
              value={previewParticipantName}
              onChange={(e) => setPreviewParticipantName(e.target.value)}
            >
              <option value="">— Tanlang —</option>
              {participants.map((p) => (
                <option key={p.id} value={p.fullName}>
                  {p.fullName}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="flex flex-col gap-2">
          <Button size="sm" variant="secondary" className="w-full" onClick={applyPreview}>
            <Eye className="h-3.5 w-3.5" />
            Ko‘rinishni qo‘llash
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="w-full"
            onClick={() => {
              if (!fabricCanvas) return
              const json = fabricCanvas.toJSON() as unknown as {
                objects?: Record<string, unknown>[]
              }
              const fitted = autoFitTextInCanvasJson(json, {
                targetSubstrings: ['{{participantName}}', previewParticipantName],
              })
              fabricCanvas.loadFromJSON(fitted, () => {
                fabricCanvas.renderAll()
                pushHistory()
                toast.success('Ism avtomatik sig‘dirildi')
              })
            }}
          >
            <Maximize2 className="h-3.5 w-3.5" />
            Ismni sig‘dirish
          </Button>
        </div>
      </div>
    </div>
  )
}
