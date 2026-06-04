import type { MaterialCategory } from '@prisma/client'

export type BulkMaterialCategory = Extract<
  MaterialCategory,
  'CERTIFICATE' | 'BADGE' | 'NAME_TAG'
>

export const BULK_MATERIAL_CONFIG: Record<
  BulkMaterialCategory,
  {
    label: string
    maxTextWidth: number
    exportFormat: string
    activityAction: string
    rateLimitKey: string
    zipSuffix: string
  }
> = {
  CERTIFICATE: {
    label: 'Sertifikat',
    maxTextWidth: 580,
    exportFormat: 'bulk_certificate',
    activityAction: 'bulk.certificates',
    rateLimitKey: 'bulk-certs',
    zipSuffix: 'sertifikatlar',
  },
  BADGE: {
    label: 'Nishon',
    maxTextWidth: 320,
    exportFormat: 'bulk_badge',
    activityAction: 'bulk.badges',
    rateLimitKey: 'bulk-badges',
    zipSuffix: 'nishonlar',
  },
  NAME_TAG: {
    label: 'Ism tag',
    maxTextWidth: 200,
    exportFormat: 'bulk_name_tag',
    activityAction: 'bulk.name_tags',
    rateLimitKey: 'bulk-nametags',
    zipSuffix: 'ism-taglar',
  },
}

export function isBulkMaterialCategory(value: string): value is BulkMaterialCategory {
  return value === 'CERTIFICATE' || value === 'BADGE' || value === 'NAME_TAG'
}
