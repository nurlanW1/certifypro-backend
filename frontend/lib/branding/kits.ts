import type { BrandingKitId } from '@/types/event'

export interface BrandingKitTokens {
  titleFont: string
  bodyFont: string
  titleSize: number
  bodySize: number
  accentBar: boolean
}

export const BRANDING_KIT_TOKENS: Record<BrandingKitId, BrandingKitTokens> = {
  CLASSIC: {
    titleFont: 'Georgia',
    bodyFont: 'Arial',
    titleSize: 32,
    bodySize: 16,
    accentBar: true,
  },
  MODERN: {
    titleFont: 'Helvetica',
    bodyFont: 'Helvetica',
    titleSize: 28,
    bodySize: 14,
    accentBar: false,
  },
  ACADEMIC: {
    titleFont: 'Times New Roman',
    bodyFont: 'Times New Roman',
    titleSize: 30,
    bodySize: 15,
    accentBar: true,
  },
  CORPORATE: {
    titleFont: 'Arial',
    bodyFont: 'Arial',
    titleSize: 26,
    bodySize: 14,
    accentBar: false,
  },
}

export function getKitTokens(kit: BrandingKitId | null | undefined): BrandingKitTokens {
  return BRANDING_KIT_TOKENS[kit ?? 'CLASSIC']
}
