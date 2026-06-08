export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

import { getUserAnalytics } from '@/lib/analytics/user-stats'
import { getOrCreateDbUser } from '@/lib/auth'


export async function GET() {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const analytics = await getUserAnalytics(user.id, user.plan)
    return NextResponse.json({ analytics })
  } catch (error) {
    console.error('Analytics me error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
