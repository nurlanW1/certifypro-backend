export type FieldErrors = Record<string, string>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): string | null {
  const v = email.trim()
  if (!v) return "Email majburiy"
  if (!EMAIL_RE.test(v)) return "To‘g‘ri email kiriting"
  return null
}

export function validatePassword(password: string, min = 8): string | null {
  if (!password) return "Parol majburiy"
  if (password.length < min) return `Parol kamida ${min} belgidan iborat bo‘lishi kerak`
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return "Parol harf va raqamdan iborat bo‘lishi kerak"
  }
  return null
}

export function validateLogin(values: { email: string; password: string }): FieldErrors {
  const errors: FieldErrors = {}
  const emailErr = validateEmail(values.email)
  if (emailErr) errors.email = emailErr
  if (!values.password.trim()) errors.password = "Parol majburiy"
  return errors
}

export function validateRegister(values: {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}): FieldErrors {
  const errors: FieldErrors = {}
  if (!values.fullName.trim()) errors.fullName = "Ism majburiy"
  else if (values.fullName.trim().length < 2) errors.fullName = "Ism juda qisqa"

  const emailErr = validateEmail(values.email)
  if (emailErr) errors.email = emailErr

  const passErr = validatePassword(values.password)
  if (passErr) errors.password = passErr

  if (!values.confirmPassword) errors.confirmPassword = "Parolni tasdiqlang"
  else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Parollar mos kelmaydi"
  }

  if (!values.acceptTerms) errors.acceptTerms = "Foydalanish shartlarini qabul qiling"
  return errors
}

export function validateForgotPassword(values: { email: string }): FieldErrors {
  const errors: FieldErrors = {}
  const emailErr = validateEmail(values.email)
  if (emailErr) errors.email = emailErr
  return errors
}

export function validateVerifyCode(code: string): string | null {
  const digits = code.replace(/\D/g, "")
  if (digits.length !== 6) return "6 xonali kodni kiriting"
  return null
}
