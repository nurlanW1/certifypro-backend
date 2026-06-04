/** Shrink i-text fontSize so text fits within maxWidth (canvas JSON, server-safe). */
export function autoFitTextInCanvasJson(
  canvasJson: { objects?: Record<string, unknown>[] },
  options?: { targetSubstrings?: string[]; maxWidth?: number }
): { objects?: Record<string, unknown>[] } {
  const clone = JSON.parse(JSON.stringify(canvasJson)) as {
    objects?: Record<string, unknown>[]
  }
  const maxWidth = options?.maxWidth ?? 620
  const targets = options?.targetSubstrings ?? ['{{participantName}}', '{{']

  if (!clone.objects) return clone

  for (const obj of clone.objects) {
    const type = obj.type as string | undefined
    if (type !== 'i-text' && type !== 'text' && type !== 'textbox') continue
    const text = String(obj.text ?? '')
    const matches =
      targets.some((t) => text.includes(t)) ||
      (text.length > 20 && !text.includes('{{eventName}}'))
    if (!matches) continue

    let fontSize = Number(obj.fontSize ?? 24)
    const minSize = 12
    while (fontSize > minSize && estimateTextWidth(text, fontSize) > maxWidth) {
      fontSize -= 1
    }
    obj.fontSize = fontSize
  }

  return clone
}

function estimateTextWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.55
}
