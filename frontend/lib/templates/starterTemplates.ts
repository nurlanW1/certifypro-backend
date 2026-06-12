import type { MaterialCategory } from '@/types/event'
import type { StarterTemplate, TemplateCategory, TemplateElement, TemplateSize, TemplateStyle } from './types'

const sample = {
  event: 'Tashkent International Science Forum 2026',
  org: 'Gildia Event Operations',
  datePlace: '{{date}} / {{location}}',
}

const SIZES: Record<string, TemplateSize> = {
  a4Landscape: { width: 1123, height: 794, unit: 'px', label: 'A4 landscape print' },
  a4Portrait: { width: 794, height: 1123, unit: 'px', label: 'A4 portrait print' },
  badge: { width: 540, height: 780, unit: 'px', label: '90mm x 130mm badge' },
  social: { width: 1080, height: 1080, unit: 'px', label: '1080 x 1080 social' },
  qr: { width: 520, height: 740, unit: 'px', label: 'A6 registration QR' },
  sponsor: { width: 1920, height: 1080, unit: 'px', label: '1920 x 1080 sponsor banner' },
  rollup: { width: 850, height: 2000, unit: 'px', label: '850mm x 2000mm roll-up' },
  press: { width: 1500, height: 1000, unit: 'px', label: '3000mm x 2000mm press wall' },
}

const MATERIAL_BY_CATEGORY: Record<TemplateCategory, MaterialCategory> = {
  certificate: 'CERTIFICATE',
  invitation: 'INVITATION',
  badge: 'BADGE',
  flyer: 'FLYER',
  agenda: 'PROGRAM_BOOK',
  'event-program': 'PROGRAM_BOOK',
  'speaker-card': 'SOCIAL_MEDIA',
  'sponsor-banner': 'SPONSOR_BANNER',
  'rollup-banner': 'ROLL_UP',
  'press-wall': 'PRESS_WALL',
  'social-post': 'SOCIAL_MEDIA',
  'qr-card': 'NAVIGATION',
  ticket: 'NAVIGATION',
  'table-card': 'TABLE_TENT',
  'id-card': 'NAME_TAG',
  'thank-you-certificate': 'CERTIFICATE',
}

const STYLE = {
  minimalistic: {
    bg: '#ffffff',
    ink: '#0f172a',
    accent: '#2563eb',
    muted: '#64748b',
    soft: '#dbeafe',
    titleFont: 'Arial, sans-serif',
  },
  classic: {
    bg: '#fffaf0',
    ink: '#10172a',
    accent: '#b88a2a',
    muted: '#6b5f4a',
    soft: '#f7e7bd',
    titleFont: 'Georgia, serif',
  },
  'hitech-science': {
    bg: '#07111f',
    ink: '#e6f7ff',
    accent: '#22d3ee',
    muted: '#8fb6c9',
    soft: '#0e2a47',
    titleFont: 'Arial, sans-serif',
  },
} satisfies Record<TemplateStyle, Record<string, string>>

function box(
  type: Extract<TemplateElement, { width: number }>['type'],
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  options: Partial<Extract<TemplateElement, { width: number }>> = {}
): TemplateElement {
  return { type, id, x, y, width, height, ...options } as TemplateElement
}

function text(
  id: string,
  x: number,
  y: number,
  value: string,
  fontSize: number,
  fill: string,
  options: Partial<Extract<TemplateElement, { type: 'text' }>> = {}
): TemplateElement {
  return { type: 'text', id, x, y, text: value, fontSize, fill, ...options }
}

function line(id: string, x1: number, y1: number, x2: number, y2: number, stroke: string, strokeWidth = 2): TemplateElement {
  return { type: 'line', id, x1, y1, x2, y2, stroke, strokeWidth }
}

