import type { MaterialCategory } from '@/types/event'

export type TemplateStyle = 'minimalistic' | 'classic' | 'hitech-science'

export type TemplateCategory =
  | 'certificate'
  | 'invitation'
  | 'badge'
  | 'flyer'
  | 'agenda'
  | 'event-program'
  | 'speaker-card'
  | 'sponsor-banner'
  | 'rollup-banner'
  | 'press-wall'
  | 'social-post'
  | 'qr-card'
  | 'ticket'
  | 'table-card'
  | 'id-card'
  | 'thank-you-certificate'

export interface TemplateSize {
  width: number
  height: number
  unit: 'px' | 'mm'
  label: string
}

interface BaseElement {
  id: string
  x: number
  y: number
  opacity?: number
}

export type TemplateElement =
  | (BaseElement & {
      type: 'text'
      text: string
      fontSize: number
      fill: string
      fontFamily?: string
      fontWeight?: string
      align?: 'start' | 'middle' | 'end'
      width?: number
    })
  | (BaseElement & {
      type:
        | 'rect'
        | 'rectangle'
        | 'imagePlaceholder'
        | 'logoPlaceholder'
        | 'qrPlaceholder'
        | 'signaturePlaceholder'
        | 'stampPlaceholder'
        | 'decorativeShape'
      width: number
      height: number
      fill?: string
      stroke?: string
      strokeWidth?: number
      radius?: number
      label?: string
      dashed?: boolean
    })
  | (BaseElement & {
      type: 'circle'
      radius: number
      fill?: string
      stroke?: string
      strokeWidth?: number
    })
  | {
      type: 'line'
      id: string
      x1: number
      y1: number
      x2: number
      y2: number
      stroke: string
      strokeWidth?: number
      dashed?: boolean
      opacity?: number
    }

export interface StarterTemplate {
  id: string
  title: string
  description: string
  style: TemplateStyle
  category: TemplateCategory
  materialCategory: MaterialCategory
  assetType: string
  size: TemplateSize
  isPremium: boolean
  isPrintable: boolean
  isOnlineReady: boolean
  tags: string[]
  thumbnail: string
  popularity: number
  elements: TemplateElement[]
}
