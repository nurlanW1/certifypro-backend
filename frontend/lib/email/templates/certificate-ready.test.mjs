import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { buildCertificateReadyEmail } from './certificate-ready.ts'

describe('buildCertificateReadyEmail', () => {
  it('includes claim url and names', () => {
    const { subject, html } = buildCertificateReadyEmail({
      participantName: 'Ali Valiyev',
      eventName: 'IT Forum 2026',
      claimUrl: 'https://gildia.uz/claim?token=abc',
    })
    assert.ok(subject.includes('IT Forum'))
    assert.ok(html.includes('Ali Valiyev'))
    assert.ok(html.includes('claim?token=abc'))
  })
})
