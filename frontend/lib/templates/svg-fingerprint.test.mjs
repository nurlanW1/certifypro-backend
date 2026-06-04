import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { svgStructureFingerprint, fingerprintsMatch } from './svg-fingerprint.ts'
import { buildBrandedTemplateSvg } from './branded-svg.ts'

describe('svgStructureFingerprint', () => {
  it('stable for same branded svg', () => {
    const svg = buildBrandedTemplateSvg({
      title: 'Test',
      category: 'CERTIFICATE',
    })
    const a = svgStructureFingerprint(svg)
    const b = svgStructureFingerprint(svg)
    assert.ok(fingerprintsMatch(a, b))
  })

  it('differs when variables removed', () => {
    const full = buildBrandedTemplateSvg({ title: 'A', category: 'CERTIFICATE' })
    const stripped = full.replace(/\{\{participantName\}\}/g, '')
    assert.notEqual(
      svgStructureFingerprint(full),
      svgStructureFingerprint(stripped)
    )
  })
})
