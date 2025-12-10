import { NextRequest } from 'next/server'
import { prisma } from './db'

export async function verifyApiToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.substring(7)
  
  try {
    const apiToken = await prisma.apiToken.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })
    
    if (!apiToken) {
      return null
    }
    
    // 最終使用日時を更新
    await prisma.apiToken.update({
      where: { id: apiToken.id },
      data: { lastUsedAt: new Date() },
    })
    
    return {
      id: apiToken.user.id,
      email: apiToken.user.email,
      name: apiToken.user.name ?? null,
    }
  } catch (error) {
    console.error('Error verifying API token:', error)
    return null
  }
}
