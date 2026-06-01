import {
  FileStack,
  Printer,
  QrCode,
  Users,
  Wand2,
  Zap,
} from "lucide-react"

import { SectionHeader } from "@/components/ui/card"

const VALUES = [
  {
    icon: Wand2,
    title: "Dizayn avtomatlashtirish",
    description:
      "Shablon tanlang, maydonlarni to‘ldiring — sertifikat, bejik, taklifnoma va boshqa materiallar avtomatik to‘ldiriladi.",
  },
  {
    icon: FileStack,
    title: "Tadbir ekotizimi",
    description:
      "Bitta branding — barcha chop va raqamli materiallar bir xil uslubda, bir workspace ichida.",
  },
  {
    icon: Users,
    title: "Bulk generatsiya",
    description:
      "Excel/CSV ro‘yxatidan 100+ hujjat: ism, tashkilot, QR va ID maydonlari shablonga bog‘lanadi.",
  },
  {
    icon: Printer,
    title: "Print-ready eksport",
    description:
      "PDF, PNG, JPG va print PDF — zal, press-wall va rasmiy hujjatlar uchun tayyor.",
  },
  {
    icon: QrCode,
    title: "QR va tekshiruv",
    description:
      "Ro‘yxatga yozilish, kirish va sertifikat tekshiruvi uchun QR materiallar.",
  },
  {
    icon: Zap,
    title: "Tez ishlab chiqarish",
    description:
      "Dizayner kutmasdan — tadbir jamoasi o‘zi materiallarni soatlar ichida tayyorlaydi.",
  },
]

export function HomeValueProp() {
  return (
    <section className="border-y border-border bg-background py-16 md:py-24">
      <div className="gildia-container">
        <SectionHeader
          eyebrow="Nima uchun Gildia"
          title="Oddiy shablon sayti emas — tadbir dizayn operatsion tizimi"
          description="Gildia konferensiya va rasmiy tadbirlar uchun materiallarni yaratish, boshqarish va ommaviy chiqarish jarayonini birlashtiradi. Alohida dizayn mahsulotlari ham shu ekotizimda."
          align="center"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/25 hover:shadow-[var(--shadow-premium)]"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
