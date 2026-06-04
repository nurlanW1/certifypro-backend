import Link from 'next/link'
import { ActivityLogPanel } from '@/components/settings/ActivityLogPanel'
import { Card } from '@/components/ui/Card'

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Sozlamalar</h1>
        <p className="mt-2 text-text-muted">Hisob va audit jurnali.</p>
      </div>
      <Card className="p-4">
        <Link
          href="/settings/billing"
          className="text-sm font-medium text-brand-600 hover:text-brand-800"
        >
          To‘lovlar tarixi →
        </Link>
      </Card>
      <ActivityLogPanel />
    </div>
  )
}
