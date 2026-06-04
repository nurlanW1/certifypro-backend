import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  CalendarPlus,
  Layers,
  Download,
  Users,
  ArrowRight,
  Zap,
} from 'lucide-react'
import { AuthButtons } from '@/components/auth/AuthButtons'
import { isClerkConfigured } from '@/lib/clerk-config'
import { isProduction } from '@/lib/env'

const JOURNEY = [
  {
    step: '01',
    title: 'Tadbir yarating',
    desc: 'Nom, sana, joy, brend ranglari — bir marta.',
  },
  {
    step: '02',
    title: 'Materiallarni tanlang',
    desc: 'Sertifikat, nishon, poster va boshqa turlar ro‘yxatga qo‘shiladi.',
  },
  {
    step: '03',
    title: 'Har birini dizayn qiling',
    desc: 'Tadbir markazidan shablon tanlang, muharrirda tahrirlang.',
  },
  {
    step: '04',
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
      <nav className="sticky top-0 z-20 border-b-2 border-text-primary/10 bg-surface/80 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm border-2 border-text-primary bg-accent-500 shadow-brutal-sm">
              <span className="font-display text-lg font-extrabold text-text-primary">G</span>
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-text-primary">
              Gildia
            </span>
          </Link>
          <AuthButtons />
        </div>
      </nav>

      {showDevBanner && (
        <div className="border-b-2 border-accent-600/30 bg-accent-100 px-6 py-2 text-center text-sm font-medium text-accent-800">
          Dev rejim: Clerk kalitlari yo&apos;q — faqat mahalliy sinov uchun.
        </div>
      )}

      <section className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="gildia-badge mb-6 inline-flex gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              Event Media OS
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] text-text-primary md:text-5xl lg:text-6xl">
              Bitta tadbir.
              <br />
              <span className="text-brand-600">Hammasi</span> bir joyda.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-text-muted">
              Shablon do‘koni emas. Avval tadbir yarating, keyin sertifikat, nishon va boshqa
              materiallarni shu loyiha ichida boshqaring.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
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

          <div className="relative hidden lg:block">
            <div className="absolute -right-4 -top-4 h-full w-full rounded-md border-2 border-text-primary bg-accent-400/40" />
            <div className="relative gildia-card overflow-hidden p-8">
              <div className="space-y-4">
                {['Sertifikat', 'Nishon', 'Poster', 'Press devor'].map((label, i) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 rounded-sm border-2 border-border bg-surface-secondary px-4 py-3"
                    style={{ marginLeft: `${i * 12}px` }}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-brand-600 font-display text-xs font-bold text-text-inverse">
                      {i + 1}
                    </span>
                    <span className="font-medium text-text-primary">{label}</span>
                    <span className="ml-auto text-xs font-semibold uppercase text-brand-600">
                      Tayyor
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-text-primary/10 bg-surface px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-center text-2xl font-bold text-text-primary md:text-3xl">
            Qanday ishlaydi
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-text-muted">
            To‘rt qadam — tadbirdan eksportgacha
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {JOURNEY.map((item) => (
              <article key={item.step} className="gildia-card group p-5 transition-transform hover:-translate-y-0.5">
                <span className="font-display text-3xl font-extrabold text-accent-500">
                  {item.step}
                </span>
                <h3 className="mt-3 font-display text-lg font-bold text-text-primary">
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
            <div
              key={f.title}
              className="gildia-card-soft flex flex-col border-2 border-text-primary/15 p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-sm border-2 border-text-primary bg-brand-50">
                <f.icon className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-text-primary">{f.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-center text-sm text-text-muted">
          Shablon katalogi mavjud — lekin asosiy yo‘l har doim{' '}
          <strong className="font-semibold text-text-primary">tadbir → materiallar</strong>.
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-sm border-2 border-text-primary bg-accent-500 px-5 py-2.5 text-sm font-bold text-text-primary shadow-brutal-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            Bepul boshlash
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
