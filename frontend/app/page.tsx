import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  CalendarPlus,
  Layers,
  Download,
  Users,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { AuthButtons } from '@/components/auth/AuthButtons'
import { isClerkConfigured } from '@/lib/clerk-config'
import { isProduction } from '@/lib/env'

const JOURNEY = [
  {
    step: '1',
    title: 'Tadbir yarating',
    desc: 'Nom, sana, joy, brend ranglari — bir marta.',
  },
  {
    step: '2',
    title: 'Materiallarni tanlang',
    desc: 'Sertifikat, nishon, poster va boshqa turlar ro‘yxatga qo‘shiladi.',
  },
  {
    step: '3',
    title: 'Har birini dizayn qiling',
    desc: 'Tadbir markazidan shablon tanlang, muharrirda tahrirlang.',
  },
  {
    step: '4',
    title: 'Eksport qiling',
    desc: 'PNG va PDF — chop etishga tayyor.',
  },
]

export default async function HomePage() {
  if (isClerkConfigured()) {
    const { auth } = await import('@clerk/nextjs/server')
    const { userId } = auth()
    if (userId) redirect('/dashboard')
  }

  const showDevBanner = !isClerkConfigured() && !isProduction()

  return (
    <div className="gildia-page-mesh min-h-screen">
      <nav className="sticky top-0 z-20 border-b border-border/80 bg-surface/70 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient shadow-sm">
              <span className="font-display text-lg font-bold text-text-inverse">G</span>
            </div>
            <span className="font-display text-xl font-bold text-text-primary">Gildia</span>
          </Link>
          <AuthButtons />
        </div>
      </nav>

      {showDevBanner && (
        <div className="border-b border-brand-200 bg-brand-50 px-6 py-2 text-center text-sm text-brand-800">
          Dev rejim: Clerk kalitlari yo&apos;q — faqat mahalliy sinov uchun.
        </div>
      )}

      <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 md:pt-28">
        <div className="pointer-events-none absolute left-1/2 top-8 h-64 w-[90%] -translate-x-1/2 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="relative grid items-center gap-14 lg:grid-cols-2">
          <div>
            <span className="gildia-badge mb-6 inline-flex gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-brand-600" />
              Event Media OS
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-text-primary md:text-5xl lg:text-[3.25rem]">
              Bitta tadbir —
              <br />
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                barcha materiallar
              </span>{' '}
              bir joyda
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-text-muted">
              Shablon do‘koni emas. Avval tadbir yarating, keyin sertifikat, nishon va boshqa
              materiallarni shu loyiha ichida boshqaring.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <AuthButtons size="hero" />
              <Link
                href="/events/new"
                className="gildia-btn-secondary inline-flex items-center gap-2 px-6 py-3"
              >
                <CalendarPlus className="h-5 w-5" />
                Tadbir yaratish
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="gildia-card overflow-hidden p-6 shadow-glow md:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                Tadbir markazi
              </p>
              <ul className="mt-4 space-y-3">
                {['Sertifikat', 'Nishon', 'Poster', 'Press devor'].map((label, i) => (
                  <li
                    key={label}
                    className="flex items-center gap-4 rounded-xl border border-border bg-surface-secondary/80 px-4 py-3"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 font-display text-sm font-bold text-brand-800">
                      {i + 1}
                    </span>
                    <span className="font-medium text-text-primary">{label}</span>
                    <span className="ml-auto rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                      Tayyor
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface/60 px-6 py-16 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-display text-2xl font-bold text-text-primary md:text-3xl">
            Qanday ishlaydi
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-text-muted">
            To‘rt qadam — tadbirdan eksportgacha
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {JOURNEY.map((item) => (
              <article key={item.step} className="gildia-card p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient font-display text-sm font-bold text-text-inverse">
                  {item.step}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            {
              icon: Layers,
              title: 'Tadbir markazi',
              desc: 'Har bir material holati: kutilmoqda, jarayonda, tayyor.',
            },
            {
              icon: Users,
              title: 'Brend bir xil',
              desc: 'Logo va ranglar barcha materiallarga qo‘llanadi.',
            },
            {
              icon: Download,
              title: 'Eksport',
              desc: 'Har bir dizayn uchun PNG va PDF.',
            },
          ].map((f) => (
            <div key={f.title} className="gildia-card flex flex-col p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">
                <f.icon className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-text-primary">{f.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-center text-sm text-text-muted">
          Shablon katalogi mavjud — lekin asosiy yo‘l har doim{' '}
          <strong className="font-semibold text-brand-700">tadbir → materiallar</strong>.
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-6 py-2.5 text-sm font-semibold text-text-inverse shadow-sm transition-all hover:shadow-md"
          >
            Bepul boshlash
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
