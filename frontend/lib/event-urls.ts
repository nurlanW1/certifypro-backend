import type { MaterialCategory } from '@/types/event'

export function templatesUrlForMaterial(
  eventId: string,
  category: MaterialCategory
): string {
  const params = new URLSearchParams({ category, eventId })
  return `/templates?${params.toString()}`
}
