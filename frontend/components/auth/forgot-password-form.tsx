"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"

import { AuthStatusAlert } from "@/components/auth/auth-status-alert"
import { Button, LinkButton } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { forgotPassword } from "@/lib/api/auth"
import { getErrorMessage } from "@/lib/api/errors"
import { validateForgotPassword, type FieldErrors } from "@/lib/auth/validation"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)
    setSuccess(false)
    const nextErrors = validateForgotPassword({ email })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    try {
      await forgotPassword({ email: email.trim() })
      setSuccess(true)
    } catch (err) {
      const msg = getErrorMessage(err)
      if (msg.includes("404") || msg.includes("failed")) {
        setSuccess(true)
      } else {
        setApiError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-premium)] sm:p-8">
        <AuthStatusAlert
          variant="success"
          title="Email yuborildi"
          message={`Agar ${email.trim()} ro‘yxatdan o‘tgan bo‘lsa, parolni tiklash havolasi yuborildi. Spam papkasini ham tekshiring.`}
        />
        <LinkButton href="/login" variant="outline" className="mt-4 w-full">
          Kirish sahifasiga qaytish
        </LinkButton>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-premium)] sm:p-8">
      {apiError ? <AuthStatusAlert variant="error" title="Xatolik" message={apiError} /> : null}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="siz@tashkilot.uz"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors({})
            }}
            aria-invalid={!!errors.email}
            disabled={loading}
          />
          <FieldError>{errors.email}</FieldError>
        </Field>

        <Button type="submit" variant="brand" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Yuborilmoqda...
            </>
          ) : (
            "Tiklash havolasini yuborish"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-semibold text-primary hover:underline">
          ← Kirish sahifasiga
        </Link>
      </p>
    </div>
  )
}
