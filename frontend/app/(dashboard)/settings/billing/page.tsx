import Link from 'next/link'
import { AdminBillingPanel } from '@/components/settings/AdminBillingPanel'
import { BillingHistoryPanel } from '@/components/settings/BillingHistoryPanel'

export default function SettingsBillingPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/settings" className="text-sm text-brand-600 hover:underline">
          ← Sozlamalar
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-text-primary">To‘lovlar</h1>
        <p className="mt-1 text-sm text-text-muted">
          Buyurtmalar tarixi va webhook jurnali.
        </p>
      </div>
      <BillingHistoryPanel />
      <AdminBillingPanel />
    </div>
  )
}
