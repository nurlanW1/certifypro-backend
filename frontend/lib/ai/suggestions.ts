import type { EventType } from '@/types/event'
import { EVENT_TYPE_LABELS } from '@/types/event'
import { formatDate } from '@/lib/utils'

export interface EventCopySuggestions {
  invitation: string
  agenda: string[]
  socialPost: string
  certificateSubtitle: string
}

export function generateEventSuggestions(event: {
  name: string
  type: EventType
  date?: string | null
  location?: string | null
  organization?: string | null
  language?: string
}): EventCopySuggestions {
  const typeLabel = EVENT_TYPE_LABELS[event.type]
  const dateStr = event.date ? formatDate(event.date) : 'yaqin kunlarda'
  const place = event.location || 'Toshkent'
  const org = event.organization || 'Gildia hamkori'

  const invitation =
    event.language === 'ru'
      ? `Уважаемые гости! Приглашаем вас на ${typeLabel.toLowerCase()} «${event.name}». Дата: ${dateStr}. Место: ${place}. Организатор: ${org}.`
      : event.language === 'en'
        ? `You are invited to ${event.name} — a ${typeLabel.toLowerCase()} on ${dateStr} at ${place}, hosted by ${org}.`
        : `Hurmatli mehmonlar! Sizni «${event.name}» ${typeLabel.toLowerCase()}iga taklif qilamiz. Sana: ${dateStr}. Manzil: ${place}. Tashkilotchi: ${org}.`

  const agenda = [
    '09:00 — Ro‘yxatdan o‘tish va qahva',
    '10:00 — Ochilish va asosiy ma’ruzalar',
    '12:30 — Tushlik va networking',
    '14:00 — Master-klasslar / panel muhokamalar',
    '16:30 — Yopilish va sertifikatlar topshirish',
  ]

  const socialPost =
    event.language === 'ru'
      ? `🎉 ${event.name} — ${dateStr}, ${place}. Регистрация открыта! #${slugify(event.name)}`
      : `🎉 ${event.name} — ${dateStr}, ${place}. Ro‘yxatdan o‘ting! #Gildia #${slugify(event.name)}`

  const certificateSubtitle =
    event.language === 'ru'
      ? 'настоящим подтверждается участие в мероприятии'
      : event.language === 'en'
        ? 'has successfully participated in'
        : 'quyidagi tadbir ishtirokchisi sifatida taqdirlanadi'

  return { invitation, agenda, socialPost, certificateSubtitle }
}

function slugify(s: string): string {
  return s.replace(/[^\w]+/g, '').slice(0, 24) || 'Event'
}
