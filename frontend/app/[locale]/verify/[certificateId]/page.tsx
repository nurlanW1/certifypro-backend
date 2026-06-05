import { BadgeCheck, Calendar, QrCode, ShieldCheck } from 'lucide-react'
import { Link } from '@/i18n/navigation'

interface VerifyCertificatePageProps {
  params: {
    certificateId: string
    locale: string
  }
}

export async function generateMetadata({ params }: VerifyCertificatePageProps) {
  return {
    title: `Certificate verification ${params.certificateId} - Gildia`,
    description: 'Verify a Gildia certificate by unique ID and QR code.',
  }
}

export default function VerifyCertificatePage({ params }: VerifyCertificatePageProps) {
  const isRu = params.locale === 'ru'
  const copy = isRu
    ? {
        eyebrow: 'Certificate verification',
        title: 'Проверка сертификата',
        subtitle:
          'Этот маршрут подготовлен для QR-проверки. После подключения backend здесь будет статус сертификата, участник, событие и дата выдачи.',
        status: 'Verification concept ready',
        event: 'Мероприятие',
        holder: 'Участник',
        date: 'Дата выдачи',
        back: 'На главную',
      }
    : {
        eyebrow: 'Certificate verification',
        title: 'Sertifikatni tekshirish',
        subtitle:
          'Bu route QR verification uchun tayyorlandi. Backend ulangach bu yerda sertifikat statusi, ishtirokchi, tadbir va berilgan sana ko‘rinadi.',
        status: 'Verification concept ready',
        event: 'Tadbir',
        holder: 'Ishtirokchi',
        date: 'Berilgan sana',
        back: 'Bosh sahifa',
      }

  return (
    <main className="min-h-screen bg-canvas px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="label-caps mb-3">{copy.eyebrow}</p>
          <h1 className="mb-3 text-3xl font-semibold tracking-tight text-text-primary">
            {copy.title}
          </h1>
          <p className="max-w-2xl text-sm text-text-secondary">{copy.subtitle}</p>
        </div>

        <section className="overflow-hidden rounded border border-divide bg-ink">
          <div className="flex items-center justify-between border-b border-divide px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded border border-accent-border bg-accent-dim">
                <ShieldCheck className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{copy.status}</p>
                <p className="font-mono text-xs text-text-disabled">{params.certificateId}</p>
              </div>
            </div>
            <span className="tag tag-warn">TODO API</span>
          </div>

          <div className="grid gap-px bg-divide sm:grid-cols-3">
            {[
              [copy.event, 'AI Forum Tashkent', Calendar],
              [copy.holder, '{{full_name}}', BadgeCheck],
              [copy.date, '{{date}}', QrCode],
            ].map(([label, value, Icon]) => (
              <div key={label as string} className="bg-canvas p-5">
                <Icon className="mb-4 h-5 w-5 text-accent" />
                <p className="label-caps mb-1">{label as string}</p>
                <p className="text-sm font-medium text-text-primary">{value as string}</p>
              </div>
            ))}
          </div>
        </section>

        <Link href="/" className="btn-secondary btn-md mt-8 inline-flex">
          {copy.back}
        </Link>
      </div>
    </main>
  )
}
