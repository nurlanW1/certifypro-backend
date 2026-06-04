import { Suspense } from 'react'
import { TemplateGallery } from '@/components/templates/TemplateGallery'
import { Spinner } from '@/components/ui/Spinner'

export const metadata = {
  title: 'Shablon katalogi — Gildia',
  description: 'Tadbir materiali uchun shablon tanlash',
}

export default function TemplatesPage() {
  return (
    <div className="-m-4 md:-m-6">
      <div className="px-4 py-2 md:px-6 md:py-4">
        <Suspense fallback={<Spinner className="py-16" />}>
          <TemplateGallery />
        </Suspense>
      </div>
    </div>
  )
}
