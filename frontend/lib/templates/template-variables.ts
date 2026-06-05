import type { EventVariableContext } from '@/lib/editor/variables'
import { fillTemplateVariables } from '@/lib/templates/svgEngine'

/** Demo values for template previews and gallery thumbnails. */
export const DEFAULT_PREVIEW_VARIABLES: Record<string, string> = {
  eventName: 'AI Forum Toshkent 2025',
  organization: "O'zbekiston AI Markazi",
  location: 'Toshkent IT Park',
  date: '15.06.2025',
  participantName: 'Alisher Karimov',
}

export function contextToVariableMap(ctx?: EventVariableContext | null): Record<string, string> {
  return {
    eventName: ctx?.eventName ?? DEFAULT_PREVIEW_VARIABLES.eventName,
    organization: ctx?.organization ?? DEFAULT_PREVIEW_VARIABLES.organization,
    location: ctx?.location ?? DEFAULT_PREVIEW_VARIABLES.location,
    date: ctx?.date ?? DEFAULT_PREVIEW_VARIABLES.date,
    participantName: ctx?.participantName ?? DEFAULT_PREVIEW_VARIABLES.participantName,
  }
}

/** Apply {{placeholders}} to raw template SVG (svgEngine + preview/editor). */
export function applyTemplateVariables(
  svg: string,
  ctx?: EventVariableContext | null
): string {
  return fillTemplateVariables(svg, contextToVariableMap(ctx))
}
