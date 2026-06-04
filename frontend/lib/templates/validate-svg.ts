const REQUIRED_VARS = ['{{eventName}}'] as const

const RECOMMENDED_BY_CATEGORY: Record<string, string[]> = {
  CERTIFICATE: ['{{participantName}}', '{{organization}}', '{{date}}'],
  BADGE: ['{{participantName}}'],
  INVITATION: ['{{eventName}}', '{{date}}', '{{location}}'],
  NAME_TAG: ['{{participantName}}'],
}

export interface SvgValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export function validateTemplateSvg(
  svgContent: string,
  category?: string
): SvgValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  const trimmed = svgContent?.trim() ?? ''
  if (!trimmed) {
    errors.push('SVG bo‘sh')
    return { valid: false, errors, warnings }
  }

  if (!trimmed.includes('<svg')) {
    errors.push('SVG root element yo‘q')
  }

  for (const v of REQUIRED_VARS) {
    if (!trimmed.includes(v)) {
      errors.push(`Majburiy o‘zgaruvchi yo‘q: ${v}`)
    }
  }

  if (category && RECOMMENDED_BY_CATEGORY[category]) {
    for (const v of RECOMMENDED_BY_CATEGORY[category]) {
      if (!trimmed.includes(v)) {
        warnings.push(`Tavsiya etilgan o‘zgaruvchi yo‘q: ${v}`)
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings }
}
