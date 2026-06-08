export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

import { getOrCreateDbUser } from '@/lib/auth'
import { getBillingMe } from '@/lib/billing/service'


export async function GET() {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const billing = await getBillingMe(user.id, user.plan)
    return NextResponse.json({ billing })
  } catch (error) {
    console.error('Billing me error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
