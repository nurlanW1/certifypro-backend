import { EventWizard } from '@/components/events/EventWizard'

export const metadata = {
  title: 'Yangi tadbir — Gildia',
  description: 'Yangi tadbir loyihasini yarating',
}

export default function NewEventPage() {
  return (
    <div className="-m-4 min-h-[calc(100vh-4rem)] bg-surface-secondary md:-m-6">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-text-primary">Yangi tadbir yaratish</h1>
          <p className="mt-1 text-sm text-text-muted">
            Ma&apos;lumotlarni bir marta kiriting — barcha dizayn materiallar avtomatik
            tayyorlanadi
          </p>
        </div>
        <EventWizard />
      </div>
    </div>
  )
}
