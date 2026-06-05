import type { MaterialCategory } from '@/types/event'

export type StarterTemplateStyle = 'MINIMALISTIC' | 'CLASSIC' | 'HITECH_SCIENCE'
export type StarterTemplateOrientation = 'portrait' | 'landscape' | 'square'

export interface TemplateSize {
  label: string
  width: number
  height: number
  unit: 'px' | 'mm'
}

export type TemplateElement =
  | {
      type: 'text'
      id: string
      x: number
      y: number
      text: string
      fontSize: number
      fill: string
      fontFamily?: string
      fontWeight?: string
      align?: 'start' | 'middle' | 'end'
      width?: number
    }
  | {
      type: 'rectangle' | 'decorativeShape' | 'imagePlaceholder' | 'qrPlaceholder' | 'logoPlaceholder' | 'signaturePlaceholder' | 'stampPlaceholder'
      id: string
      x: number
      y: number
      width: number
      height: number
      fill?: string
      stroke?: string
      strokeWidth?: number
      radius?: number
      opacity?: number
      label?: string
      dashed?: boolean
    }
  | {
      type: 'circle'
      id: string
      x: number
      y: number
      radius: number
      fill?: string
      stroke?: string
      strokeWidth?: number
      opacity?: number
    }
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
  style: StarterTemplateStyle
  category: MaterialCategory
  assetType: string
  size: TemplateSize
  orientation: StarterTemplateOrientation
  isPremium: boolean
  isPrintable: boolean
  isOnlineReady: boolean
  thumbnail: string
  tags: string[]
  description: string
  popularity: number
  elements: TemplateElement[]
}
