import { EventWizard } from '@/components/event-create/wizard/event-wizard'
import { PageFrame } from '@/lib/layout/page-frame'

export const metadata = {
  title: 'Yangi tadbir — Gildia',
  description: 'Yangi tadbir loyihasini yarating',
}

export default function NewEventPage() {
  return (
    <PageFrame width="narrow" className="pb-16">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Tadbir yaratish
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Yangi tadbir yaratish
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ma&apos;lumotlarni bir marta kiriting — barcha dizayn materiallar avtomatik
          tayyorlanadi
        </p>
      </div>
      <EventWizard />
    </PageFrame>
  )
}
