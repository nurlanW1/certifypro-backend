/**
 * Vizual diff o‘rniga strukturaviy "fingerprint" — CI da shablon regressiyasini ushlash.
 */
export function svgStructureFingerprint(svgContent: string): string {
  const normalized = svgContent.replace(/\s+/g, ' ').trim()
  const variables = [...normalized.matchAll(/\{\{[^}]+\}\}/gi)]
    .map((m) => m[0].toLowerCase())
    .sort()
    .join('|')
  const elements = [...normalized.matchAll(/<([a-z][a-z0-9]*)/gi)]
    .map((m) => m[1].toLowerCase())
    .filter((tag) => tag !== 'svg')
    .sort()
    .join('|')
  const sizeBucket = Math.floor(normalized.length / 100)
  return `v:${variables}#e:${elements}#s:${sizeBucket}`
}

export function fingerprintsMatch(a: string, b: string): boolean {
  return a === b
}
