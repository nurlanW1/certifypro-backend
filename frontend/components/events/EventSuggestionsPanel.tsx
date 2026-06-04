'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Copy } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useEventWorkspace } from '@/contexts/EventWorkspaceContext'
import type { EventCopySuggestions } from '@/lib/ai/suggestions'

export function EventSuggestionsPanel() {
  const { event } = useEventWorkspace()
  const [suggestions, setSuggestions] = useState<EventCopySuggestions | null>(null)
  const [source, setSource] = useState<'llm' | 'rules' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void fetch(`/api/events/${event.id}/suggestions`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { suggestions?: EventCopySuggestions; source?: 'llm' | 'rules' } | null) => {
        setSuggestions(d?.suggestions ?? null)
        setSource(d?.source ?? null)
      })
      .finally(() => setLoading(false))
  }, [event.id])

  const copy = (text: string) => {
    void navigator.clipboard.writeText(text)
    toast.success('Nusxa olindi')
  }

  if (loading) {
    return <div className="h-24 animate-pulse rounded-xl bg-surface-tertiary" />
  }

  if (!suggestions) return null

  return (
    <Card className="p-5">
      <h2 className="flex items-center gap-2 font-semibold text-text-primary">
        <Sparkles className="h-5 w-5 text-brand-600" />
        AI matn takliflari
      </h2>
      <p className="mt-1 text-xs text-text-muted">
        Manba:{' '}
        <span className="font-medium text-text-secondary">
          {source === 'llm' ? 'OpenAI' : source === 'rules' ? 'Qoidalar' : '—'}
        </span>
        {source === 'rules' && ' (OPENAI_API_KEY qo‘shilsa — LLM)'}
      </p>

      <div className="mt-4 space-y-4">
        <SuggestionBlock
          title="Taklifnoma"
          text={suggestions.invitation}
          onCopy={() => copy(suggestions.invitation)}
        />
        <SuggestionBlock
          title="Sertifikat pastki yozuv"
          text={suggestions.certificateSubtitle}
          onCopy={() => copy(suggestions.certificateSubtitle)}
        />
        <div>
          <p className="text-xs font-medium text-text-secondary">Dastur (namuna)</p>
          <ul className="mt-2 space-y-1 text-sm text-text-muted">
            {suggestions.agenda.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <Button
            size="sm"
            variant="ghost"
            className="mt-2"
            onClick={() => copy(suggestions.agenda.join('\n'))}
          >
            <Copy className="h-3.5 w-3.5" />
            Dasturni nusxalash
          </Button>
        </div>
        <SuggestionBlock
          title="Ijtimoiy tarmoq"
          text={suggestions.socialPost}
          onCopy={() => copy(suggestions.socialPost)}
        />
      </div>
    </Card>
  )
}

function SuggestionBlock({
  title,
  text,
  onCopy,
}: {
  title: string
  text: string
  onCopy: () => void
}) {
  return (
    <div>
      <p className="text-xs font-medium text-text-secondary">{title}</p>
      <p className="mt-1 text-sm text-text-muted">{text}</p>
      <Button size="sm" variant="ghost" className="mt-1" onClick={onCopy}>
        <Copy className="h-3.5 w-3.5" />
        Nusxalash
      </Button>
    </div>
  )
}
