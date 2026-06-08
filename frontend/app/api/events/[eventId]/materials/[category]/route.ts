export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateDbUser } from '@/lib/auth'
import { getBillingMe, billingError } from '@/lib/billing/service'
import { startEventMaterialDesign, resolveTemplateMeta } from '@/lib/event-design'
import { mapEventMaterial } from '@/lib/events-api'
import type { MaterialCategory } from '@/types/event'


const VALID_CATEGORIES = new Set<string>([
  'CERTIFICATE',
  'BADGE',
  'INVITATION',
  'FLYER',
  'POSTER',
  'SCIENTIFIC_POSTER',
  'PROGRAM_BOOK',
  'ROLL_UP',
  'PRESS_WALL',
  'STAGE_BACKDROP',
  'LED_SCREEN',
  'TABLE_TENT',
  'NAVIGATION',
  'SOCIAL_MEDIA',
  'EMAIL_BANNER',
  'SOUVENIR',
  'NAME_TAG',
  'SPONSOR_BANNER',
])

export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string; category: string } }

) {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const category = params.category.toUpperCase()
    if (!VALID_CATEGORIES.has(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    const body = (await req.json()) as { templateId?: string }
    if (!body.templateId) {
      return NextResponse.json({ error: 'templateId required' }, { status: 400 })
    }

    const billing = await getBillingMe(user.id, user.plan)
    if (!billing.canCreateDesign) {
      const err = billingError(
        'PLAN_LIMIT_DESIGNS',
        'Dizaynlar limiti tugadi. Pro rejimga o‘ting.',
        402
      )
      return NextResponse.json(err.body, { status: err.status })
    }

    const templateMeta = await resolveTemplateMeta(body.templateId)
    if (templateMeta?.isPremium && !billing.canUsePremiumTemplate) {
      const err = billingError(
        'PLAN_PREMIUM_REQUIRED',
        'Bu shablon Pro rejimda mavjud.',
        402
      )
      return NextResponse.json(err.body, { status: err.status })
    }

    const result = await startEventMaterialDesign({
      userId: user.id,
      eventId: params.eventId,
      category: category as MaterialCategory,
      templateId: body.templateId,
    })

    if ('error' in result) {
      const status =
        result.error === 'not_found'
          ? 404
          : result.error === 'category_mismatch'
            ? 400
            : 400
      const message =
        result.error === 'not_found'
          ? 'Tadbir topilmadi'
          : result.error === 'material_not_in_event'
            ? 'Bu material tadbir ro‘yxatida yo‘q'
            : 'Shablon kategoriyasi mos emas'
      return NextResponse.json({ error: message }, { status })
    }

    const { design, material } = result

    return NextResponse.json({
      design: {
        id: design.id,
        name: design.name,
        templateId: design.templateId,
        eventId: design.eventId,
      },
      material: mapEventMaterial(material),
    })
  } catch (error) {
    console.error('Start design error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
