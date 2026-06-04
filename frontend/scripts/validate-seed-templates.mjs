/**
 * CI: seed SVG larida majburiy o‘zgaruvchilar borligini tekshirish.
 * npm run db:seed dan keyin yoki seed.mjs bilan bir xil qoidalarni qo‘llaydi.
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function validate(svg, id) {
  if (!svg?.includes('<svg')) throw new Error(`${id}: not svg`)
  if (!svg.includes('{{eventName}}')) throw new Error(`${id}: missing {{eventName}}`)
}

async function main() {
  const templates = await prisma.template.findMany({ select: { id: true, svgContent: true } })
  for (const t of templates) validate(t.svgContent, t.id)
  console.log(`Validated ${templates.length} templates`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
