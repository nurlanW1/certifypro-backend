import { getAppBaseUrl } from '@/lib/payments/config'

/** Shablon katalogi uchun preview (SVG API). */
export function templatePreviewUrl(templateId: string): string {
  const base = getAppBaseUrl().replace(/\/$/, '')
  return `${base}/api/templates/${templateId}/preview`
}

export function resolveTemplatePreviewUrl(
  templateId: string,
  existingPreviewUrl?: string | null
): string {
  const existing = existingPreviewUrl?.trim()
  if (existing?.startsWith('https://')) return existing
  return templatePreviewUrl(templateId)
}
