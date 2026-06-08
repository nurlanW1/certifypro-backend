import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, '.next', 'static')
const dest = join(root, 'public', 'static')

if (!existsSync(src)) {
  if (existsSync(dest) && readdirSync(dest).length > 0) {
    console.log('[copy-static] .next/static missing — keeping existing public/static')
    process.exit(0)
  }
  console.error('[copy-static] ERROR: .next/static not found and public/static is empty')
  process.exit(1)
}

mkdirSync(join(root, 'public'), { recursive: true })
cpSync(src, dest, { recursive: true, force: true })

const cssDir = join(dest, 'css')
const cssFiles = existsSync(cssDir) ? readdirSync(cssDir).filter((f) => f.endsWith('.css')) : []
if (cssFiles.length === 0) {
  console.error('[copy-static] ERROR: no CSS files copied to public/static')
  process.exit(1)
}

console.log(`[copy-static] copied .next/static → public/static (${cssFiles.length} css file(s))`)