function base(style: TemplateStyle, size: TemplateSize, printable = true): TemplateElement[] {
  const s = STYLE[style]
  const m = Math.round(Math.min(size.width, size.height) * 0.055)
  const elements: TemplateElement[] = [
    box('rect', 'background', 0, 0, size.width, size.height, { fill: s.bg, radius: 0 }),
    box('rect', 'safe-margin', m, m, size.width - m * 2, size.height - m * 2, {
      fill: 'transparent',
      stroke: style === 'hitech-science' ? '#1d4ed8' : '#cbd5e1',
      strokeWidth: 2,
      dashed: true,
      opacity: printable ? 0.55 : 0.22,
      label: 'safe margin',
    }),
    box('logoPlaceholder', 'logo', m, m, Math.min(156, size.width * 0.16), Math.min(74, size.height * 0.09), {
      fill: style === 'hitech-science' ? '#0f2034' : '#f8fafc',
      stroke: s.accent,
      label: 'LOGO',
    }),
  ]

  if (style === 'minimalistic') {
    elements.push(
      box('decorativeShape', 'blue-corner', size.width - 220, 0, 220, 120, { fill: s.soft, opacity: 0.9, radius: 0 }),
      line('thin-accent', m, Math.round(size.height * 0.2), size.width - m, Math.round(size.height * 0.2), s.accent, 3)
    )
  }

  if (style === 'classic') {
    elements.push(
      box('rect', 'outer-border', 18, 18, size.width - 36, size.height - 36, { fill: 'transparent', stroke: s.accent, strokeWidth: 3, radius: 0 }),
      box('rect', 'inner-border', 36, 36, size.width - 72, size.height - 72, { fill: 'transparent', stroke: s.accent, strokeWidth: 1, opacity: 0.65, radius: 0 }),
      box('decorativeShape', 'navy-header', 0, 0, size.width, Math.round(size.height * 0.13), { fill: '#10172a', radius: 0 })
    )
  }

  if (style === 'hitech-science') {
    elements.push(
      box('decorativeShape', 'cyan-grid-top', 0, 0, size.width, Math.round(size.height * 0.16), { fill: '#0e2a47', opacity: 0.9, radius: 0 }),
      { type: 'circle', id: 'glow-orbit', x: size.width * 0.86, y: size.height * 0.16, radius: Math.min(size.width, size.height) * 0.14, fill: '#22d3ee', opacity: 0.16 },
      line('tech-line-1', m, Math.round(size.height * 0.22), size.width - m, Math.round(size.height * 0.18), s.accent, 3),
      line('tech-line-2', Math.round(size.width * 0.62), m, size.width - m, Math.round(size.height * 0.32), s.accent, 2)
    )
  }

  return elements
}

function commonTitle(style: TemplateStyle, size: TemplateSize, title: string, subtitle = sample.event): TemplateElement[] {
  const s = STYLE[style]
  return [
    text('title', size.width / 2, Math.round(size.height * 0.31), title, Math.max(28, Math.round(size.width * 0.042)), s.ink, {
      align: 'middle',
      fontWeight: '700',
      fontFamily: s.titleFont,
    }),
    text('event-name', size.width / 2, Math.round(size.height * 0.4), '{{event_name}}', Math.max(20, Math.round(size.width * 0.026)), s.ink, {
      align: 'middle',
      fontWeight: '600',
    }),
    text('sample-event', size.width / 2, Math.round(size.height * 0.47), subtitle, Math.max(15, Math.round(size.width * 0.017)), s.muted, { align: 'middle' }),
    text('organization', size.width / 2, Math.round(size.height * 0.55), '{{organization}}', Math.max(15, Math.round(size.width * 0.017)), s.muted, { align: 'middle' }),
    text('date-location', size.width / 2, Math.round(size.height * 0.61), sample.datePlace, Math.max(14, Math.round(size.width * 0.016)), s.muted, { align: 'middle' }),
  ]
}

