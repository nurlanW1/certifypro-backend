"use client"

import { useState } from "react"
import { toast } from "sonner"

import { ProductConceptStrip } from "@/components/marketing/product-concept-strip"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function VerifyPage() {
  const [certId, setCertId] = useState("")
  const [checking, setChecking] = useState(false)

  const handleVerify = () => {
    const trimmed = certId.trim()
    if (!trimmed) {
      toast.error("Sertifikat ID kiriting")
      return
    }
    setChecking(true)
    setTimeout(() => {
      setChecking(false)
      toast.message("Tekshiruv", {
        description:
          "Onlayn tekshiruv API ulanishi kutilmoqda. Hozircha ID qabul qilindi: " + trimmed,
      })
    }, 600)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <ProductConceptStrip context="Sertifikat va bejik tekshiruvi" />
      <div className="gildia-container max-w-2xl py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Tekshiruv markazi</h1>
        <p className="mt-2 text-muted-foreground">Sertifikat ID yoki QR orqali haqiqiylikni tekshiring</p>
        <div className="mt-8 space-y-4">
          <Card title="Sertifikat / bejik ID">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                placeholder="Masalan: CERT-2026-00125"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              />
              <Button onClick={handleVerify} disabled={checking}>
                {checking ? "Tekshirilmoqda…" : "Tekshirish"}
              </Button>
            </div>
          </Card>
          <Card title="Fayl yuklash">
            <p className="text-sm text-muted-foreground">
              PDF yoki rasm orqali tekshiruv (konferensiya ishtiroki) — tez orada.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
