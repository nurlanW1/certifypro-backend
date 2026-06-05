import { EventWizard } from '@/components/events/EventWizard'

export const metadata = {
  title: 'Yangi tadbir — Gildia',
  description: 'Yangi tadbir loyihasini yarating',
}

export default function NewEventPage() {
  return (
    <div className="space-y-8">
      <div className="pb-8 border-b border-divide">
        <h1 className="text-2xl font-semibold text-text-primary">
          Yangi tadbir yaratish
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Ma&apos;lumotlarni bir marta kiriting — barcha dizayn materiallar avtomatik
          tayyorlanadi
        </p>
      </div>

      <EventWizard />
    </div>
  )
}
