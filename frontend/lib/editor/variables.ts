export const EVENT_VARIABLES = [
  { key: 'eventName', label: 'Tadbir nomi', placeholder: '{{event_name}}' },
  { key: 'organization', label: 'Tashkilot', placeholder: '{{organization}}' },
  { key: 'location', label: 'Joy', placeholder: '{{location}}' },
  { key: 'date', label: 'Sana', placeholder: '{{date}}' },
  { key: 'participantName', label: 'Ishtirokchi', placeholder: '{{full_name}}' },
  { key: 'position', label: 'Lavozim', placeholder: '{{position}}' },
  { key: 'role', label: 'Rol', placeholder: '{{role}}' },
  { key: 'certificateId', label: 'Sertifikat ID', placeholder: '{{certificate_id}}' },
  { key: 'qrCode', label: 'QR kod', placeholder: '{{qr_code}}' },
  { key: 'seatNumber', label: 'Joy raqami', placeholder: '{{seat_number}}' },
  { key: 'speakerName', label: 'Spiker', placeholder: '{{speaker_name}}' },
] as const

export type EventVariableContext = {
  eventName?: string
  organization?: string
  location?: string
  date?: string
  participantName?: string
  position?: string
  role?: string
  certificateId?: string
  qrCode?: string
  seatNumber?: string
  speakerName?: string
}

export function resolveVariableText(template: string, ctx: EventVariableContext): string {
  return template
    .replace(/\{\{eventName\}\}/gi, ctx.eventName ?? '')
    .replace(/\{\{event_name\}\}/gi, ctx.eventName ?? '')
    .replace(/\{\{organization\}\}/gi, ctx.organization ?? '')
    .replace(/\{\{location\}\}/gi, ctx.location ?? '')
    .replace(/\{\{date\}\}/gi, ctx.date ?? '')
    .replace(/\{\{participantName\}\}/gi, ctx.participantName ?? '')
    .replace(/\{\{full_name\}\}/gi, ctx.participantName ?? '')
    .replace(/\{\{position\}\}/gi, ctx.position ?? '')
    .replace(/\{\{role\}\}/gi, ctx.role ?? '')
    .replace(/\{\{certificate_id\}\}/gi, ctx.certificateId ?? '')
    .replace(/\{\{qr_code\}\}/gi, ctx.qrCode ?? '')
    .replace(/\{\{seat_number\}\}/gi, ctx.seatNumber ?? '')
    .replace(/\{\{speaker_name\}\}/gi, ctx.speakerName ?? '')
}

/** Apply variable substitution to all i-text objects on canvas JSON. */
export function applyVariablesToCanvasJson(
  canvasJson: object,
  ctx: EventVariableContext
): object {
  const clone = JSON.parse(JSON.stringify(canvasJson)) as {
    objects?: { type?: string; text?: string }[]
  }
  if (!clone.objects) return clone
  for (const obj of clone.objects) {
    if (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox') {
      if (typeof obj.text === 'string' && obj.text.includes('{{')) {
        obj.text = resolveVariableText(obj.text, ctx)
      }
    }
  }
  return clone
}
