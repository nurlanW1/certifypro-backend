export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim())
}

export function getEmailFrom(): string {
  return process.env.EMAIL_FROM?.trim() || 'Gildia <onboarding@resend.dev>'
}
