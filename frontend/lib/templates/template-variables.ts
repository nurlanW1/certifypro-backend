import type { EventVariableContext } from '@/lib/editor/variables'
import { fillTemplateVariables } from '@/lib/templates/svgEngine'

/** Demo values for template previews and gallery thumbnails. */
export const DEFAULT_PREVIEW_VARIABLES: Record<string, string> = {
  eventName: 'AI Forum Toshkent 2025',
  event_name: 'AI Forum Toshkent 2025',
  organization: "O'zbekiston AI Markazi",
  location: 'Toshkent IT Park',
  date: '15.06.2025',
  participantName: 'Alisher Karimov',
  full_name: 'Alisher Karimov',
  position: 'Head of Research',
  role: 'Participant',
  certificate_id: 'GIL-2026-001',
  qr_code: 'QR',
  seat_number: 'A-14',
  speaker_name: 'Dr. Malika Karimova',
  sponsor_name: 'Gold Sponsor',
}

export function contextToVariableMap(ctx?: EventVariableContext | null): Record<string, string> {
  return {
    eventName: ctx?.eventName ?? DEFAULT_PREVIEW_VARIABLES.eventName,
    event_name: ctx?.eventName ?? DEFAULT_PREVIEW_VARIABLES.event_name,
    organization: ctx?.organization ?? DEFAULT_PREVIEW_VARIABLES.organization,
    location: ctx?.location ?? DEFAULT_PREVIEW_VARIABLES.location,
    date: ctx?.date ?? DEFAULT_PREVIEW_VARIABLES.date,
    participantName: ctx?.participantName ?? DEFAULT_PREVIEW_VARIABLES.participantName,
    full_name: ctx?.participantName ?? DEFAULT_PREVIEW_VARIABLES.full_name,
    position: ctx?.position ?? DEFAULT_PREVIEW_VARIABLES.position,
    role: ctx?.role ?? DEFAULT_PREVIEW_VARIABLES.role,
    certificate_id: ctx?.certificateId ?? DEFAULT_PREVIEW_VARIABLES.certificate_id,
    qr_code: ctx?.qrCode ?? DEFAULT_PREVIEW_VARIABLES.qr_code,
    seat_number: ctx?.seatNumber ?? DEFAULT_PREVIEW_VARIABLES.seat_number,
    speaker_name: ctx?.speakerName ?? DEFAULT_PREVIEW_VARIABLES.speaker_name,
    sponsor_name: DEFAULT_PREVIEW_VARIABLES.sponsor_name,
  }
}

/** Apply {{placeholders}} to raw template SVG (svgEngine + preview/editor). */
export function applyTemplateVariables(
  svg: string,
  ctx?: EventVariableContext | null
): string {
  return fillTemplateVariables(svg, contextToVariableMap(ctx))
}
