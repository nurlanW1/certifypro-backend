import type { MaterialCategory } from '@/types/event'

export type TemplateVisualStyle = 'CLASSIC' | 'MINIMAL' | 'HITECH' | 'COLORFUL'

export interface TemplateSvgInput {
  id: string
  name: string
  category: MaterialCategory | string
  tags?: string[]
  isPremium?: boolean
}

const PALETTES: Record<
  TemplateVisualStyle,
  { bg: string; surface: string; primary: string; accent: string; text: string; muted: string }
> = {
  CLASSIC: {
    bg: '#FDFAF5',
    surface: '#FFFFFF',
    primary: '#2C1654',
    accent: '#C9A84C',
    text: '#1a1a2e',
    muted: '#6b5b7a',
  },
  MINIMAL: {
    bg: '#FAFAFA',
    surface: '#FFFFFF',
    primary: '#09090B',
    accent: '#52525B',
    text: '#18181B',
    muted: '#71717A',
  },
  HITECH: {
    bg: '#080808',
    surface: '#111111',
    primary: '#7B68EE',
    accent: '#9080F5',
    text: '#F2F2F2',
    muted: '#A8A8A8',
  },
  COLORFUL: {
    bg: '#EEF2FF',
    surface: '#FFFFFF',
    primary: '#2563EB',
    accent: '#0EA5E9',
    text: '#1E3A8A',
    muted: '#64748B',
  },
}

