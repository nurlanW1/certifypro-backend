import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { buildOrgInviteEmail } from './org-invite.ts'

describe('buildOrgInviteEmail', () => {
  it('includes accept url and org name', () => {
    const { subject, html, text } = buildOrgInviteEmail({
      organizationName: 'Test Agency',
      acceptUrl: 'https://gildia.uz/invite?token=abc',
      role: 'MEMBER',
      expiresAt: new Date('2026-06-10'),
    })
    assert.ok(subject.includes('Test Agency'))
    assert.ok(html.includes('invite?token=abc'))
    assert.ok(text.includes('Test Agency'))
  })
})
