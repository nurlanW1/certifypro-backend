import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Haqida — Gildia',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <section className="w-full border-b border-divide">
        <div className="mx-auto max-w-screen-xl px-6 py-20 lg:px-10 xl:px-16">
          <p className="label-caps mb-4">Biz haqimizda</p>
          <h1 className="mb-6 max-w-2xl text-5xl font-semibold tracking-tight text-text-primary">
            Tadbir dizaynini soddalashtiramiz
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-text-secondary">
            Gildia — har qanday tashkilot professional tadbir dizaynini tezda va mustaqil
            yarata olishi uchun qurilgan platforma.
          </p>
        </div>
      </section>

      <section className="w-full border-b border-divide">
        <div className="mx-auto max-w-screen-xl px-6 lg:px-10 xl:px-16">
          <div className="grid grid-cols-2 divide-x divide-divide lg:grid-cols-4">
            {[
              { num: '500+', label: 'Tashkilot' },
              { num: '20+', label: 'Material turi' },
              { num: '3', label: 'Dizayn uslubi' },
              { num: '2', label: 'Interfeys tili' },
            ].map(({ num, label }) => (
              <div key={label} className="px-8 py-10">
                <div className="mb-2 text-4xl font-semibold tracking-tight text-text-primary">
                  {num}
                </div>
                <p className="label-caps">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full border-b border-divide">
        <div className="mx-auto max-w-screen-xl px-6 py-16 lg:px-10 xl:px-16">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div>
              <p className="label-caps mb-4">Maqsad</p>
              <h2 className="mb-6 text-3xl font-semibold tracking-tight text-text-primary">
                Dizayner bo&apos;lmagan ham professional yaratsin
              </h2>
              <p className="leading-relaxed text-text-secondary">
                Ko&apos;p tashkilotlar tadbir o&apos;tkazishda dizayn masalasida qiynaladi —
                frilanser qimmat, Canva&apos;da vaqt ko&apos;p ketadi. Gildia bu ikki muammoni bir
                vaqtda hal qiladi.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-px rounded border border-divide bg-divide">
              {[
                { title: 'Tezlik', desc: "30 daqiqada to'liq paket" },
                { title: 'Sifat', desc: 'Professional shablonlar' },
                { title: 'Sodda', desc: "Dizayner bo'lmagan uchun" },
                { title: "To'liq", desc: '20+ material turi' },
              ].map(({ title, desc }) => (
                <div key={title} className="bg-canvas p-6 transition-colors hover:bg-subtle">
                  <h3 className="mb-2 text-sm font-semibold text-text-primary">{title}</h3>
                  <p className="text-xs text-text-secondary">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
