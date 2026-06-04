import { NextResponse } from 'next/server'
import { getEventAnalytics } from '@/lib/analytics/user-stats'
import { getOrCreateDbUser } from '@/lib/auth'

export async function GET(
  _req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const analytics = await getEventAnalytics(user.id, params.eventId)
    if (!analytics) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ analytics })
  } catch (error) {
    console.error('Event analytics error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
