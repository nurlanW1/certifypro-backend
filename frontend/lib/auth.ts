import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { isClerkConfigured } from '@/lib/clerk-config'
import { isGuestMode } from '@/lib/env'

const GUEST_CLERK_ID = 'gildia_guest'

async function getOrCreateGuestUser() {
  const email = process.env.GILDIA_GUEST_EMAIL?.trim() || 'mehmon@gildia.uz'
  const name = process.env.GILDIA_GUEST_NAME?.trim() || 'Mehmon'

  return prisma.user.upsert({
    where: { clerkId: GUEST_CLERK_ID },
    create: {
      clerkId: GUEST_CLERK_ID,
      email,
      name,
    },
    update: { name },
  })
}

export async function getOrCreateDbUser() {
  if (!isClerkConfigured()) {
    if (!isGuestMode()) return null
    try {
      return await getOrCreateGuestUser()
    } catch (error) {
      console.error('Guest user error:', error)
      return null
    }
  }

  const { userId } = auth()
  if (!userId) return null

  const clerkUser = await currentUser()
  if (!clerkUser) return null

  const email =
    clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)
      ?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress

  if (!email) return null

  return prisma.user.upsert({
    where: { clerkId: userId },
    create: {
      clerkId: userId,
      email,
      name: clerkUser.fullName ?? clerkUser.firstName ?? null,
    },
    update: {
      email,
      name: clerkUser.fullName ?? clerkUser.firstName ?? null,
    },
  })
}
