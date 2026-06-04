import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { validateTemplateSvg } from './validate-svg.ts'
import { buildBrandedTemplateSvg } from './branded-svg.ts'

describe('validateTemplateSvg', () => {
  it('accepts branded certificate svg', () => {
    const svg = buildBrandedTemplateSvg({
      title: 'Sertifikat',
      category: 'CERTIFICATE',
    })
    const r = validateTemplateSvg(svg, 'CERTIFICATE')
    assert.equal(r.valid, true)
    assert.equal(r.errors.length, 0)
  })

  it('rejects empty svg', () => {
    const r = validateTemplateSvg('')
    assert.equal(r.valid, false)
    assert.ok(r.errors.length > 0)
  })

  it('rejects svg without eventName variable', () => {
    const r = validateTemplateSvg('<svg xmlns="http://www.w3.org/2000/svg"></svg>')
    assert.equal(r.valid, false)
  })
})
