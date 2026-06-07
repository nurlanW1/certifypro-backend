import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, '.next', 'static')
const dest = join(root, 'public', '_next', 'static')

if (!existsSync(src)) {
  console.warn('[copy-static] .next/static not found — skip')
  process.exit(0)
}

rmSync(dest, { recursive: true, force: true })
mkdirSync(join(root, 'public', '_next'), { recursive: true })
cpSync(src, dest, { recursive: true })
console.log('[copy-static] copied .next/static → public/_next/static')
