'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQ = [
  {
    q: 'Gildia nima?',
    a: 'Tadbir materiallarini — sertifikat, nishon, taklifnoma va boshqalarni — bir joyda yaratish platformasi.',
  },
  {
    q: 'Dizayner kerakmi?',
    a: "Yo'q. Shablon tanlang, ma'lumotlarni kiriting — dizayn avtomatik tayyorlanadi.",
  },
  {
    q: 'Qanday formatda eksport?',
    a: 'PNG, PDF va SVG. Pro rejimda watermark yo‘q.',
  },
  {
    q: 'Bepul rejimda nima bor?',
    a: 'Oyiga 5 ta dizayn, 3 uslub va asosiy editor.',
  },
]

export function LandingFaq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="w-full border-t border-divide bg-canvas">
      <div className="mx-auto max-w-screen-xl px-6 py-24 lg:px-10 xl:px-16">
        <p className="label-caps mb-3">Savollar</p>
        <h2 className="mb-12 text-4xl font-semibold tracking-tight text-text-primary">
          Ko&apos;p so&apos;raladigan savollar
        </h2>
        <div className="divide-y divide-divide border border-divide rounded">
          {FAQ.map((item, i) => (
            <div key={i} className="bg-canvas">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-subtle"
              >
                <span className="text-sm font-medium text-text-primary">{item.q}</span>
                <ChevronDown
                  size={16}
                  className={cn(
                    'text-text-disabled transition-transform',
                    open === i && 'rotate-180'
                  )}
                />
              </button>
              {open === i && (
                <p className="border-t border-divide px-6 py-4 text-sm leading-relaxed text-text-secondary">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

