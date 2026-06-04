import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function brandedSvg(title, category) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#f8f7ff"/>
  <rect x="40" y="40" width="720" height="520" rx="12" fill="none" stroke="#534AB7" stroke-width="4"/>
  <text x="400" y="120" text-anchor="middle" font-size="28" fill="#26215C">${title}</text>
  <text x="400" y="220" text-anchor="middle" font-size="22" fill="#333">{{eventName}}</text>
  <text x="400" y="280" text-anchor="middle" font-size="18" fill="#555">{{participantName}}</text>
  <text x="400" y="340" text-anchor="middle" font-size="16" fill="#666">{{organization}}</text>
  <text x="400" y="400" text-anchor="middle" font-size="14" fill="#888">{{date}} · {{location}}</text>
  <text x="400" y="520" text-anchor="middle" font-size="11" fill="#aaa">${category}</text>
</svg>`
}

/** Core templates for production (subset of mock catalog). */
const SEED_TEMPLATES = [
  { id: 'cert-001', name: 'Klassik Sertifikat', nameUz: 'Klassik Sertifikat', category: 'CERTIFICATE', isPremium: false, tags: ['klassik', 'sertifikat'] },
  { id: 'cert-002', name: 'Zamonaviy Sertifikat', nameUz: 'Zamonaviy Sertifikat', category: 'CERTIFICATE', isPremium: false, tags: ['zamonaviy'] },
  { id: 'badge-001', name: 'Standart Nishon', nameUz: 'Standart Nishon', category: 'BADGE', isPremium: false, tags: ['nishon'] },
  { id: 'invite-001', name: 'Taklifnoma', nameUz: 'Taklifnoma', category: 'INVITATION', isPremium: false, tags: ['taklif'] },
  { id: 'flyer-001', name: 'Flayer', nameUz: 'Flayer', category: 'FLYER', isPremium: false, tags: ['flayer'] },
  { id: 'poster-001', name: 'Poster', nameUz: 'Poster', category: 'POSTER', isPremium: false, tags: ['poster'] },
  { id: 'program-001', name: 'Dastur', nameUz: 'Dastur kitobchasi', category: 'PROGRAM_BOOK', isPremium: false, tags: ['dastur'] },
  { id: 'rollup-001', name: 'Roll-up', nameUz: 'Roll-up', category: 'ROLL_UP', isPremium: true, tags: ['banner'] },
  { id: 'social-001', name: 'Ijtimoiy post', nameUz: 'Ijtimoiy tarmoq', category: 'SOCIAL_MEDIA', isPremium: false, tags: ['social'] },
  { id: 'nametag-001', name: 'Ism tag', nameUz: 'Ism tag', category: 'NAME_TAG', isPremium: false, tags: ['tag'] },
  { id: 'press-001', name: 'Press devor', nameUz: 'Press devor', category: 'PRESS_WALL', isPremium: true, tags: ['press'] },
  { id: 'nav-001', name: 'Yo‘naltirish', nameUz: 'Navigatsiya', category: 'NAVIGATION', isPremium: false, tags: ['nav'] },
]

async function main() {
  for (const t of SEED_TEMPLATES) {
    const svgContent = brandedSvg(t.nameUz ?? t.name, t.category)
    if (!svgContent.includes('{{eventName}}')) {
      throw new Error(`Seed SVG invalid: ${t.id}`)
    }
    await prisma.template.upsert({
      where: { id: t.id },
      create: {
        id: t.id,
        name: t.name,
        nameUz: t.nameUz,
        category: t.category,
        isPremium: t.isPremium,
        previewUrl: '',
        svgContent,
        tags: t.tags,
      },
      update: {
        name: t.name,
        nameUz: t.nameUz,
        category: t.category,
        isPremium: t.isPremium,
        svgContent,
        tags: t.tags,
      },
    })
  }
  console.log(`Seeded ${SEED_TEMPLATES.length} templates (branded SVG + variables)`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
