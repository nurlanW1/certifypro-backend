import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { isClerkConfigured } from '@/lib/clerk-config'

export async function getOrCreateDbUser() {
  if (!isClerkConfigured()) return null

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
