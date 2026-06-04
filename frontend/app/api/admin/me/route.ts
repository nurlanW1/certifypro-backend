import { NextResponse } from 'next/server'
import { isPlatformAdminEmail } from '@/lib/auth/platform-admin'
import { getOrCreateDbUser } from '@/lib/auth'

export async function GET() {
  const user = await getOrCreateDbUser()
  if (!user) {
    return NextResponse.json({ isAdmin: false })
  }
  return NextResponse.json({ isAdmin: isPlatformAdminEmail(user.email) })
}
