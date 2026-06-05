import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Layers } from 'lucide-react'

export default async function BrandKitPage() {
  const t = await getTranslations('brandKit')

  return (
    <div className="space-y-6">
      <div className="border-b border-divide pb-6">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight text-text-primary">
          {t('title')}
        </h1>
        <p className="text-sm text-text-secondary">{t('subtitle')}</p>
      </div>
      <div className="rounded border border-divide p-12 text-center">
        <Layers className="mx-auto mb-4 h-10 w-10 text-text-tertiary" />
        <p className="mb-4 text-sm text-text-secondary">{t('comingSoon')}</p>
        <Link href="/settings" className="btn-secondary btn-md">
          {t('goToSettings')}
        </Link>
      </div>
    </div>
  )
}