function certificateExtras(style: TemplateStyle, size: TemplateSize): TemplateElement[] {
  const s = STYLE[style]
  const m = Math.round(Math.min(size.width, size.height) * 0.055)
  return [
    text('participant-name', size.width / 2, Math.round(size.height * 0.5), '{{full_name}}', Math.max(34, Math.round(size.width * 0.045)), s.ink, {
      align: 'middle',
      fontWeight: '700',
      fontFamily: style === 'classic' ? 'Georgia, serif' : 'Arial, sans-serif',
    }),
    box('signaturePlaceholder', 'signature', m, size.height - m - 92, Math.round(size.width * 0.24), 58, { stroke: s.accent, fill: 'transparent', label: 'SIGNATURE' }),
    box('stampPlaceholder', 'stamp', size.width - m - 96, size.height - m - 110, 96, 96, { stroke: s.accent, fill: 'transparent', label: 'STAMP' }),
    text('certificate-id', size.width / 2, size.height - m - 24, '{{certificate_id}}', 14, s.muted, { align: 'middle' }),
  ]
}

function makeTemplate(params: {
  id: string
  title: string
  description: string
  style: TemplateStyle
  category: TemplateCategory
  size: TemplateSize
  isPremium?: boolean
  printable?: boolean
  thumbnail?: string
  backgroundAsset?: string
  tags: string[]
  elements: TemplateElement[]
  popularity: number
}): StarterTemplate {
  return {
    id: params.id,
    title: params.title,
    description: params.description,
    style: params.style,
    category: params.category,
    materialCategory: MATERIAL_BY_CATEGORY[params.category],
    assetType: params.category,
    size: params.size,
    isPremium: params.isPremium ?? false,
    isPrintable: params.printable ?? true,
    isOnlineReady: true,
    tags: [params.style, params.category, ...params.tags],
    thumbnail: params.thumbnail ?? `/api/templates/${params.id}/preview`,
    backgroundAsset: params.backgroundAsset,
    popularity: params.popularity,
    elements: params.elements,
  }
}

