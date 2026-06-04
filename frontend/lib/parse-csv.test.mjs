import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { parseParticipantsCsv } from './parse-csv.ts'

describe('parseParticipantsCsv', () => {
  it('parses header row', () => {
    const csv = 'name,email\nAli Valiyev,ali@test.com'
    const rows = parseParticipantsCsv(csv)
    assert.equal(rows.length, 1)
    assert.equal(rows[0].fullName, 'Ali Valiyev')
    assert.equal(rows[0].email, 'ali@test.com')
  })

  it('parses without header', () => {
    const csv = 'Bob\nCarol,c@x.com'
    const rows = parseParticipantsCsv(csv)
    assert.equal(rows.length, 2)
    assert.equal(rows[1].fullName, 'Carol')
  })
})
