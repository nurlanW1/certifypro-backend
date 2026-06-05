'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

const STYLES = [
  {
    id: 'MINIMALIST',
    name: 'Minimalist',
    desc: "Toza sahifalar, kuchli tipografiya, ko'p bo'shliq",
    indicator: 'bg-white',
    previewBg: '#FAFAFA',
    previewText: '#0A0A0A',
    previewAccent: '#7B68EE',
    previewBorder: '#E5E5E5',
    tags: ['Inter font', 'Oq fon', 'Minimal dekor'],
  },
  {
    id: 'CLASSIC',
    name: 'Klassik',
    desc: 'Serif tipografiya, oltin detallar, rasmiy chiziqlar',
    indicator: 'bg-amber-400',
    previewBg: '#FDFAF5',
    previewText: '#2C1654',
    previewAccent: '#C9A84C',
    previewBorder: '#C9A84C',
    tags: ['Playfair Display', 'Krem fon', 'Oltin ramka'],
  },
  {
    id: 'HITECH',
    name: 'Hi-Tech',
    desc: "Qorong'i fon, neon detallar, kelajak estetikasi",
    indicator: 'bg-accent',
    previewBg: '#080808',
    previewText: '#F2F2F2',
    previewAccent: '#7B68EE',
    previewBorder: '#262626',
    tags: ['Geist font', 'Qora fon', 'Neon accent'],
  },
] as const

export function LandingShowcase() {
  const [active, setActive] = useState<string>('MINIMALIST')

  return (
    <section className="border-t border-divide bg-canvas px-6 py-24 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <p className="label-caps mb-3">Dizayn uslublari</p>
            <h2 className="text-4xl font-semibold tracking-tight text-text-primary">
              Bir klikda uslub
            </h2>
          </div>
          <p className="hidden max-w-xs text-right text-sm text-text-secondary md:block">
            Bitta uslub tanlang — barcha 20+ material shu uslubda avtomatik tayyorlanadi
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-divide md:grid-cols-3">
          {STYLES.map((style) => {
            const isActive = active === style.id
            return (
              <div
                key={style.id}
                onClick={() => setActive(style.id)}
                className={`cursor-pointer bg-canvas p-8 transition-all duration-200 hover:bg-subtle ${
                  isActive ? 'bg-subtle' : ''
                }`}
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className={`h-2 w-2 rounded-full ${style.indicator}`} />
                  {isActive && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-dim">
                      <Check size={10} className="text-accent-hover" />
                    </div>
                  )}
                </div>

                <div
                  className="mb-8 overflow-hidden rounded border"
                  style={{
                    background: style.previewBg,
                    borderColor: style.previewBorder,
                  }}
                >
                  <div className="p-6">
                    <div className="mb-5 flex items-center gap-2">
                      <div
                        className="h-6 w-6 rounded"
                        style={{ background: style.previewAccent, opacity: 0.9 }}
                      />
                      <div
                        className="h-1.5 w-20 rounded-full opacity-20"
                        style={{ background: style.previewText }}
                      />
                    </div>
                    <div
                      className="mb-3 h-2 w-24 rounded-full opacity-20"
                      style={{ background: style.previewAccent }}
                    />
                    <div
                      className="mb-2 h-8 w-full rounded"
                      style={{ background: style.previewText, opacity: 0.06 }}
                    >
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: 700,
                          color: style.previewText,
                          padding: '4px 0',
                          fontFamily: style.id === 'CLASSIC' ? 'serif' : 'sans-serif',
                        }}
                      >
                        Alisher Karimov
                      </div>
                    </div>
                    <div
                      className="mt-2 inline-block rounded-full px-3 py-1 text-xs"
                      style={{
                        background: `${style.previewAccent}20`,
                        color: style.previewAccent,
                      }}
                    >
                      Spiker
                    </div>
                    <div
                      className="mt-5 flex items-center justify-between border-t pt-4"
                      style={{ borderColor: style.previewBorder }}
                    >
                      <div
                        className="h-1.5 w-20 rounded-full opacity-10"
                        style={{ background: style.previewText }}
                      />
                      <div
                        className="h-1.5 w-12 rounded-full opacity-10"
                        style={{ background: style.previewText }}
                      />
                    </div>
                  </div>
                </div>

                <h3 className="mb-2 text-xl font-semibold text-text-primary">{style.name}</h3>
                <p className="mb-5 text-sm leading-relaxed text-text-secondary">{style.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {style.tags.map((tag) => (
                    <span key={tag} className="tag tag-default">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
