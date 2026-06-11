import type { StarterTemplate, TemplateElement } from './types'

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderPlaceholderLabel(element: Extract<TemplateElement, { width: number }>) {
  if (!element.label) return ''
  const cx = element.x + element.width / 2
  const cy = element.y + element.height / 2
  return `<text x="${cx}" y="${cy + 4}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.max(10, Math.min(18, element.width / 8))}" fill="${element.stroke ?? '#64748b'}" opacity="0.82">${esc(element.label)}</text>`
}

function renderElement(element: TemplateElement): string {
  switch (element.type) {
    case 'text': {
      const anchor = element.align ?? 'start'
      return `<text x="${element.x}" y="${element.y}" text-anchor="${anchor}" font-family="${esc(element.fontFamily ?? 'Arial, sans-serif')}" font-size="${element.fontSize}" fill="${element.fill}" font-weight="${element.fontWeight ?? '400'}">${esc(element.text)}</text>`
    }
    case 'rect':
    case 'rectangle':
    case 'decorativeShape':
    case 'imagePlaceholder':
    case 'logoPlaceholder':
    case 'signaturePlaceholder':
    case 'stampPlaceholder':
    case 'qrPlaceholder': {
      const dash = element.dashed ? ' stroke-dasharray="10 8"' : ''
      const stroke = element.stroke ? ` stroke="${element.stroke}" stroke-width="${element.strokeWidth ?? 2}"${dash}` : ''
      const opacity = element.opacity !== undefined ? ` opacity="${element.opacity}"` : ''
      const fill = element.fill ?? 'transparent'
      const shape =
        element.type === 'stampPlaceholder'
          ? `<circle cx="${element.x + element.width / 2}" cy="${element.y + element.height / 2}" r="${Math.min(element.width, element.height) / 2}" fill="${fill}"${stroke}${opacity}/>`
          : `<rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" rx="${element.radius ?? 6}" fill="${fill}"${stroke}${opacity}/>`
      return `${shape}${renderPlaceholderLabel(element)}`
    }
    case 'circle': {
      const stroke = element.stroke ? ` stroke="${element.stroke}" stroke-width="${element.strokeWidth ?? 2}"` : ''
      const opacity = element.opacity !== undefined ? ` opacity="${element.opacity}"` : ''
      return `<circle cx="${element.x}" cy="${element.y}" r="${element.radius}" fill="${element.fill ?? 'transparent'}"${stroke}${opacity}/>`
    }
    case 'line': {
      const dash = element.dashed ? ' stroke-dasharray="10 8"' : ''
      const opacity = element.opacity !== undefined ? ` opacity="${element.opacity}"` : ''
      return `<line x1="${element.x1}" y1="${element.y1}" x2="${element.x2}" y2="${element.y2}" stroke="${element.stroke}" stroke-width="${element.strokeWidth ?? 2}"${dash}${opacity}/>`
    }
    default:
      return ''
  }
}

function renderStylePattern(template: StarterTemplate): string {
  if (template.style === 'hitech-science') {
    return `<defs>
      <pattern id="${template.id}-grid" width="42" height="42" patternUnits="userSpaceOnUse">
        <path d="M 42 0 L 0 0 0 42" fill="none" stroke="#22d3ee" stroke-width="1" opacity="0.14"/>
      </pattern>
    </defs>
    <rect width="${template.size.width}" height="${template.size.height}" fill="url(#${template.id}-grid)" opacity="0.9"/>`
  }
  if (template.style === 'classic') {
    return `<rect x="18" y="18" width="${template.size.width - 36}" height="${template.size.height - 36}" fill="none" stroke="#b88a2a" stroke-width="2"/>
    <rect x="32" y="32" width="${template.size.width - 64}" height="${template.size.height - 64}" fill="none" stroke="#b88a2a" stroke-width="1" opacity="0.55"/>`
  }
  return `<circle cx="${template.size.width * 0.92}" cy="${template.size.height * 0.12}" r="${Math.min(template.size.width, template.size.height) * 0.12}" fill="#dbeafe" opacity="0.65"/>`
}

export function renderStarterTemplateSvg(template: StarterTemplate): string {
  const body = template.elements.map(renderElement).join('\n')
  const background = template.backgroundAsset
    ? `<image href="${esc(template.backgroundAsset)}" x="0" y="0" width="${template.size.width}" height="${template.size.height}" preserveAspectRatio="none"/>`
    : renderStylePattern(template)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${template.size.width}" height="${template.size.height}" viewBox="0 0 ${template.size.width} ${template.size.height}" role="img" aria-label="${esc(template.title)}">
    ${background}
    ${body}
  </svg>`
}
