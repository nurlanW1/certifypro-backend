import { Suspense } from 'react'
import { TemplatesPageClient } from '@/components/templates/TemplatesPageClient'
import { TemplateSkeleton } from '@/components/ui/Skeleton'

export const metadata = {
  title: 'Shablonlar — Gildia',
  description: 'Tadbir materiali uchun shablon tanlash',
}

function TemplatesFallback() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 12 }).map((_, i) => (
        <TemplateSkeleton key={i} />
      ))}
    </div>
  )
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={<TemplatesFallback />}>
      <TemplatesPageClient />
    </Suspense>
  )
}
