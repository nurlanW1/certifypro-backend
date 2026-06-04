export const EVENT_VARIABLES = [
  { key: 'eventName', label: 'Tadbir nomi', placeholder: '{{eventName}}' },
  { key: 'organization', label: 'Tashkilot', placeholder: '{{organization}}' },
  { key: 'location', label: 'Joy', placeholder: '{{location}}' },
  { key: 'date', label: 'Sana', placeholder: '{{date}}' },
  { key: 'participantName', label: 'Ishtirokchi', placeholder: '{{participantName}}' },
] as const

export type EventVariableContext = {
  eventName?: string
  organization?: string
  location?: string
  date?: string
  participantName?: string
}

export function resolveVariableText(template: string, ctx: EventVariableContext): string {
  return template
    .replace(/\{\{eventName\}\}/gi, ctx.eventName ?? '')
    .replace(/\{\{organization\}\}/gi, ctx.organization ?? '')
    .replace(/\{\{location\}\}/gi, ctx.location ?? '')
    .replace(/\{\{date\}\}/gi, ctx.date ?? '')
    .replace(/\{\{participantName\}\}/gi, ctx.participantName ?? '')
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
