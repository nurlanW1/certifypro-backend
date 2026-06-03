import Link from 'next/link'
import { Crown } from 'lucide-react'

export default function UpgradePage() {
  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="gildia-card p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-warning-light">
          <Crown className="h-7 w-7 text-warning-dark" />
        </div>
        <h1 className="text-2xl font-semibold text-text-primary">Gildia Pro</h1>
        <p className="mt-2 text-text-muted">
          Premium shablonlar, roll-up, press wall va cheksiz eksport imkoniyatlari.
        </p>
        <Link href="/dashboard" className="gildia-btn-primary mt-6 inline-flex">
          Bosh sahifaga qaytish
        </Link>
      </div>
    </div>
  )
}