export const STARTER_TEMPLATES: StarterTemplate[] = [
  makeTemplate({
    id: 'minimalistic-certificate-001',
    title: 'Minimalistic Certificate',
    description: 'Clean certificate with blue accents, signature, stamp, and safe print margin.',
    style: 'minimalistic',
    category: 'certificate',
    size: SIZES.a4Landscape,
    tags: ['Certificate of Participation', 'print', 'official'],
    popularity: 100,
    elements: [...base('minimalistic', SIZES.a4Landscape), ...commonTitle('minimalistic', SIZES.a4Landscape, 'Certificate of Participation'), ...certificateExtras('minimalistic', SIZES.a4Landscape)],
  }),
  makeTemplate({
    id: 'minimalistic-invitation-002',
    title: 'Minimalistic Invitation',
    description: 'Whitespace-led invitation with registration QR and event details.',
    style: 'minimalistic',
    category: 'invitation',
    size: SIZES.a4Portrait,
    tags: ['Official Invitation', 'qr', 'online'],
    popularity: 98,
    elements: [...base('minimalistic', SIZES.a4Portrait), ...commonTitle('minimalistic', SIZES.a4Portrait, 'Official Invitation'), box('qrPlaceholder', 'registration-qr', 585, 875, 130, 130, { stroke: STYLE.minimalistic.accent, fill: '#ffffff', label: 'Registration QR' })],
  }),
  makeTemplate({
    id: 'minimalistic-badge-003',
    title: 'Minimalistic Badge',
    description: 'Simple participant badge with role, QR, logo, and movable text layers.',
    style: 'minimalistic',
    category: 'badge',
    size: SIZES.badge,
    tags: ['badge', 'bejik', 'participant'],
    popularity: 96,
    elements: [...base('minimalistic', SIZES.badge), ...commonTitle('minimalistic', SIZES.badge, 'Participant Badge'), text('full-name', 270, 430, '{{full_name}}', 34, STYLE.minimalistic.ink, { align: 'middle', fontWeight: '700' }), text('role', 270, 485, '{{role}}', 20, STYLE.minimalistic.muted, { align: 'middle' }), box('qrPlaceholder', 'badge-qr', 370, 620, 98, 98, { stroke: STYLE.minimalistic.accent, label: 'QR' })],
  }),
  makeTemplate({
    id: 'minimalistic-flyer-004',
    title: 'Minimalistic Flyer',
    description: 'Modern event flyer for forum announcements and online sharing.',
    style: 'minimalistic',
    category: 'flyer',
    size: SIZES.a4Portrait,
    tags: ['flyer', 'announcement'],
    popularity: 94,
    elements: [...base('minimalistic', SIZES.a4Portrait), ...commonTitle('minimalistic', SIZES.a4Portrait, 'Science Forum 2026'), text('cta', 397, 820, 'Register today at gildia.uz', 28, STYLE.minimalistic.accent, { align: 'middle', fontWeight: '700' })],
  }),
  makeTemplate({
    id: 'classic-certificate-005',
    title: 'Classic Certificate',
    description: 'Official navy and gold certificate with elegant borders.',
    style: 'classic',
    category: 'certificate',
    size: SIZES.a4Landscape,
    tags: ['Certificate of Participation', 'classic', 'print'],
    popularity: 92,
    elements: [...base('classic', SIZES.a4Landscape), ...commonTitle('classic', SIZES.a4Landscape, 'Certificate of Participation'), ...certificateExtras('classic', SIZES.a4Landscape)],
  }),
  makeTemplate({
    id: 'classic-gold-certificate-v1',
    title: 'Classic Gold Appreciation Certificate',
    description: 'Elegant blue and gold landscape certificate with fully editable title, recipient, description, date, and signature text.',
    style: 'classic',
    category: 'certificate',
    size: { width: 1127, height: 814, unit: 'px', label: 'Classic landscape print' },
    thumbnail: '/templates/certificate/classic-gold-v1/preview.webp',
    backgroundAsset: '/templates/certificate/classic-gold-v1/background.svg',
    tags: ['certificate', 'appreciation', 'gold', 'blue', 'print', 'editable'],
    popularity: 99,
    elements: [
      text('certificate-title', 563.5, 166, 'SERTIFIKAT', 68, '#D89A2B', {
        align: 'middle',
        fontWeight: '700',
        fontFamily: 'Arial, sans-serif',
      }),
      text('certificate-subtitle', 563.5, 218, 'TAQDIRLASH SERTIFIKATI', 30, '#384B52', {
        align: 'middle',
        fontWeight: '700',
        fontFamily: 'Arial, sans-serif',
      }),
      text('presentation-line', 563.5, 270, '{{eventName}} tadbiridagi faol ishtiroki uchun', 20, '#384B52', {
        align: 'middle',
        fontWeight: '700',
        fontFamily: 'Arial, sans-serif',
      }),
      text('presentation-line-2', 563.5, 298, 'ushbu sertifikat bilan taqdirlanadi', 20, '#384B52', {
        align: 'middle',
        fontWeight: '700',
        fontFamily: 'Arial, sans-serif',
      }),
      text('participant-name', 563.5, 392, '{{participantName}}', 70, '#041D3B', {
        align: 'middle',
        fontWeight: '400',
        fontFamily: '"Brush Script MT", "Segoe Script", cursive',
      }),
      text('description-line-1', 563.5, 452, 'Tadbir rivojiga qo‘shgan hissasi, faolligi va yuksak natijalari uchun', 17, '#777777', {
        align: 'middle',
        fontFamily: 'Georgia, serif',
      }),
      text('description-line-2', 563.5, 476, 'tashkilotchilar tomonidan chuqur minnatdorlik bildiriladi.', 17, '#777777', {
        align: 'middle',
        fontFamily: 'Georgia, serif',
      }),
      text('organization', 563.5, 501, '{{organization}}', 16, '#777777', {
        align: 'middle',
        fontWeight: '600',
        fontFamily: 'Arial, sans-serif',
      }),
      text('date-value', 439, 538, '{{date}}', 18, '#041D3B', {
        align: 'middle',
        fontWeight: '600',
        fontFamily: 'Arial, sans-serif',
      }),
      text('date-label', 439, 574, 'SANA', 16, '#041D3B', {
        align: 'middle',
        fontWeight: '700',
        fontFamily: 'Arial, sans-serif',
      }),
      text('signature-value', 687, 538, 'Imzo', 18, '#041D3B', {
        align: 'middle',
        fontFamily: '"Brush Script MT", "Segoe Script", cursive',
      }),
      text('signature-label', 687, 574, 'IMZO', 16, '#041D3B', {
        align: 'middle',
        fontWeight: '700',
        fontFamily: 'Arial, sans-serif',
      }),
    ],
  }),
  makeTemplate({
    id: 'modern-blue-certificate-v2',
    title: 'Modern Blue Certificate',
    description: 'Modern blue and gold participation certificate with editable recipient, description, signature, role, and date.',
    style: 'minimalistic',
    category: 'certificate',
    size: { width: 841.89, height: 595.28, unit: 'px', label: 'A4 landscape print' },
    thumbnail: '/templates/certificate/modern-blue-v2/preview.webp',
    backgroundAsset: '/templates/certificate/modern-blue-v2/background.svg',
    tags: ['certificate', 'modern', 'blue', 'gold', 'participation', 'editable'],
    popularity: 98,
    elements: [
      text('certificate-title', 420.95, 157, 'CERTIFICATE', 34, '#C98B19', {
        align: 'middle',
        fontWeight: '500',
        fontFamily: 'Montserrat, Arial, sans-serif',
      }),
      text('certificate-subtitle', 420.95, 184, 'OF PARTICIPATION', 12, '#161616', {
        align: 'middle',
        fontWeight: '600',
        fontFamily: 'Montserrat, Arial, sans-serif',
      }),
      text('award-line', 420.95, 220, 'This certificate is awarded to', 13, '#161616', {
        align: 'middle',
        fontWeight: '500',
        fontFamily: 'Montserrat, Arial, sans-serif',
      }),
      text('participant-name', 420.95, 275, '{{participantName}}', 29, '#161616', {
        align: 'middle',
        fontWeight: '700',
        fontFamily: 'Montserrat, Arial, sans-serif',
      }),
      text('description-line-1', 420.95, 303, 'Tadbirdagi faol ishtiroki, tashabbuskorligi va erishgan natijalari uchun', 9, '#161616', {
        align: 'middle',
        fontFamily: 'Montserrat, Arial, sans-serif',
      }),
      text('description-line-2', 420.95, 316, 'ushbu sertifikat bilan taqdirlanadi. Kelgusi faoliyatida ulkan', 9, '#161616', {
        align: 'middle',
        fontFamily: 'Montserrat, Arial, sans-serif',
      }),
      text('description-line-3', 420.95, 329, 'muvaffaqiyatlar va yangi yutuqlar tilaymiz.', 9, '#161616', {
        align: 'middle',
        fontFamily: 'Montserrat, Arial, sans-serif',
      }),
      text('signatory-name', 225, 449, '{{signatoryName}}', 13, '#161616', {
        align: 'middle',
        fontWeight: '700',
        fontFamily: 'Montserrat, Arial, sans-serif',
      }),
      text('signatory-role', 225, 477, '{{signatoryRole}}', 11, '#161616', {
        align: 'middle',
        fontWeight: '500',
        fontFamily: 'Montserrat, Arial, sans-serif',
      }),
      text('date-value', 620, 449, '{{date}}', 14, '#161616', {
        align: 'middle',
        fontWeight: '600',
        fontFamily: 'Montserrat, Arial, sans-serif',
      }),
      text('date-label', 620, 477, 'DATE', 11, '#161616', {
        align: 'middle',
        fontWeight: '500',
        fontFamily: 'Montserrat, Arial, sans-serif',
      }),
    ],
  }),
  makeTemplate({
    id: 'classic-golden-certificate-v3',
    title: 'Classic Golden Achievement Certificate',
    description: 'Elegant white and gold achievement certificate with editable recipient, certificate copy, and signatory details.',
    style: 'classic',
    category: 'certificate',
    size: { width: 841.89, height: 595.28, unit: 'px', label: 'A4 landscape print' },
    thumbnail: '/templates/certificate/classic-golden-v3/preview.webp',
    backgroundAsset: '/templates/certificate/classic-golden-v3/background.svg',
    tags: ['certificate', 'classic', 'gold', 'achievement', 'award', 'editable'],
    popularity: 97,
    elements: [
      text('certificate-title', 420.95, 91, 'CERTIFICATE', 34, '#7E671D', {
        align: 'middle',
        fontWeight: '500',
        fontFamily: 'Georgia, serif',
      }),
      text('certificate-subtitle', 420.95, 122, 'OF ACHIEVEMENT', 12, '#B48A27', {
        align: 'middle',
        fontWeight: '600',
        fontFamily: 'Montserrat, Arial, sans-serif',
      }),
      text('presentation-line', 420.95, 191, 'THIS CERTIFICATE IS PROUDLY PRESENTED TO:', 10, '#161616', {
        align: 'middle',
        fontWeight: '600',
        fontFamily: 'Montserrat, Arial, sans-serif',
      }),
      text('participant-name', 420.95, 251, '{{participantName}}', 32, '#161616', {
        align: 'middle',
        fontWeight: '700',
        fontFamily: 'Georgia, serif',
      }),
      text('description-line-1', 420.95, 295, 'Tadbir rivojiga qo‘shgan munosib hissasi va yuksak natijalari uchun', 10, '#424242', {
        align: 'middle',
        fontFamily: 'Montserrat, Arial, sans-serif',
      }),
      text('description-line-2', 420.95, 310, 'tashkilotchilar tomonidan chuqur minnatdorlik bilan taqdirlanadi.', 10, '#424242', {
        align: 'middle',
        fontFamily: 'Montserrat, Arial, sans-serif',
      }),
      text('left-signatory-name', 250, 458, '{{signatoryName}}', 12, '#161616', {
        align: 'middle',
        fontWeight: '600',
        fontFamily: 'Montserrat, Arial, sans-serif',
      }),
      text('left-signatory-role', 250, 478, 'PRESIDENT DIRECTOR', 10, '#8A6A17', {
        align: 'middle',
        fontWeight: '600',
        fontFamily: 'Montserrat, Arial, sans-serif',
      }),
      text('right-signatory-name', 590, 458, '{{organization}}', 12, '#161616', {
        align: 'middle',
        fontWeight: '600',
        fontFamily: 'Montserrat, Arial, sans-serif',
      }),
      text('right-signatory-role', 590, 478, 'GENERAL MANAGER', 10, '#8A6A17', {
        align: 'middle',
        fontWeight: '600',
        fontFamily: 'Montserrat, Arial, sans-serif',
      }),
    ],
  }),
  makeTemplate({
    id: 'classic-invitation-006',
    title: 'Classic Invitation',
    description: 'Formal invitation layout with gold details and registration QR.',
    style: 'classic',
    category: 'invitation',
    size: SIZES.a4Portrait,
    tags: ['Official Invitation', 'classic'],
    popularity: 90,
    elements: [...base('classic', SIZES.a4Portrait), ...commonTitle('classic', SIZES.a4Portrait, 'Official Invitation'), box('qrPlaceholder', 'invitation-qr', 575, 880, 130, 130, { stroke: STYLE.classic.accent, fill: '#fffaf0', label: 'Registration QR' })],
  }),
  makeTemplate({
    id: 'classic-agenda-007',
    title: 'Classic Agenda',
    description: 'Printable agenda for conference sessions and official program timing.',
    style: 'classic',
    category: 'agenda',
    size: SIZES.a4Portrait,
    tags: ['Event Program', 'agenda', 'schedule'],
    popularity: 88,
    elements: [...base('classic', SIZES.a4Portrait), ...commonTitle('classic', SIZES.a4Portrait, 'Event Program'), text('session-1', 128, 720, '10:00  Opening Ceremony', 24, STYLE.classic.ink), text('session-2', 128, 775, '11:30  Speaker Session', 24, STYLE.classic.ink), text('session-3', 128, 830, '15:00  Networking and Awards', 24, STYLE.classic.ink)],
  }),
  makeTemplate({
    id: 'classic-thank-you-certificate-008',
    title: 'Classic Thank You Certificate',
    description: 'Elegant appreciation certificate for speakers, sponsors, and partners.',
    style: 'classic',
    category: 'thank-you-certificate',
    size: SIZES.a4Landscape,
    tags: ['thank you', 'certificate', 'partner'],
    popularity: 86,
    elements: [...base('classic', SIZES.a4Landscape), ...commonTitle('classic', SIZES.a4Landscape, 'Thank You Certificate'), text('thanks', 561, 475, 'For valuable contribution to the forum', 24, STYLE.classic.muted, { align: 'middle' }), ...certificateExtras('classic', SIZES.a4Landscape)],
  }),
  makeTemplate({
    id: 'hitech-science-certificate-009',
    title: 'Hi-Tech Science Certificate',
    description: 'Dark futuristic science certificate with cyan geometry.',
    style: 'hitech-science',
    category: 'certificate',
    size: SIZES.a4Landscape,
    isPremium: true,
    tags: ['science', 'Certificate of Participation', 'futuristic'],
    popularity: 84,
    elements: [...base('hitech-science', SIZES.a4Landscape), ...commonTitle('hitech-science', SIZES.a4Landscape, 'Certificate of Participation'), ...certificateExtras('hitech-science', SIZES.a4Landscape)],
  }),
  makeTemplate({
    id: 'hitech-science-badge-010',
    title: 'Hi-Tech Science Badge',
    description: 'Dark conference badge with QR and bright participant details.',
    style: 'hitech-science',
    category: 'badge',
    size: SIZES.badge,
    tags: ['badge', 'science', 'qr'],
    popularity: 82,
    elements: [...base('hitech-science', SIZES.badge), ...commonTitle('hitech-science', SIZES.badge, 'Science Badge'), text('full-name', 270, 430, '{{full_name}}', 34, STYLE['hitech-science'].ink, { align: 'middle', fontWeight: '700' }), text('role', 270, 485, '{{role}}', 20, STYLE['hitech-science'].muted, { align: 'middle' }), box('qrPlaceholder', 'badge-qr', 370, 620, 98, 98, { stroke: STYLE['hitech-science'].accent, fill: '#07111f', label: 'QR' })],
  }),
  makeTemplate({
    id: 'hitech-science-speaker-card-011',
    title: 'Hi-Tech Science Speaker Card',
    description: 'Speaker Session card with photo placeholder and futuristic accents.',
    style: 'hitech-science',
    category: 'speaker-card',
    size: SIZES.social,
    printable: false,
    tags: ['Speaker Session', 'social', 'speaker'],
    popularity: 80,
    elements: [...base('hitech-science', SIZES.social, false), box('imagePlaceholder', 'speaker-photo', 82, 240, 350, 520, { fill: '#0f2034', stroke: STYLE['hitech-science'].accent, label: 'SPEAKER PHOTO' }), ...commonTitle('hitech-science', SIZES.social, 'Speaker Session'), text('speaker-name', 680, 610, '{{speaker_name}}', 46, STYLE['hitech-science'].ink, { align: 'middle', fontWeight: '700' }), text('position', 680, 670, '{{position}}', 26, STYLE['hitech-science'].muted, { align: 'middle' })],
  }),
  makeTemplate({
    id: 'hitech-science-social-post-012',
    title: 'Hi-Tech Science Social Post',
    description: 'Square science forum post for social channels.',
    style: 'hitech-science',
    category: 'social-post',
    size: SIZES.social,
    printable: false,
    tags: ['social', 'science forum', 'online'],
    popularity: 78,
    elements: [...base('hitech-science', SIZES.social, false), ...commonTitle('hitech-science', SIZES.social, 'Tashkent Science Forum'), text('cta', 540, 820, 'Live updates and registration', 34, STYLE['hitech-science'].accent, { align: 'middle', fontWeight: '700' })],
  }),
  makeTemplate({
    id: 'qr-registration-card-013',
    title: 'QR Registration Card',
    description: 'Compact registration QR card for check-in desks and invitations.',
    style: 'minimalistic',
    category: 'qr-card',
    size: SIZES.qr,
    tags: ['Registration QR', 'check-in'],
    popularity: 76,
    elements: [...base('minimalistic', SIZES.qr), ...commonTitle('minimalistic', SIZES.qr, 'Registration QR'), box('qrPlaceholder', 'registration-qr', 160, 430, 200, 200, { stroke: STYLE.minimalistic.accent, fill: '#ffffff', label: 'Registration QR' })],
  }),
  makeTemplate({
    id: 'sponsor-banner-014',
    title: 'Sponsor Banner',
    description: 'Wide sponsor banner with Gold Sponsor copy and logo area.',
    style: 'classic',
    category: 'sponsor-banner',
    size: SIZES.sponsor,
    tags: ['Gold Sponsor', 'banner'],
    popularity: 74,
    elements: [...base('classic', SIZES.sponsor), ...commonTitle('classic', SIZES.sponsor, 'Gold Sponsor'), text('sponsor-name', 960, 720, '{{sponsor_name}}', 62, STYLE.classic.ink, { align: 'middle', fontWeight: '700' }), box('imagePlaceholder', 'sponsor-logo', 760, 795, 400, 120, { stroke: STYLE.classic.accent, fill: '#fffaf0', label: 'SPONSOR LOGO' })],
  }),
  makeTemplate({
    id: 'rollup-banner-015',
    title: 'Roll-up Banner',
    description: 'Tall roll-up banner for forum entrances and registration zones.',
    style: 'minimalistic',
    category: 'rollup-banner',
    size: SIZES.rollup,
    tags: ['roll-up', 'print', 'entrance'],
    popularity: 72,
    elements: [...base('minimalistic', SIZES.rollup), ...commonTitle('minimalistic', SIZES.rollup, 'Science Forum 2026'), box('qrPlaceholder', 'rollup-qr', 325, 1600, 200, 200, { stroke: STYLE.minimalistic.accent, fill: '#ffffff', label: 'Registration QR' })],
  }),
  makeTemplate({
    id: 'press-wall-016',
    title: 'Press Wall',
    description: 'Repeating logo press wall for photo zones and media backdrops.',
    style: 'classic',
    category: 'press-wall',
    size: SIZES.press,
    tags: ['press wall', 'media', 'logo'],
    popularity: 70,
    elements: [
      ...base('classic', SIZES.press),
      ...commonTitle('classic', SIZES.press, 'Press Wall'),
      ...Array.from({ length: 12 }).map((_, i) =>
        box('logoPlaceholder', `press-logo-${i + 1}`, 160 + (i % 4) * 300, 610 + Math.floor(i / 4) * 115, 180, 70, {
          stroke: STYLE.classic.accent,
          fill: '#fffaf0',
          label: 'LOGO',
        })
      ),
    ],
  }),
]

export function findStarterTemplate(id: string): StarterTemplate | undefined {
  return STARTER_TEMPLATES.find((template) => template.id === id)
}

export function getStarterTemplatesByCategory(category: TemplateCategory): StarterTemplate[] {
  return STARTER_TEMPLATES.filter((template) => template.category === category)
}
