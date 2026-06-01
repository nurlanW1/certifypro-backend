"use client"

import { useState } from "react"
import { toast } from "sonner"

import { ProductConceptStrip } from "@/components/marketing/product-concept-strip"
import { SectionHeader } from "@/components/ui/card"
import { Button, LinkButton } from "@/components/ui/button"
import { QR_TYPES, QR_OPTIONS } from "@/lib/constants/product"

export default function QrGeneratorPage() {
  const [selectedType, setSelectedType] = useState(QR_TYPES[0])
  const [payload, setPayload] = useState("https://gildia.uz")
  const [generating, setGenerating] = useState(false)

  const typeLabels: Record<string, string> = {
    "Event registration QR": "Tadbir ro‘yxatga yozilish QR",
    "Attendance QR": "Davomat QR",
    "Certificate verification QR": "Sertifikat tekshiruv QR",
    "Website QR": "Veb-sayt QR",
    "Speaker profile QR": "Speaker profil QR",
    "Ticket QR": "Chipta QR",
  }

  const handleGenerate = () => {
    const trimmed = payload.trim()
    if (!trimmed) {
      toast.error("URL yoki matn kiriting")
      return
    }
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      toast.success("QR ko‘rinishi yangilandi", {
        description: `${typeLabels[selectedType] || selectedType}: ${trimmed}`,
      })
    }, 500)
  }

  return (
    <div className="min-h-full bg-muted/20">
      <ProductConceptStrip context="Tadbir QR kodlari — ro‘yxat, davomat, tekshiruv" />
      <div className="gildia-container py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="QR Generator"
              title="Tadbir materiallariga QR qo‘shish"
              description="Ro‘yxatga yozilish, davomat, sertifikat tekshiruvi va chiptalar uchun QR yarating."
              align="left"
            />
            <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">QR turi</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {QR_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedType(t)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                    selectedType === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {typeLabels[t] || t}
                </button>
              ))}
            </div>
            <p className="mb-2 mt-6 text-xs font-semibold uppercase text-muted-foreground">Sozlamalar</p>
            <div className="flex flex-wrap gap-2">
              {QR_OPTIONS.map((o) => (
                <span
                  key={o}
                  className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
                >
                  {o}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <p className="text-sm font-semibold text-muted-foreground">
              Tanlangan: {typeLabels[selectedType] || selectedType}
            </p>
            <div className="mx-auto my-6 flex aspect-square max-w-[200px] items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5">
              <div className="grid grid-cols-5 gap-0.5 p-3">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-5 w-5 ${i % 2 === 0 ? "bg-foreground" : "bg-transparent"}`}
                  />
                ))}
              </div>
            </div>
            <input
              className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm"
              placeholder="URL yoki matn"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
            />
            <div className="mt-4 flex flex-col gap-2">
              <Button className="w-full" onClick={handleGenerate} disabled={generating}>
                {generating ? "Yaratilmoqda…" : "QR yaratish"}
              </Button>
              <Button variant="outline" className="w-full" size="sm" disabled>
                PNG yuklab olish
              </Button>
              <Button variant="outline" className="w-full" size="sm" disabled>
                SVG yuklab olish
              </Button>
              <LinkButton href="/editor" variant="outline" className="w-full" size="sm">
                Joriy dizaynga biriktirish
              </LinkButton>
            </div>
            <p className="mt-4 text-[10px] text-muted-foreground">
              PNG/SVG eksport server API ulanishi bilan yoqiladi.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
