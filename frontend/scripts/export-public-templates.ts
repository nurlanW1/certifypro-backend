/**
 * Export all mock templates as static SVG files under public/templates/.
 * Run: npm run templates:export
 */
import fs from 'node:fs'
import path from 'node:path'
import { MOCK_TEMPLATES } from '../lib/mock-templates'
import { generateTemplateSvg } from '../lib/templates/generate-template-svg'
import { applyTemplateVariables } from '../lib/templates/template-variables'

const outDir = path.join(process.cwd(), 'public', 'templates')

function main() {
  fs.mkdirSync(outDir, { recursive: true })

  let count = 0
  for (const mock of MOCK_TEMPLATES) {
    const categoryDir = path.join(outDir, mock.category.toLowerCase())
    fs.mkdirSync(categoryDir, { recursive: true })

    const raw = generateTemplateSvg({
      id: mock.id,
      name: mock.nameUz ?? mock.name,
      category: mock.category,
      tags: mock.tags,
      isPremium: mock.isPremium,
    })
    const svg = applyTemplateVariables(raw)
    const filePath = path.join(categoryDir, `${mock.id}.svg`)
    fs.writeFileSync(filePath, svg, 'utf8')
    count++
  }

  console.log(`Exported ${count} templates to ${outDir}`)
}

main()
