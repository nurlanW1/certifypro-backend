import { Suspense } from "react"
import type { Metadata } from "next"

import { AuthLayout } from "@/components/auth/auth-layout"
import { VerifyEmailForm } from "@/components/auth/verify-email-form"

export const metadata: Metadata = {
  title: "Emailni tasdiqlash",
  description: "Gildia hisobingizni faollashtirish uchun email kodini kiriting.",
}

function VerifyEmailContent() {
  return (
    <AuthLayout
      title="Emailni tasdiqlang"
      subtitle="Xavfsizlik uchun emailingizga yuborilgan 6 xonali kodni kiriting."
    >
      <VerifyEmailForm />
    </AuthLayout>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
          Yuklanmoqda...
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
