import type { MaterialCategory } from '@/types/event'

export async function startTemplateDesignForEvent(
  eventId: string,
  category: MaterialCategory,
  templateId: string
): Promise<{ designId: string } | { error: string }> {
  const res = await fetch(`/api/events/${eventId}/materials/${category}/design`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ templateId }),
  })

  const data = (await res.json()) as {
    design?: { id: string }
    error?: string
  }

  if (!res.ok) {
    return { error: data.error ?? 'Dizayn yaratib bo‘lmadi' }
  }

  if (!data.design?.id) {
    return { error: 'Dizayn yaratib bo‘lmadi' }
  }

  return { designId: data.design.id }
}
