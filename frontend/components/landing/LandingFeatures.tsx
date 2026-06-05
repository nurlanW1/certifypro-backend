'use client'

const FEATURES = [
  {
    num: '01',
    title: 'Bir marta kiriting',
    desc: "Tadbir nomi, sana, joylashuv, logo — bir marta. Barcha 20+ materialga avtomatik.",
  },
  {
    num: '02',
    title: 'Uslub tanlang',
    desc: "Minimalist, Klassik yoki Hi-Tech. Bir klikda — barcha material shu uslubda o'zgaradi.",
  },
  {
    num: '03',
    title: 'Tahrirlang',
    desc: "Har qanday elementni o'zgartiring. Matn, rang, font, o'lcham — to'liq nazorat.",
  },
  {
    num: '04',
    title: 'Eksport va print',
    desc: "PNG, PDF, SVG. Yoki to'g'ridan-to'g'ri printga yuborish. Rahbariyatga tasdiqlash uchun link.",
  },
]

const CAPABILITIES = [
  { label: 'AI matn yordamchi', icon: '◈' },
  { label: 'Print tayyor', icon: '⊡' },
  { label: 'Tasdiqlash tizimi', icon: '◎' },
  { label: 'Brand Kit', icon: '◉' },
  { label: 'Dark/Light rejim', icon: '◐' },
  { label: "O'zbek/Rus tili", icon: '◑' },
  { label: 'Bulk generatsiya', icon: '▦' },
  { label: 'PNG PDF SVG', icon: '⊞' },
]

export function LandingFeatures() {
  return (
    <section className="border-t border-divide bg-ink px-6 py-24 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <p className="label-caps mb-12">Qanday ishlaydi</p>
            <div>
              {FEATURES.map((f, i) => (
                <div
                  key={f.num}
                  className={`flex gap-8 py-8 ${
                    i < FEATURES.length - 1 ? 'border-b border-divide' : ''
                  }`}
                >
                  <span className="flex-shrink-0 pt-1 text-4xl font-semibold leading-none text-divide">
                    {f.num}
                  </span>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-text-primary">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-text-secondary">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <p className="label-caps mb-12">Imkoniyatlar</p>
            <div className="grid grid-cols-2 gap-px bg-divide">
              {CAPABILITIES.map(({ label, icon }) => (
                <div
                  key={label}
                  className="group cursor-default bg-canvas p-5 transition-colors hover:bg-subtle"
                >
                  <div className="mb-3 inline-block font-mono text-2xl text-accent transition-transform group-hover:scale-110">
                    {icon}
                  </div>
                  <p className="text-sm text-text-secondary transition-colors group-hover:text-text-primary">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
