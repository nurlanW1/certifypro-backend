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
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { register } from "@/lib/api/auth"
import { getErrorMessage } from "@/lib/api/errors"
import { validateRegister, type FieldErrors } from "@/lib/auth/validation"

export function RegisterForm() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)
    const nextErrors = validateRegister({
      fullName,
      email,
      password,
      confirmPassword,
      acceptTerms,
    })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    try {
      await register({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
      })
      router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`)
    } catch (err) {
      setApiError(getErrorMessage(err, "Ro‘yxatdan o‘tish muvaffaqiyatsiz."))
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
        <Field data-invalid={!!errors.fullName}>
          <FieldLabel htmlFor="reg-name">To‘liq ism</FieldLabel>
          <Input
            id="reg-name"
            autoComplete="name"
            placeholder="Ism Familiya"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value)
              if (errors.fullName) setErrors((p) => ({ ...p, fullName: "" }))
            }}
            aria-invalid={!!errors.fullName}
            disabled={loading}
          />
          <FieldError>{errors.fullName}</FieldError>
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="reg-email">Email</FieldLabel>
          <Input
            id="reg-email"
            type="email"
            autoComplete="email"
            placeholder="siz@tashkilot.uz"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors((p) => ({ ...p, email: "" }))
            }}
            aria-invalid={!!errors.email}
            disabled={loading}
          />
          <FieldError>{errors.email}</FieldError>
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="reg-password">Parol</FieldLabel>
          <PasswordInput
            id="reg-password"
            autoComplete="new-password"
            placeholder="Kamida 8 belgi"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) setErrors((p) => ({ ...p, password: "" }))
            }}
            aria-invalid={!!errors.password}
            disabled={loading}
          />
          <FieldError>{errors.password}</FieldError>
        </Field>

        <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel htmlFor="reg-confirm">Parolni tasdiqlang</FieldLabel>
          <PasswordInput
            id="reg-confirm"
            autoComplete="new-password"
            placeholder="Parolni qayta kiriting"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: "" }))
            }}
            aria-invalid={!!errors.confirmPassword}
            disabled={loading}
          />
          <FieldError>{errors.confirmPassword}</FieldError>
        </Field>

        <Field data-invalid={!!errors.acceptTerms}>
          <label className="flex cursor-pointer items-start gap-3">
            <Checkbox
              checked={acceptTerms}
              onCheckedChange={(v) => {
                setAcceptTerms(v === true)
                if (errors.acceptTerms) setErrors((p) => ({ ...p, acceptTerms: "" }))
              }}
              disabled={loading}
              aria-invalid={!!errors.acceptTerms}
            />
            <span className="text-sm leading-snug text-muted-foreground">
              Men{" "}
              <Link href="/privacy" className="font-medium text-primary hover:underline">
                maxfiylik siyosati
              </Link>{" "}
              va foydalanish shartlariga roziman
            </span>
          </label>
          <FieldError>{errors.acceptTerms}</FieldError>
        </Field>

        <Button type="submit" variant="brand" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Yaratilmoqda...
            </>
          ) : (
            "Hisob yaratish"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Hisobingiz bormi?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Kirish
        </Link>
      </p>
    </div>
  )
}
