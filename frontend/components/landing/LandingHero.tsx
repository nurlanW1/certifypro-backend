'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, MoveRight } from 'lucide-react'

const WORDS = ['sertifikat', 'nishon', 'taklifnoma', 'flayer', 'poster']

export function LandingHero() {
  const [typed, setTyped] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const word = WORDS[wordIdx]
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          const next = word.slice(0, typed.length + 1)
          setTyped(next)
          if (next.length === word.length) {
            setTimeout(() => setIsDeleting(true), 1400)
          }
        } else {
          const next = word.slice(0, typed.length - 1)
          setTyped(next)
          if (next.length === 0) {
            setIsDeleting(false)
            setWordIdx((i) => (i + 1) % WORDS.length)
          }
        }
      },
      isDeleting ? 40 : 80
    )
    return () => clearTimeout(timeout)
  }, [typed, isDeleting, wordIdx])

  return (
    <section className="relative flex min-h-[92vh] w-full items-center overflow-hidden border-b border-divide bg-canvas">
      <div className="landing-grid pointer-events-none absolute inset-0" />
      <div className="absolute left-0 right-0 top-0 h-px bg-divide" />

      <div className="relative mx-auto w-full max-w-screen-xl px-6 py-24 lg:px-10 xl:px-16">
        <div className="mb-10 flex animate-in-up items-center gap-3">
          <span className="tag tag-default">Yangi</span>
          <span className="text-sm text-text-tertiary">AI asosida tadbir media dizayni</span>
          <span className="text-sm text-text-disabled">—</span>
          <span className="flex items-center gap-1 text-sm text-text-tertiary">
            Ko&apos;proq <MoveRight size={12} />
          </span>
        </div>

        <div className="mb-8 animate-in-up">
          <h1 className="font-sans text-5xl font-semibold leading-[1.05] tracking-tight text-text-primary sm:text-6xl lg:text-7xl">
            Tadbir uchun
            <br />
            <span className="text-text-secondary">har qanday</span>
            <br />
            <span className="inline-flex items-baseline gap-1">
              <span className="text-accent">{typed}</span>
              <span className="inline-block h-[0.85em] w-0.5 animate-cursor bg-accent align-baseline" />
            </span>
            <br />
            <span className="text-text-primary">bir zumda.</span>
          </h1>
        </div>

        <p className="mb-12 max-w-xl animate-in-up text-lg leading-relaxed text-text-secondary">
          Tadbir ma&apos;lumotini bir marta kiriting. Sertifikat, nishon, taklifnoma — 3
          professional uslubda avtomatik tayyorlanadi.
        </p>

        <div className="flex animate-in-up items-center gap-4">
          <Link href="/events/new" className="btn-primary btn-lg flex items-center gap-2">
            Bepul boshlash
            <ArrowRight size={16} />
          </Link>
          <Link href="/templates" className="btn-ghost btn-lg text-text-secondary">
            Shablonlarni ko&apos;rish
          </Link>
        </div>

        <div className="mt-16 flex animate-in-up items-center gap-8 border-t border-divide pt-8">
          {[
            { num: '500+', label: 'tashkilot' },
            { num: '20+', label: 'material turi' },
            { num: '3', label: 'dizayn uslubi' },
            { num: '30 min', label: "o'rtacha vaqt" },
          ].map(({ num, label }) => (
            <div key={label}>
              <div className="text-2xl font-semibold tracking-tight text-text-primary">{num}</div>
              <div className="label-caps mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-divide" />
    </section>
  )
}
