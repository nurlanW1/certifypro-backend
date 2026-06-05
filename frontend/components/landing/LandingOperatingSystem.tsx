'use client'

import { useLocale } from 'next-intl'
import {
  Bot,
  Building2,
  FileCheck2,
  FileSpreadsheet,
  FolderKanban,
  QrCode,
  ShieldCheck,
  Users,
} from 'lucide-react'

const COPY = {
  uz: {
    eyebrow: 'Nima tayyorlanadi',
    title: 'Shablon emas. To‘liq tadbir ishlab chiqarish oqimi.',
    subtitle:
      'Foydalanuvchi dizayn qilish uchun emas, tadbirni tez va xatosiz tayyorlash uchun keladi. Gildia event ma’lumotlarini markazlashtiradi va har bir materialni yagona uslubga bog‘laydi.',
    workflow: 'Event package workflow',
    steps: [
      'Tadbir yaratish',
      'Branding va uslub tanlash',
      'Material paketini generatsiya qilish',
      'Excel ro‘yxatdan sertifikat va bejiklar',
      'Print Draft bilan rahbariyatga ko‘rsatish',
      'Final PDF, PNG va ZIP eksport',
    ],
    modules: [
      ['Event Builder', 'Nomi, sana, joy, tashkilot, kontakt va til bir joyda.'],
      ['Branding Kit', 'Minimalistic, Classic yoki Hi-Tech Science uslubi.'],
      ['Excel Bulk', 'CSV/XLSX ustunlarini {{full_name}} va boshqa o‘zgaruvchilarga bog‘lash.'],
      ['QR System', 'Ro‘yxatdan o‘tish, attendance, chipta va sertifikat verification.'],
      ['Speaker & Sponsor', 'Spiker kartalari, agenda, press-wall va sponsor bannerlari.'],
      ['AI Assistant', 'Matn, agenda, bio va data cleanup uchun UI tayyor.'],
    ],
    readiness: 'Readiness score',
    readinessText: 'Yetishmayotgan sponsor banner, spiker kartalari va final exportlar ko‘rinadi.',
  },
  ru: {
    eyebrow: 'Что готовится',
    title: 'Не шаблоны. Полный production workflow мероприятия.',
    subtitle:
      'Пользователь приходит не просто рисовать, а быстро и без ошибок подготовить мероприятие. Gildia связывает данные события, стиль и каждый материал в одном пространстве.',
    workflow: 'Event package workflow',
    steps: [
      'Создать мероприятие',
      'Выбрать branding и стиль',
      'Сгенерировать пакет материалов',
      'Сертификаты и бейджи из Excel',
      'Показать Print Draft руководству',
      'Final PDF, PNG и ZIP экспорт',
    ],
    modules: [
      ['Event Builder', 'Название, дата, место, организация, контакты и язык.'],
      ['Branding Kit', 'Minimalistic, Classic или Hi-Tech Science стиль.'],
      ['Excel Bulk', 'Связка CSV/XLSX колонок с {{full_name}} и переменными.'],
      ['QR System', 'Регистрация, attendance, билеты и certificate verification.'],
      ['Speaker & Sponsor', 'Карточки спикеров, agenda, press-wall и sponsor banners.'],
      ['AI Assistant', 'UI готов для текста, agenda, bio и data cleanup.'],
    ],
    readiness: 'Readiness score',
    readinessText: 'Видно, каких banner, speaker cards и final exports еще не хватает.',
  },
}

const ICONS = [FolderKanban, ShieldCheck, FileSpreadsheet, QrCode, Users, Bot]

export function LandingOperatingSystem() {
  const locale = useLocale()
  const copy = COPY[locale as 'uz' | 'ru'] ?? COPY.uz

  return (
    <section className="border-t border-divide bg-canvas px-6 py-24 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-3xl">
          <p className="label-caps mb-3">{copy.eyebrow}</p>
          <h2 className="mb-4 text-4xl font-semibold tracking-tight text-text-primary">
            {copy.title}
          </h2>
          <p className="text-base leading-relaxed text-text-secondary">{copy.subtitle}</p>
        </div>

        <div className="grid gap-px bg-divide lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-ink p-6">
            <div className="mb-5 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-accent" />
              <p className="text-sm font-semibold text-text-primary">{copy.workflow}</p>
            </div>
            <div className="space-y-3">
              {copy.steps.map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded border border-divide bg-canvas p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-subtle text-xs font-semibold text-text-tertiary">
                    {index + 1}
                  </span>
                  <span className="text-sm text-text-secondary">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid bg-divide sm:grid-cols-2">
            {copy.modules.map(([title, description], index) => {
              const Icon = ICONS[index]
              return (
                <div key={title} className="bg-canvas p-6 transition-colors hover:bg-subtle">
                  <Icon className="mb-4 h-5 w-5 text-accent" />
                  <h3 className="mb-2 text-base font-semibold text-text-primary">{title}</h3>
                  <p className="text-sm leading-relaxed text-text-secondary">{description}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-8 rounded border border-accent-border bg-accent-dim p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-accent-hover">{copy.readiness}</p>
              <p className="mt-1 text-sm text-text-secondary">{copy.readinessText}</p>
            </div>
            <div className="flex min-w-[220px] items-center gap-3">
              <FileCheck2 className="h-5 w-5 text-accent" />
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-canvas">
                <div className="h-full w-[72%] rounded-full bg-accent" />
              </div>
              <span className="text-sm font-semibold text-text-primary">72%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
