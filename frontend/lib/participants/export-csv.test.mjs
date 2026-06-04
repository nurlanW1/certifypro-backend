import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { buildParticipantsCsv } from './export-csv.ts'

describe('buildParticipantsCsv', () => {
  it('includes header and escaped names', () => {
    const csv = buildParticipantsCsv([
      {
        fullName: 'Ali, Valiyev',
        email: 'a@test.uz',
        organization: null,
        role: null,
        hasClaimLink: true,
        emailSent: false,
      },
    ])
    assert.ok(csv.startsWith('fullName,email'))
    assert.ok(csv.includes('"Ali, Valiyev"'))
  })
})
