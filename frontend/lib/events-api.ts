import type {
  BrandingKitId,
  Event,
  EventType,
  MaterialCategory,
  EventMaterial,
} from '@/types/event'

type DbEvent = {
  id: string
  userId: string
  name: string
  type: EventType
  date: Date | null
  location: string | null
  organization: string | null
  language: string
  participantCount: number | null
  brandingKit: BrandingKitId | null
  logoUrl: string | null
  primaryColor: string
  accentColor: string
  createdAt: Date
  updatedAt: Date
  materials?: {
    id: string
    category: MaterialCategory
    status: 'PENDING' | 'IN_PROGRESS' | 'READY'
    designId: string | null
    createdAt: Date
    updatedAt: Date
  }[]
  _count?: { materials: number }
}

export function mapEvent(record: DbEvent): Event {
  return {
    id: record.id,
    userId: record.userId,
    name: record.name,
    type: record.type,
    date: record.date?.toISOString() ?? '',
    location: record.location ?? '',
    organization: record.organization ?? '',
    language: record.language as Event['language'],
    participantCount: record.participantCount ?? undefined,
    brandingKit: record.brandingKit ?? undefined,
    logoUrl: record.logoUrl ?? undefined,
    primaryColor: record.primaryColor,
    accentColor: record.accentColor,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    materialCount: record._count?.materials ?? record.materials?.length,
    materials: record.materials?.map(mapEventMaterial),
  }
}

export function mapEventMaterial(record: {
  id: string
  category: MaterialCategory
  status: 'PENDING' | 'IN_PROGRESS' | 'READY'
  designId: string | null
  createdAt: Date
  updatedAt: Date
}): EventMaterial {
  return {
    id: record.id,
    category: record.category,
    status: record.status,
    designId: record.designId ?? undefined,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  }
}
