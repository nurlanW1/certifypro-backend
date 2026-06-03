export const SUPPORT_EMAIL = "support@gildia.uz"
export const BUSINESS_EMAIL = "business@gildia.uz"
export const SUPPORT_TELEGRAM = "@gildia_support"

export type PricingPlanId = "free" | "pro" | "event-package" | "enterprise"

export type PricingPlan = {
  id: PricingPlanId
  name: string
  tagline: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  href: string
  highlighted?: boolean
  badge?: string
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Boshlash uchun",
    price: "0",
    period: "UZS",
    description: "Platforma bilan tanishish va bitta dizayn yaratish uchun.",
    features: [
      "Asosiy shablonlar katalogi",
      "Media Editor (cheklangan)",
      "PNG/JPG eksport (watermark bilan)",
      "Qoralama saqlash (session)",
      "1 ta faol loyiha",
    ],
    cta: "Bepul boshlash",
    href: "/register",
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Professional tadbirlar",
    price: "299,000",
    period: "UZS / oy",
    description: "Muntazam tadbirlar, jamoalar va yuqori sifatli eksport uchun.",
    features: [
      "Barcha premium shablonlar",
      "Watermark yo‘q eksport",
      "PDF print-ready va ZIP",
      "Excel bulk generatsiya",
      "QR generator va asset kutubxonasi",
      "Cheksiz loyiha saqlash",
    ],
    cta: "Pro rejani tanlash",
    href: "/register",
    highlighted: true,
    badge: "Mashhur",
  },
  {
    id: "event-package",
    name: "Event Package",
    tagline: "To‘liq tadbir paketi",
    price: "990,000",
    period: "UZS / tadbir",
    description: "Bitta tadbir uchun barcha materiallar — sertifikat, bejik, taklifnoma va boshqalar.",
    features: [
      "Event Builder — material katalogi",
      "10+ material turi (sertifikat, bejik, flyer…)",
      "Brending va logo integratsiyasi",
      "Bulk generatsiya (Excel)",
      "Pro eksport imkoniyatlari",
      "1 tadbir workspace",
    ],
    cta: "Tadbir yaratish",
    href: "/dashboard/events/new",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Tashkilot va agentliklar",
    price: "Maxsus",
    period: "shartnoma",
    description: "Universitetlar, davlat tashkilotlari va event agentliklari uchun.",
    features: [
      "Cheksiz tadbir workspace’lari",
      "Jamoa a’zolari va rollar",
      "Maxsus shablonlar va brending",
      "Priority qo‘llab-quvvatlash",
      "Katta hajmli ishtirokchilar ro‘yxati",
      "Admin va hisobotlar",
    ],
    cta: "Biz bilan bog‘lanish",
    href: "/contact#business",
  },
]

export const PAYMENT_METHODS = ["Click", "Payme", "Uzum", "Paynet"] as const

export type FaqItem = {
  id: string
  question: string
  answer: string
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "what-is-gildia",
    question: "Gildia nima?",
    answer:
      "Gildia.uz — konferensiya, forum va rasmiy tadbirlar uchun grafik materiallar platformasi. Sertifikat, bejik, taklifnoma, flyer, tadbir dasturi va boshqa chop etiladigan hamda raqamli materiallarni shablonlar, Media Editor va Excel bulk generatsiya orqali tayyorlaysiz.",
  },
  {
    id: "one-design",
    question: "Bitta dizayn yaratish mumkinmi?",
    answer:
      "Ha. Shablonlar katalogidan bitta mahsulot tanlab, formani to‘ldiring va Media Editorda tahrirlang. Free rejada asosiy shablonlar va cheklangan eksport mavjud — professional natija uchun Pro tavsiya etiladi.",
  },
  {
    id: "event-package",
    question: "To‘liq tadbir paketi yaratish mumkinmi?",
    answer:
      "Ha. «Tadbir yaratish» oqimida tadbir ma’lumotlarini kiritasiz, Event Builder’da kerakli materiallarni tanlaysiz (sertifikat, bejik, taklifnoma va hokazo), har biri uchun formalar va live preview mavjud. Event Package tarifi bitta tadbir uchun to‘liq to‘plamni qamrab oladi.",
  },
  {
    id: "manual-edit",
    question: "Dizaynni qo‘lda tahrirlash mumkinmi?",
    answer:
      "Ha. Media Editor’da matn, shakl, rasm, QR kod qo‘shish, elementlarni ko‘chirish, o‘lchash, aylantirish va qatlamlar bilan ishlash mumkin. Legacy to‘liq editor ham mavjud — murakkab maketlar uchun.",
  },
  {
    id: "logo-signature",
    question: "Logo va imzo yuklash mumkinmi?",
    answer:
      "Ha. Editor’da logo, imzo, muhr va boshqa rasmlarni yuklashingiz mumkin. Tadbir yaratishda brend ranglari va asosiy logo ham saqlanadi — materiallarga avtomatik qo‘llanadi.",
  },
  {
    id: "export",
    question: "Fayllarni eksport qilish mumkinmi?",
    answer:
      "Ha. PNG, JPG, PDF va boshqa formatlarda eksport qilish mumkin. Free rejada watermark bilan cheklangan eksport; Pro va Event Package’da watermark yo‘q, yuqori sifat va print-ready PDF, shuningdek ZIP bulk yuklab olish.",
  },
  {
    id: "paid-plans",
    question: "Pullik rejalar nimalarni o‘z ichiga oladi?",
    answer:
      "Pro: barcha shablonlar, watermark yo‘q eksport, bulk generatsiya, asset kutubxonasi. Event Package: bitta tadbir uchun to‘liq material to‘plami va Event Builder. Enterprise: jamoa, maxsus shablonlar, priority support va katta hajmli loyihalar. Batafsil — Tariflar sahifasida.",
  },
]
