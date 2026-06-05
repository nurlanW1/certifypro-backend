import type { MaterialCategory } from '@/types/event'
import type { StarterTemplate, StarterTemplateStyle, TemplateElement, TemplateSize } from './templateTypes'

const SIZES = {
  A4_LANDSCAPE: { label: 'A4 landscape', width: 1123, height: 794, unit: 'px' },
  A4_PORTRAIT: { label: 'A4 portrait', width: 794, height: 1123, unit: 'px' },
  A5_DIGITAL: { label: 'A5 / 1080x1350', width: 1080, height: 1350, unit: 'px' },
  BADGE: { label: '90mm x 130mm', width: 540, height: 780, unit: 'px' },
  SOCIAL_SQUARE: { label: '1080x1080', width: 1080, height: 1080, unit: 'px' },
  WIDE_HD: { label: '1920x1080', width: 1920, height: 1080, unit: 'px' },
  ROLLUP: { label: '850mm x 2000mm', width: 850, height: 2000, unit: 'px' },
  PRESS_WALL: { label: '3000mm x 2000mm', width: 1500, height: 1000, unit: 'px' },
  QR_CARD: { label: 'A6 QR card', width: 520, height: 740, unit: 'px' },
  TICKET: { label: '180mm x 70mm', width: 900, height: 350, unit: 'px' },
  TABLE_CARD: { label: '210mm x 99mm', width: 1000, height: 470, unit: 'px' },
  ID_CARD: { label: '86mm x 54mm', width: 860, height: 540, unit: 'px' },
} satisfies Record<string, TemplateSize>

const STYLE_META: Record<StarterTemplateStyle, { tag: string; bg: string; ink: string; accent: string; muted: string; premiumEvery?: boolean }> = {
  MINIMALISTIC: {
    tag: 'minimalistic',
    bg: '#ffffff',
    ink: '#0f172a',
    accent: '#2563eb',
    muted: '#64748b',
  },
  CLASSIC: {
    tag: 'classic',
    bg: '#fffaf0',
    ink: '#111827',
    accent: '#b88a2a',
    muted: '#6b5f4a',
  },
  HITECH_SCIENCE: {
    tag: 'hi-tech science',
    bg: '#07111f',
    ink: '#e6f7ff',
    accent: '#22d3ee',
    muted: '#8fb6c9',
  },
}

const CATEGORY_BY_ASSET: Record<string, MaterialCategory> = {
  Certificate: 'CERTIFICATE',
  Invitation: 'INVITATION',
  'Badge / Bejik': 'BADGE',
  Flyer: 'FLYER',
  Agenda: 'PROGRAM_BOOK',
  'Event Program': 'PROGRAM_BOOK',
  'Speaker Card': 'SOCIAL_MEDIA',
  'Sponsor Banner': 'SPONSOR_BANNER',
  'Roll-up Banner': 'ROLL_UP',
  'Press Wall': 'PRESS_WALL',
  'Social Media Post': 'SOCIAL_MEDIA',
  'QR Registration Card': 'NAVIGATION',
  Ticket: 'NAVIGATION',
  'Table Card': 'TABLE_TENT',
  'ID Card': 'NAME_TAG',
  'Thank You Certificate': 'CERTIFICATE',
}

const SIZE_BY_ASSET: Record<string, TemplateSize> = {
  Certificate: SIZES.A4_LANDSCAPE,
  Invitation: SIZES.A5_DIGITAL,
  'Badge / Bejik': SIZES.BADGE,
  Flyer: SIZES.A4_PORTRAIT,
  Agenda: SIZES.A4_PORTRAIT,
  'Event Program': SIZES.A4_PORTRAIT,
  'Speaker Card': SIZES.A5_DIGITAL,
  'Sponsor Banner': SIZES.WIDE_HD,
  'Roll-up Banner': SIZES.ROLLUP,
  'Press Wall': SIZES.PRESS_WALL,
  'Social Media Post': SIZES.SOCIAL_SQUARE,
  'QR Registration Card': SIZES.QR_CARD,
  Ticket: SIZES.TICKET,
  'Table Card': SIZES.TABLE_CARD,
  'ID Card': SIZES.ID_CARD,
  'Thank You Certificate': SIZES.A4_LANDSCAPE,
}

