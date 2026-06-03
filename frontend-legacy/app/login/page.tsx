import type { Metadata } from "next"

import { AuthLayout } from "@/components/auth/auth-layout"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Kirish",
  description: "Gildia hisobingizga kiring — tadbir materiallari va dizayn workspace.",
}

export default function LoginPage() {
  return (
    <AuthLayout
      title="Xush kelibsiz"
      subtitle="Event workspace, shablonlar va dizaynlaringizga kiring."
    >
      <LoginForm />
    </AuthLayout>
  )
}
