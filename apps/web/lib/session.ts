import { auth } from './auth'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { prisma } from './db'

export async function requireAuth() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/login')
  }
  
  return session
}

export async function getCurrentUser() {
  const session = await auth()
  return session?.user || null
}

export async function verifyApiToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7) // Remove 'Bearer ' prefix

  try {
    const apiToken = await prisma.apiToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!apiToken || (apiToken.expiresAt && apiToken.expiresAt < new Date())) {
      return null
    }

    // Update last used timestamp
    await prisma.apiToken.update({
      where: { id: apiToken.id },
      data: { lastUsedAt: new Date() },
    })
    
    return {
      user: {
        id: apiToken.user.id,
        email: apiToken.user.email,
        name: apiToken.user.name ?? null,
      },
    }
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}
