import Link from 'next/link'
import { Layers } from 'lucide-react'

export default function BrandKitPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-divide pb-6">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight text-text-primary">Brand Kit</h1>
        <p className="text-sm text-text-secondary">Tashkilot ranglari, logotip va fontlari</p>
      </div>
      <div className="rounded border border-divide p-12 text-center">
        <Layers className="mx-auto mb-4 h-10 w-10 text-text-disabled" />
        <p className="mb-4 text-sm text-text-secondary">
          Brand Kit tez orada. Hozircha sozlamalar orqali ranglarni boshqaring.
        </p>
        <Link href="/settings" className="btn-secondary btn-md">
          Sozlamalarga o&apos;tish
        </Link>
      </div>
    </div>
  )
}
