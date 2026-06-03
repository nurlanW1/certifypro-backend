import type { Metadata } from "next"

import { AuthLayout } from "@/components/auth/auth-layout"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Ro‘yxatdan o‘tish",
  description: "Gildia’da bepul hisob yarating — sertifikat, bejik va tadbir materiallari.",
}

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Bepul boshlang"
      subtitle="Birinchi tadbir materiallaringizni bir necha daqiqada yarating."
    >
      <RegisterForm />
    </AuthLayout>
  )
}
