import { getTranslations } from 'next-intl/server'
import { EventWizard } from '@/components/events/EventWizard'

export async function generateMetadata() {
  const t = await getTranslations('eventWizard')
  return {
    title: `${t('title')} — Gildia`,
    description: t('subtitle'),
  }
}

export default async function NewEventPage() {
  const t = await getTranslations('eventWizard')

  return (
    <div className="space-y-8">
      <div className="border-b border-divide pb-8">
        <h1 className="text-2xl font-semibold text-text-primary">{t('title')}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t('subtitle')}</p>
      </div>

      <EventWizard />
    </div>
  )
}