const CATEGORY_SIZE: Record<string, { w: number; h: number }> = {
  CERTIFICATE: { w: 794, h: 1123 },
  BADGE: { w: 600, h: 380 },
  INVITATION: { w: 600, h: 850 },
  FLYER: { w: 595, h: 842 },
  POSTER: { w: 600, h: 900 },
  SOCIAL_MEDIA: { w: 1080, h: 1080 },
  EMAIL_BANNER: { w: 1200, h: 400 },
  TABLE_TENT: { w: 800, h: 600 },
  ROLL_UP: { w: 850, h: 2000 },
  PROGRAM_BOOK: { w: 794, h: 1123 },
  PRESS_WALL: { w: 1200, h: 800 },
  NAME_TAG: { w: 400, h: 250 },
  NAVIGATION: { w: 800, h: 400 },
  SCIENTIFIC_POSTER: { w: 900, h: 1200 },
  STAGE_BACKDROP: { w: 1600, h: 900 },
  LED_SCREEN: { w: 1920, h: 1080 },
  SOUVENIR: { w: 600, h: 600 },
  SPONSOR_BANNER: { w: 1200, h: 300 },
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function variantIndex(id: string): number {
  const m = id.match(/(\d+)$/)
  return m ? parseInt(m[1], 10) : 1
}

export function inferTemplateStyle(tags: string[] = [], isPremium = false): TemplateVisualStyle {
  const t = tags.join(' ').toLowerCase()
  if (isPremium || t.includes('premium') || t.includes('vip') || t.includes('hi-tech')) {
    return 'HITECH'
  }
  if (t.includes('klassik') || t.includes('rasmiy') || t.includes('oltin')) {
    return 'CLASSIC'
  }
  if (t.includes('rangli') || t.includes('yorqin') || t.includes('yoshlar')) {
    return 'COLORFUL'
  }
  return 'MINIMAL'
}

function headerBand(w: number, h: number, p: (typeof PALETTES)[TemplateVisualStyle], title: string) {
  return `
  <rect x="0" y="0" width="${w}" height="${Math.round(h * 0.14)}" fill="${p.primary}"/>
  <rect x="0" y="${Math.round(h * 0.14)}" width="${w}" height="6" fill="${p.accent}"/>
  <text x="${w / 2}" y="${Math.round(h * 0.09)}" text-anchor="middle" font-family="Georgia,serif" font-size="${Math.round(w * 0.04)}" fill="#ffffff" font-weight="600">${escapeXml(title)}</text>`
}

function variableBlock(
  w: number,
  startY: number,
  p: (typeof PALETTES)[TemplateVisualStyle],
  lines: { key: string; size: number; weight?: string }[]
) {
  return lines
    .map((line, i) => {
      const y = startY + i * (line.size * 1.8)
      return `<text x="${w / 2}" y="${y}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${line.size}" fill="${i === 0 ? p.text : p.muted}" font-weight="${line.weight ?? 'normal'}">${line.key}</text>`
    })
    .join('\n')
}

function layoutCertificate(w: number, h: number, title: string, style: TemplateVisualStyle, v: number) {
  const p = PALETTES[style]
  const frame = v % 2 === 0 ? 48 : 32
  return `
  <rect width="${w}" height="${h}" fill="${p.bg}"/>
  <rect x="${frame}" y="${frame}" width="${w - frame * 2}" height="${h - frame * 2}" fill="${p.surface}" stroke="${p.accent}" stroke-width="${v % 3 === 0 ? 6 : 4}" rx="8"/>
  ${headerBand(w, h, p, title)}
  <text x="${w / 2}" y="${h * 0.22}" text-anchor="middle" font-family="Georgia,serif" font-size="28" fill="${p.primary}">SERTIFIKAT</text>
  <line x1="${w * 0.2}" y1="${h * 0.25}" x2="${w * 0.8}" y2="${h * 0.25}" stroke="${p.accent}" stroke-width="2"/>
  ${variableBlock(w, h * 0.34, p, [
    { key: '{{eventName}}', size: 26, weight: '600' },
    { key: '{{participantName}}', size: 32, weight: '700' },
    { key: '{{organization}}', size: 18 },
    { key: '{{date}} · {{location}}', size: 14 },
  ])}
  <rect x="${w * 0.15}" y="${h * 0.78}" width="${w * 0.7}" height="80" fill="${p.primary}" opacity="0.08" rx="6"/>
  <text x="${w / 2}" y="${h * 0.92}" text-anchor="middle" font-size="11" fill="${p.muted}">Gildia · ${escapeXml('CERTIFICATE')}</text>`
}

function layoutBadge(w: number, h: number, title: string, style: TemplateVisualStyle, v: number) {
  const p = PALETTES[style]
  const photoW = w * 0.28
  const textX = 32 + photoW + 24
  const photoCx = 32 + photoW / 2
  return `
  <rect width="${w}" height="${h}" fill="${p.bg}"/>
  <rect x="16" y="16" width="${w - 32}" height="${h - 32}" rx="16" fill="${p.surface}" stroke="${p.primary}" stroke-width="3"/>
  <rect x="32" y="32" width="${photoW}" height="${h - 64}" rx="8" fill="${p.primary}" opacity="0.15"/>
  <text x="${photoCx}" y="${h * 0.45}" text-anchor="middle" font-size="12" fill="${p.muted}">FOTO</text>
  <text x="${textX}" y="72" font-family="Arial,sans-serif" font-size="14" fill="${p.muted}">${escapeXml(title)}</text>
  <text x="${textX}" y="110" font-family="Arial,sans-serif" font-size="28" fill="${p.text}" font-weight="700">{{participantName}}</text>
  <text x="${textX}" y="140" font-family="Arial,sans-serif" font-size="16" fill="${p.muted}">{{organization}}</text>
  <text x="${textX}" y="168" font-family="Arial,sans-serif" font-size="14" fill="${p.muted}">{{eventName}}</text>
  <rect x="${w - 120}" y="${h - 56}" width="88" height="32" rx="16" fill="${v % 2 ? p.accent : p.primary}"/>
  <text x="${w - 76}" y="${h - 34}" text-anchor="middle" font-size="11" fill="#fff">BADGE</text>`
}

function layoutInvitation(w: number, h: number, title: string, style: TemplateVisualStyle, v: number) {
  const p = PALETTES[style]
  return `
  <rect width="${w}" height="${h}" fill="${p.bg}"/>
  <rect x="24" y="24" width="${w - 48}" height="${h - 48}" fill="${p.surface}" stroke="${p.accent}" stroke-width="2" rx="12"/>
  <circle cx="${w / 2}" cy="100" r="40" fill="${p.primary}" opacity="0.9"/>
  <text x="${w / 2}" y="108" text-anchor="middle" font-size="20" fill="#fff">✉</text>
  <text x="${w / 2}" y="180" text-anchor="middle" font-family="Georgia,serif" font-size="24" fill="${p.primary}">${escapeXml(title)}</text>
  <text x="${w / 2}" y="220" text-anchor="middle" font-size="14" fill="${p.muted}">Sizni taklif qilamiz</text>
  ${variableBlock(w, 280, p, [
    { key: '{{eventName}}', size: 22, weight: '600' },
    { key: '{{date}}', size: 18 },
    { key: '{{location}}', size: 16 },
    { key: '{{organization}}', size: 14 },
  ])}
  <rect x="${w * 0.25}" y="${h - 140}" width="${w * 0.5}" height="48" rx="24" fill="${p.primary}"/>
  <text x="${w / 2}" y="${h - 110}" text-anchor="middle" font-size="14" fill="#fff">RSVP</text>
  ${v % 2 === 0 ? `<rect x="${w - 100}" y="${h - 200}" width="64" height="64" fill="${p.accent}" opacity="0.3"/>` : ''}`
}

function layoutFlyer(w: number, h: number, title: string, style: TemplateVisualStyle, v: number) {
  const p = PALETTES[style]
  return `
  <rect width="${w}" height="${h}" fill="${p.bg}"/>
  <rect x="0" y="0" width="${w}" height="${h * 0.35}" fill="${p.primary}"/>
  <text x="40" y="80" font-family="Arial,sans-serif" font-size="32" fill="#fff" font-weight="700">${escapeXml(title)}</text>
  <text x="40" y="120" font-size="16" fill="#ffffffcc">{{eventName}}</text>
  <rect x="40" y="${h * 0.42}" width="${w - 80}" height="4" fill="${p.accent}"/>
  <text x="40" y="${h * 0.5}" font-size="20" fill="${p.text}" font-weight="600">{{participantName}}</text>
  <text x="40" y="${h * 0.5 + 28}" font-size="16" fill="${p.muted}">{{organization}}</text>
  <text x="40" y="${h * 0.5 + 52}" font-size="14" fill="${p.muted}">{{date}} · {{location}}</text>
  <rect x="40" y="${h - 100}" width="${w - 80}" height="56" rx="8" fill="${v % 2 ? p.accent : p.primary}" opacity="0.15"/>`
}

function layoutPoster(w: number, h: number, title: string, style: TemplateVisualStyle) {
  const p = PALETTES[style]
  return `
  <rect width="${w}" height="${h}" fill="${p.bg}"/>
  <rect x="0" y="0" width="${w}" height="${h * 0.55}" fill="${p.primary}"/>
  <text x="${w / 2}" y="${h * 0.2}" text-anchor="middle" font-size="42" fill="#fff" font-weight="800">${escapeXml(title)}</text>
  <text x="${w / 2}" y="${h * 0.32}" text-anchor="middle" font-size="20" fill="#ffffffdd">{{eventName}}</text>
  ${variableBlock(w, h * 0.62, p, [
    { key: '{{date}}', size: 24, weight: '600' },
    { key: '{{location}}', size: 18 },
    { key: '{{organization}}', size: 16 },
  ])}`
}

function layoutSocial(w: number, h: number, title: string, style: TemplateVisualStyle, v: number) {
  const p = PALETTES[style]
  return `
  <rect width="${w}" height="${h}" fill="${p.bg}"/>
  <rect x="0" y="0" width="${w}" height="${h}" fill="url(#grad)" opacity="0"/>
  <defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${p.primary}"/><stop offset="100%" stop-color="${p.accent}"/></linearGradient></defs>
  <rect x="0" y="0" width="${w}" height="${h}" fill="${p.primary}" opacity="${v % 2 ? 0.92 : 0.85}"/>
  <text x="${w / 2}" y="${h * 0.38}" text-anchor="middle" font-size="48" fill="#fff" font-weight="800">${escapeXml(title.slice(0, 18))}</text>
  ${variableBlock(w, h * 0.5, p, [
    { key: '{{eventName}}', size: 28, weight: '600' },
    { key: '{{date}}', size: 20 },
  ])}
  <text x="${w / 2}" y="${h * 0.88}" text-anchor="middle" font-size="16" fill="#ffffffaa">@gildia</text>`
}

function layoutEmailBanner(w: number, h: number, title: string, style: TemplateVisualStyle) {
  const p = PALETTES[style]
  return `
  <rect width="${w}" height="${h}" fill="${p.bg}"/>
  <rect x="0" y="0" width="${w * 0.35}" height="${h}" fill="${p.primary}"/>
  <text x="${w * 0.175}" y="${h / 2 + 8}" text-anchor="middle" font-size="28" fill="#fff" font-weight="700">${escapeXml(title)}</text>
  <text x="${w * 0.42}" y="${h * 0.45}" font-size="22" fill="${p.text}" font-weight="600">{{eventName}}</text>
  <text x="${w * 0.42}" y="${h * 0.62}" font-size="16" fill="${p.muted}">{{date}} · {{location}}</text>
  <rect x="${w * 0.82}" y="${h * 0.3}" width="${w * 0.14}" height="${h * 0.4}" rx="8" fill="${p.accent}" opacity="0.2"/>`
}

function layoutTableTent(w: number, h: number, title: string, style: TemplateVisualStyle) {
  const p = PALETTES[style]
  return `
  <rect width="${w}" height="${h}" fill="${p.bg}"/>
  <line x1="0" y1="${h / 2}" x2="${w}" y2="${h / 2}" stroke="${p.accent}" stroke-width="2" stroke-dasharray="8 6"/>
  <text x="${w / 2}" y="${h * 0.35}" text-anchor="middle" font-size="36" fill="${p.primary}" font-weight="700">{{participantName}}</text>
  <text x="${w / 2}" y="${h * 0.48}" text-anchor="middle" font-size="18" fill="${p.muted}">{{organization}}</text>
  <text x="${w / 2}" y="${h * 0.72}" text-anchor="middle" font-size="24" fill="${p.primary}" font-weight="600" transform="rotate(180 ${w / 2} ${h * 0.72})">{{participantName}}</text>
  <text x="${w / 2}" y="${h * 0.15}" text-anchor="middle" font-size="12" fill="${p.muted}">${escapeXml(title)}</text>`
}

function layoutRollUp(w: number, h: number, title: string, style: TemplateVisualStyle) {
  const p = PALETTES[style]
  return `
  <rect width="${w}" height="${h}" fill="${p.bg}"/>
  <rect x="40" y="40" width="${w - 80}" height="${h - 80}" fill="${p.surface}" stroke="${p.primary}" stroke-width="4"/>
  <rect x="40" y="40" width="${w - 80}" height="280" fill="${p.primary}"/>
  <text x="${w / 2}" y="200" text-anchor="middle" font-size="56" fill="#fff" font-weight="800">${escapeXml(title)}</text>
  ${variableBlock(w, 520, p, [
    { key: '{{eventName}}', size: 36, weight: '700' },
    { key: '{{date}}', size: 24 },
    { key: '{{location}}', size: 20 },
    { key: '{{organization}}', size: 18 },
  ])}
  <rect x="${w * 0.2}" y="${h - 320}" width="${w * 0.6}" height="120" fill="${p.accent}" opacity="0.25" rx="8"/>`
}

function layoutGeneric(w: number, h: number, title: string, category: string, style: TemplateVisualStyle) {
  const p = PALETTES[style]
  return `
  <rect width="${w}" height="${h}" fill="${p.bg}"/>
  <rect x="32" y="32" width="${w - 64}" height="${h - 64}" fill="${p.surface}" stroke="${p.primary}" stroke-width="3" rx="10"/>
  ${headerBand(w, h, p, title)}
  ${variableBlock(w, h * 0.32, p, [
    { key: '{{eventName}}', size: 24, weight: '600' },
    { key: '{{participantName}}', size: 20 },
    { key: '{{organization}}', size: 16 },
    { key: '{{date}} · {{location}}', size: 14 },
  ])}
  <text x="${w / 2}" y="${h * 0.9}" text-anchor="middle" font-size="11" fill="${p.muted}">${escapeXml(category)}</text>`
}

function innerSvg(category: string, w: number, h: number, title: string, style: TemplateVisualStyle, v: number) {
  switch (category) {
    case 'CERTIFICATE':
    case 'PROGRAM_BOOK':
    case 'SCIENTIFIC_POSTER':
      return layoutCertificate(w, h, title, style, v)
    case 'BADGE':
    case 'NAME_TAG':
      return layoutBadge(w, h, title, style, v)
    case 'INVITATION':
      return layoutInvitation(w, h, title, style, v)
    case 'FLYER':
      return layoutFlyer(w, h, title, style, v)
    case 'POSTER':
    case 'STAGE_BACKDROP':
    case 'LED_SCREEN':
      return layoutPoster(w, h, title, style)
    case 'SOCIAL_MEDIA':
    case 'SOUVENIR':
      return layoutSocial(w, h, title, style, v)
    case 'EMAIL_BANNER':
    case 'SPONSOR_BANNER':
      return layoutEmailBanner(w, h, title, style)
    case 'TABLE_TENT':
      return layoutTableTent(w, h, title, style)
    case 'ROLL_UP':
    case 'PRESS_WALL':
      return layoutRollUp(w, h, title, style)
    default:
      return layoutGeneric(w, h, title, category, style)
  }
}

/** Generate a category-specific editable SVG with Gildia variable placeholders. */
export function generateTemplateSvg(input: TemplateSvgInput): string {
  const category = input.category
  const size = CATEGORY_SIZE[category] ?? { w: 800, h: 600 }
  const style = inferTemplateStyle(input.tags ?? [], input.isPremium)
  const v = variantIndex(input.id)
  const title = input.name

  const body = innerSvg(category, size.w, size.h, title, style, v)

  if (!body.includes('{{eventName}}')) {
    throw new Error(`Generated SVG missing {{eventName}} for ${input.id}`)
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size.w}" height="${size.h}" viewBox="0 0 ${size.w} ${size.h}">${body}</svg>`
}

/** @deprecated Use generateTemplateSvg */
export function buildBrandedTemplateSvg(options: {
  title: string
  category: string
  primary?: string
  accent?: string
}): string {
  return generateTemplateSvg({
    id: 'legacy',
    name: options.title,
    category: options.category,
    tags: options.category === 'CERTIFICATE' ? ['klassik'] : ['zamonaviy'],
  })
}
