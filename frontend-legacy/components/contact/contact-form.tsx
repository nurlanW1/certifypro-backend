"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import { AuthStatusAlert } from "@/components/auth/auth-status-alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { validateEmail } from "@/lib/auth/validation"

type FormType = "support" | "business"

type FieldErrors = Record<string, string>

function validateContact(values: {
  name: string
  email: string
  subject: string
  message: string
}): FieldErrors {
  const errors: FieldErrors = {}
  if (!values.name.trim()) errors.name = "Ism majburiy"
  const emailErr = validateEmail(values.email)
  if (emailErr) errors.email = emailErr
  if (!values.subject.trim()) errors.subject = "Mavzu majburiy"
  if (!values.message.trim()) errors.message = "Xabar majburiy"
  else if (values.message.trim().length < 10) errors.message = "Xabar kamida 10 belgidan iborat bo‘lsin"
  return errors
}

type Props = {
  defaultType?: FormType
  idPrefix?: string
}

export function ContactForm({ defaultType = "support", idPrefix = "contact" }: Props) {
  const [formType, setFormType] = useState<FormType>(defaultType)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [organization, setOrganization] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validateContact({ name, email, subject, message })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <AuthStatusAlert
        variant="success"
        title="Xabar yuborildi"
        message="Tez orada javob beramiz. Shoshilinch savollar uchun Telegram orqali ham yozishingiz mumkin."
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Field>
        <FieldLabel>Murojaat turi</FieldLabel>
        <Select
          value={formType}
          onValueChange={(v) => setFormType((v as FormType) ?? "support")}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="support">Qo‘llab-quvvatlash</SelectItem>
            <SelectItem value="business">Biznes / hamkorlik</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor={`${idPrefix}-name`}>Ism</FieldLabel>
        <Input
          id={`${idPrefix}-name`}
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (errors.name) setErrors((p) => ({ ...p, name: "" }))
          }}
          placeholder="Ism Familiya"
          disabled={loading}
          aria-invalid={!!errors.name}
        />
        <FieldError>{errors.name}</FieldError>
      </Field>

      <Field data-invalid={!!errors.email}>
        <FieldLabel htmlFor={`${idPrefix}-email`}>Email</FieldLabel>
        <Input
          id={`${idPrefix}-email`}
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (errors.email) setErrors((p) => ({ ...p, email: "" }))
          }}
          placeholder="siz@tashkilot.uz"
          disabled={loading}
          aria-invalid={!!errors.email}
        />
        <FieldError>{errors.email}</FieldError>
      </Field>

      {formType === "business" ? (
        <Field>
          <FieldLabel htmlFor={`${idPrefix}-org`}>Tashkilot</FieldLabel>
          <Input
            id={`${idPrefix}-org`}
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="Universitet, agentlik, kompaniya"
            disabled={loading}
          />
        </Field>
      ) : null}

      <Field data-invalid={!!errors.subject}>
        <FieldLabel htmlFor={`${idPrefix}-subject`}>Mavzu</FieldLabel>
        <Input
          id={`${idPrefix}-subject`}
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value)
            if (errors.subject) setErrors((p) => ({ ...p, subject: "" }))
          }}
          placeholder={
            formType === "business"
              ? "Enterprise tarif, hamkorlik, maxsus shablonlar..."
              : "Hisob, eksport, texnik yordam..."
          }
          disabled={loading}
          aria-invalid={!!errors.subject}
        />
        <FieldError>{errors.subject}</FieldError>
      </Field>

      <Field data-invalid={!!errors.message}>
        <FieldLabel htmlFor={`${idPrefix}-message`}>Xabar</FieldLabel>
        <Textarea
          id={`${idPrefix}-message`}
          rows={4}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
            if (errors.message) setErrors((p) => ({ ...p, message: "" }))
          }}
          placeholder="Savolingizni batafsil yozing..."
          disabled={loading}
          aria-invalid={!!errors.message}
        />
        <FieldError>{errors.message}</FieldError>
      </Field>

      <Button type="submit" variant="brand" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Yuborilmoqda...
          </>
        ) : (
          "Xabar yuborish"
        )}
      </Button>
    </form>
  )
}
