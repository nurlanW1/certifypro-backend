"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import { AuthStatusAlert } from "@/components/auth/auth-status-alert"
import { Button } from "@/components/ui/button"
import { Field, FieldError } from "@/components/ui/field"
import { resendVerification, verifyEmail } from "@/lib/api/auth"
import { getErrorMessage } from "@/lib/api/errors"
import { validateVerifyCode } from "@/lib/auth/validation"
import { cn } from "@/lib/utils"

const OTP_LENGTH = 6

export function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? ""

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""))
  const [codeError, setCodeError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(30)
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = window.setTimeout(() => setResendCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  const code = digits.join("")

  const setHiddenAndValidate = useCallback((next: string[]) => {
    setDigits(next)
    if (codeError) setCodeError(null)
  }, [codeError])

  const focusAt = (idx: number) => {
    inputsRef.current[idx]?.focus()
  }

  const handleChange = (idx: number, value: string) => {
    const v = value.replace(/\D/g, "").slice(-1)
    const next = [...digits]
    next[idx] = v
    setHiddenAndValidate(next)
    if (v && idx < OTP_LENGTH - 1) focusAt(idx + 1)
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[idx]) {
        const next = [...digits]
        next[idx] = ""
        setHiddenAndValidate(next)
        return
      }
      if (idx > 0) {
        const next = [...digits]
        next[idx - 1] = ""
        setHiddenAndValidate(next)
        focusAt(idx - 1)
      }
    }
    if (e.key === "ArrowLeft" && idx > 0) {
      e.preventDefault()
      focusAt(idx - 1)
    }
    if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1) {
      e.preventDefault()
      focusAt(idx + 1)
    }
  }

  const handlePaste = (idx: number, e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH - idx)
    if (text.length <= 1) return
    e.preventDefault()
    const next = [...digits]
    let i = idx
    for (const d of text) {
      if (i >= OTP_LENGTH) break
      next[i] = d
      i += 1
    }
    setHiddenAndValidate(next)
    focusAt(Math.min(i, OTP_LENGTH - 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)
    const err = validateVerifyCode(code)
    if (err) {
      setCodeError(err)
      return
    }
    if (!email) {
      setApiError("Email topilmadi. Qaytadan ro‘yxatdan o‘ting.")
      return
    }

    setLoading(true)
    try {
      const res = await verifyEmail({ email, code })
      if (res.token && typeof window !== "undefined") {
        sessionStorage.setItem("gildia_auth_token", res.token)
      }
      setSuccess(true)
      window.setTimeout(() => router.push("/dashboard"), 1500)
    } catch (err) {
      setApiError(getErrorMessage(err, "Kod noto‘g‘ri yoki muddati o‘tgan."))
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email || resendCooldown > 0) return
    setResending(true)
    setApiError(null)
    try {
      await resendVerification(email)
      setResendCooldown(30)
    } catch (err) {
      setApiError(getErrorMessage(err, "Kodni qayta yuborib bo‘lmadi."))
    } finally {
      setResending(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-premium)] sm:p-8">
        <AuthStatusAlert
          variant="success"
          title="Email tasdiqlandi"
          message="Hisobingiz faollashtirildi. Dashboardga yo‘naltirilmoqdasiz..."
        />
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-premium)] sm:p-8">
      {apiError ? <AuthStatusAlert variant="error" title="Xatolik" message={apiError} /> : null}

      {email ? (
        <p className="mb-6 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{email}</span> manziliga 6 xonali kod
          yuborildi.
        </p>
      ) : (
        <AuthStatusAlert
          variant="error"
          title="Email yo‘q"
          message="Ro‘yxatdan o‘tish sahifasiga qayting."
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <Field data-invalid={!!codeError}>
          <div className="flex justify-center gap-2 sm:gap-3">
            {digits.map((d, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputsRef.current[idx] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                autoComplete={idx === 0 ? "one-time-code" : "off"}
                aria-label={`Kod ${idx + 1}`}
                value={d}
                disabled={loading || !email}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={(e) => handlePaste(idx, e)}
                className={cn(
                  "size-11 rounded-xl border border-input bg-background text-center text-lg font-semibold tabular-nums shadow-sm outline-none transition",
                  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30",
                  "disabled:opacity-50",
                  codeError && "border-destructive ring-destructive/20"
                )}
              />
            ))}
          </div>
          <FieldError className="text-center">{codeError}</FieldError>
        </Field>

        <Button type="submit" variant="brand" className="w-full" disabled={loading || !email}>
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Tekshirilmoqda...
            </>
          ) : (
            "Emailni tasdiqlash"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <button
          type="button"
          disabled={resendCooldown > 0 || resending || !email}
          onClick={handleResend}
          className="font-semibold text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resending
            ? "Yuborilmoqda..."
            : resendCooldown > 0
              ? `Qayta yuborish (${resendCooldown}s)`
              : "Kodni qayta yuborish"}
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-semibold text-primary hover:underline">
          ← Kirish sahifasiga
        </Link>
      </p>
    </div>
  )
}
