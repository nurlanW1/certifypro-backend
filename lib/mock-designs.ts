export interface DashboardDesign {
  id: string
  name: string
  eventName: string
  templateId: string
  previewUrl?: string
  updatedAt: string
}

export const MOCK_RECENT_DESIGNS: DashboardDesign[] = [
  {
    id: 'design-001',
    name: 'AI Forum sertifikati',
    eventName: 'AI Forum Toshkent 2025',
    templateId: 'cert-001',
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'design-002',
    name: 'Seminar taklifnomasi',
    eventName: 'Digital Marketing Seminar',
    templateId: 'inv-001',
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'design-003',
    name: 'Instagram post',
    eventName: 'Startup Weekend',
    templateId: 'social-001',
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'design-004',
    name: 'Roll-up banner',
    eventName: 'Health Conference',
    templateId: 'rollup-001',
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
]