function slug(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function baseElements(assetType: string, style: StarterTemplateStyle, size: TemplateSize): TemplateElement[] {
  const p = STYLE_META[style]
  const w = size.width
  const h = size.height
  const dark = style === 'HITECH_SCIENCE'
  const classic = style === 'CLASSIC'
  const margin = Math.max(28, Math.round(Math.min(w, h) * 0.055))
  const title = assetType === 'Certificate' ? 'Certificate of Participation' : assetType
  const eventName = assetType === 'Speaker Card' ? 'Speaker Session' : 'Tashkent International Science Forum 2026'

  const elements: TemplateElement[] = [
    { type: 'rectangle', id: 'background', x: 0, y: 0, width: w, height: h, fill: p.bg },
    {
      type: 'rectangle',
      id: 'safe-margin',
      x: margin,
      y: margin,
      width: w - margin * 2,
      height: h - margin * 2,
      fill: 'transparent',
      stroke: dark ? '#1d4ed8' : '#cbd5e1',
      strokeWidth: 2,
      opacity: 0.55,
      dashed: true,
      label: 'safe margin',
    },
    { type: 'decorativeShape', id: 'accent-band', x: 0, y: 0, width: w, height: Math.round(h * 0.14), fill: classic ? '#10172a' : p.accent, opacity: dark ? 0.16 : 1 },
    { type: 'line', id: 'accent-line', x1: margin, y1: Math.round(h * 0.2), x2: w - margin, y2: Math.round(h * 0.2), stroke: p.accent, strokeWidth: 4 },
    { type: 'logoPlaceholder', id: 'logo', x: margin, y: margin, width: Math.min(150, w * 0.16), height: Math.min(70, h * 0.09), fill: dark ? '#0f2034' : '#f8fafc', stroke: p.accent, label: 'LOGO' },
    { type: 'text', id: 'title', x: w / 2, y: Math.round(h * 0.31), text: title, fontSize: Math.max(26, Math.round(w * 0.04)), fill: p.ink, fontFamily: classic ? 'Georgia, serif' : 'Arial, sans-serif', fontWeight: '700', align: 'middle' },
    { type: 'text', id: 'event-name', x: w / 2, y: Math.round(h * 0.39), text: '{{event_name}}', fontSize: Math.max(20, Math.round(w * 0.028)), fill: p.ink, fontWeight: '600', align: 'middle' },
    { type: 'text', id: 'legacy-event-name', x: -9999, y: -9999, text: '{{eventName}}', fontSize: 1, fill: p.bg, align: 'start' },
    { type: 'text', id: 'legacy-participant-name', x: -9999, y: -9994, text: '{{participantName}}', fontSize: 1, fill: p.bg, align: 'start' },
    { type: 'text', id: 'subtitle', x: w / 2, y: Math.round(h * 0.46), text: eventName, fontSize: Math.max(15, Math.round(w * 0.019)), fill: p.muted, align: 'middle' },
    { type: 'text', id: 'date-location', x: w / 2, y: Math.round(h * 0.55), text: '{{date}} · {{location}}', fontSize: Math.max(14, Math.round(w * 0.017)), fill: p.muted, align: 'middle' },
    { type: 'text', id: 'organization', x: w / 2, y: Math.round(h * 0.61), text: '{{organization}}', fontSize: Math.max(14, Math.round(w * 0.017)), fill: p.muted, align: 'middle' },
  ]

  if (['Certificate', 'Thank You Certificate'].includes(assetType)) {
    elements.push(
      { type: 'text', id: 'name', x: w / 2, y: Math.round(h * 0.51), text: '{{full_name}}', fontSize: Math.max(28, Math.round(w * 0.045)), fill: p.ink, fontFamily: classic ? 'Georgia, serif' : 'Arial, sans-serif', fontWeight: '700', align: 'middle' },
      { type: 'signaturePlaceholder', id: 'signature', x: margin, y: h - margin - 90, width: Math.round(w * 0.23), height: 54, stroke: p.accent, label: 'SIGNATURE' },
      { type: 'stampPlaceholder', id: 'stamp', x: w - margin - 90, y: h - margin - 105, width: 90, height: 90, stroke: p.accent, label: 'STAMP' },
      { type: 'text', id: 'certificate-id', x: w / 2, y: h - margin - 28, text: '{{certificate_id}}', fontSize: 14, fill: p.muted, align: 'middle' }
    )
  }

  if (['Invitation', 'QR Registration Card', 'Ticket'].includes(assetType)) {
    elements.push({ type: 'qrPlaceholder', id: 'qr', x: w - margin - Math.min(160, w * 0.2), y: h - margin - Math.min(160, w * 0.2), width: Math.min(160, w * 0.2), height: Math.min(160, w * 0.2), fill: dark ? '#0f2034' : '#ffffff', stroke: p.accent, label: '{{qr_code}}' })
  }

  if (assetType === 'Speaker Card') {
    elements.push(
      { type: 'imagePlaceholder', id: 'speaker-photo', x: margin, y: Math.round(h * 0.18), width: Math.round(w * 0.36), height: Math.round(h * 0.5), fill: dark ? '#0f2034' : '#eef2ff', stroke: p.accent, label: 'SPEAKER PHOTO' },
      { type: 'text', id: 'speaker-name', x: Math.round(w * 0.62), y: Math.round(h * 0.48), text: '{{speaker_name}}', fontSize: Math.max(30, Math.round(w * 0.038)), fill: p.ink, fontWeight: '700', align: 'middle' },
      { type: 'text', id: 'speaker-position', x: Math.round(w * 0.62), y: Math.round(h * 0.55), text: '{{position}}', fontSize: 24, fill: p.muted, align: 'middle' }
    )
  }

  if (assetType === 'Sponsor Banner' || assetType === 'Press Wall') {
    elements.push(
      { type: 'text', id: 'sponsor-title', x: w / 2, y: Math.round(h * 0.72), text: '{{sponsor_name}}', fontSize: Math.max(30, Math.round(w * 0.03)), fill: p.ink, fontWeight: '700', align: 'middle' },
      { type: 'imagePlaceholder', id: 'sponsor-logo', x: Math.round(w * 0.38), y: Math.round(h * 0.77), width: Math.round(w * 0.24), height: Math.round(h * 0.12), fill: dark ? '#0f2034' : '#f8fafc', stroke: p.accent, label: 'SPONSOR LOGO' }
    )
  }

  if (assetType === 'Badge / Bejik' || assetType === 'ID Card') {
    elements.push(
      { type: 'text', id: 'full-name', x: w / 2, y: Math.round(h * 0.52), text: '{{full_name}}', fontSize: Math.max(24, Math.round(w * 0.05)), fill: p.ink, fontWeight: '700', align: 'middle' },
      { type: 'text', id: 'role', x: w / 2, y: Math.round(h * 0.6), text: '{{role}}', fontSize: Math.max(16, Math.round(w * 0.026)), fill: p.muted, align: 'middle' },
      { type: 'qrPlaceholder', id: 'badge-qr', x: w - margin - 90, y: h - margin - 90, width: 90, height: 90, stroke: p.accent, label: 'QR' }
    )
  }

  return elements
}

function createTemplate(style: StarterTemplateStyle, assetType: string, index: number): StarterTemplate {
  const size = SIZE_BY_ASSET[assetType]
  const category = CATEGORY_BY_ASSET[assetType]
  const styleMeta = STYLE_META[style]
  const id = `${styleMeta.tag.split(' ')[0]}-${slug(assetType)}-${String(index).padStart(3, '0')}`
  const isPremium = style === 'HITECH_SCIENCE' && index % 2 === 0
  return {
    id,
    title: `${assetType} · ${styleMeta.tag}`,
    style,
    category,
    assetType,
    size,
    orientation: size.width === size.height ? 'square' : size.width > size.height ? 'landscape' : 'portrait',
    isPremium,
    isPrintable: !['Social Media Post', 'Speaker Card'].includes(assetType),
    isOnlineReady: true,
    thumbnail: `/api/templates/${id}/preview`,
    tags: [styleMeta.tag, styleMeta.tag.replace(' ', '-'), assetType.toLowerCase(), category.toLowerCase(), isPremium ? 'premium' : 'free', 'starter', 'printable', 'online'],
    description: `${assetType} uchun ${styleMeta.tag} uslubidagi real starter shablon.`,
    popularity: 100 - index * 2,
    elements: baseElements(assetType, style, size),
  }
}

const ASSETS = [
  'Certificate',
  'Invitation',
  'Badge / Bejik',
  'Flyer',
  'Agenda',
  'Event Program',
  'Speaker Card',
  'Sponsor Banner',
  'Roll-up Banner',
  'Press Wall',
  'Social Media Post',
  'QR Registration Card',
  'Ticket',
  'Table Card',
  'ID Card',
  'Thank You Certificate',
]

export const STARTER_TEMPLATES: StarterTemplate[] = (['MINIMALISTIC', 'CLASSIC', 'HITECH_SCIENCE'] as const).flatMap(
  (style) => ASSETS.map((asset, index) => createTemplate(style, asset, index + 1))
)

export function findStarterTemplate(id: string): StarterTemplate | undefined {
  return STARTER_TEMPLATES.find((template) => template.id === id)
}
