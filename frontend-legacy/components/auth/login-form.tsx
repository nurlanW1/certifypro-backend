"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { AuthDivider } from "@/components/auth/auth-divider"
import { AuthStatusAlert } from "@/components/auth/auth-status-alert"
import { PasswordInput } from "@/components/auth/password-input"
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { login } from "@/lib/api/auth"
import { getErrorMessage } from "@/lib/api/errors"
import { validateLogin, type FieldErrors } from "@/lib/auth/validation"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)
    const nextErrors = validateLogin({ email, password })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    try {
      const res = await login({ email: email.trim(), password })
      if (res.token && typeof window !== "undefined") {
        sessionStorage.setItem("gildia_auth_token", res.token)
      }
      router.push("/dashboard")
    } catch (err) {
      setApiError(getErrorMessage(err, "Kirish muvaffaqiyatsiz. Email yoki parolni tekshiring."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-premium)] sm:p-8">
      {apiError ? <AuthStatusAlert variant="error" title="Xatolik" message={apiError} /> : null}

      <SocialAuthButtons />
      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="login-email">Email</FieldLabel>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="siz@tashkilot.uz"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }))
            }}
            aria-invalid={!!errors.email}
            disabled={loading}
          />
          <FieldError>{errors.email}</FieldError>
        </Field>

        <Field data-invalid={!!errors.password}>
          <div className="flex items-center justify-between gap-2">
            <FieldLabel htmlFor="login-password">Parol</FieldLabel>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Parolni unutdingizmi?
            </Link>
          </div>
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) setErrors((prev) => ({ ...prev, password: "" }))
            }}
            aria-invalid={!!errors.password}
            disabled={loading}
          />
          <FieldError>{errors.password}</FieldError>
        </Field>

        <Button type="submit" variant="brand" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Kirilmoqda...
            </>
          ) : (
            "Kirish"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Hisobingiz yo‘qmi?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Ro‘yxatdan o‘tish
        </Link>
      </p>
    </div>
  )
}
