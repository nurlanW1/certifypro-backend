export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

import { getAdminOverview } from '@/lib/admin/overview'
import { requirePlatformAdmin } from '@/lib/auth/platform-admin'


export async function GET() {
  try {
    const admin = await requirePlatformAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const overview = await getAdminOverview()
    return NextResponse.json({ overview })
  } catch (error) {
    console.error('Admin overview error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
