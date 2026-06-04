import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { buildClaimUrl } from './claim-url.ts'

describe('buildClaimUrl', () => {
  it('encodes token in query', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://gildia.uz'
    const url = buildClaimUrl('abc+123')
    assert.ok(url.startsWith('https://gildia.uz/claim?token='))
    assert.ok(url.includes('abc'))
  })
})
