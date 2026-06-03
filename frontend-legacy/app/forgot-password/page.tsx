import type { Metadata } from "next"

import { AuthLayout } from "@/components/auth/auth-layout"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Parolni tiklash",
  description: "Gildia hisobingiz parolini tiklash uchun email kiriting.",
}

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Parolni unutdingizmi?"
      subtitle="Email manzilingizga parolni tiklash havolasini yuboramiz."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
