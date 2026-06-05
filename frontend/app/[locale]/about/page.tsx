import { getTranslations } from 'next-intl/server'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export async function generateMetadata() {
  const t = await getTranslations('about')
  return { title: `${t('sectionTag')} — Gildia` }
}

export default async function AboutPage() {
  const t = await getTranslations('about')

  const stats = [
    { num: '500+', label: t('stat1') },
    { num: '20+', label: t('stat2') },
    { num: '3', label: t('stat3') },
    { num: '2', label: t('stat4') },
  ]

  const values = [
    { title: t('speed'), desc: t('speedDesc') },
    { title: t('quality'), desc: t('qualityDesc') },
    { title: t('simple'), desc: t('simpleDesc') },
    { title: t('complete'), desc: t('completeDesc') },
  ]

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <section className="w-full border-b border-divide">
        <div className="mx-auto max-w-screen-xl px-6 py-20 lg:px-10 xl:px-16">
          <p className="label-caps mb-4">{t('sectionTag')}</p>
          <h1 className="mb-6 max-w-2xl text-5xl font-semibold tracking-tight text-text-primary">
            {t('title')}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-text-secondary">{t('subtitle')}</p>
        </div>
      </section>

      <section className="w-full border-b border-divide">
        <div className="mx-auto max-w-screen-xl px-6 lg:px-10 xl:px-16">
          <div className="grid grid-cols-2 divide-x divide-divide lg:grid-cols-4">
            {stats.map(({ num, label }) => (
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
              <p className="label-caps mb-4">{t('missionTag')}</p>
              <h2 className="mb-6 text-3xl font-semibold tracking-tight text-text-primary">
                {t('missionTitle')}
              </h2>
              <p className="leading-relaxed text-text-secondary">{t('missionText')}</p>
            </div>
            <div className="grid grid-cols-2 gap-px rounded border border-divide bg-divide">
              {values.map(({ title, desc }) => (
                <div key={title} className="bg-canvas p-6 transition-colors hover:bg-subtle">
                  <h3 className="mb-2 text-sm font-semibold text-text-primary">{title}</h3>
                  <p className="text-sm text-text-secondary">{desc}</p>
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
