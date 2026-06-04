import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { generateEventSuggestions } from './suggestions.ts'

describe('generateEventSuggestions', () => {
  it('returns uz invitation', () => {
    const s = generateEventSuggestions({
      name: 'AI Forum',
      type: 'CONFERENCE',
      date: '2025-06-01T00:00:00.000Z',
      location: 'IT Park',
      organization: 'Gildia',
      language: 'uz',
    })
    assert.ok(s.invitation.includes('AI Forum'))
    assert.ok(s.agenda.length >= 3)
  })
})
