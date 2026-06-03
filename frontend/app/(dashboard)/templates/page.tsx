import { TemplateGallery } from '@/components/templates/TemplateGallery'

export const metadata = {
  title: 'Shablonlar — Gildia',
  description: 'Tadbir uchun professional dizayn shablonlarini tanlang',
}

export default function TemplatesPage() {
  return (
    <div className="-m-4 md:-m-6">
      <div className="px-4 py-2 md:px-6 md:py-4">
        <TemplateGallery />
      </div>
    </div>
  )
}
