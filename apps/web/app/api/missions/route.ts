import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { getCurrentUser } from '../../../lib/session'
import { verifyApiToken } from '../../../lib/api-auth'

// GET /api/missions - 全ミッション取得
export async function GET(request: NextRequest) {
  try {
    // まずAPIトークンで認証を試みる
    let user = await verifyApiToken(request)
    
    // APIトークンがなければセッション認証を試みる
    if (!user) {
      const sessionUser = await getCurrentUser()
      if (sessionUser) {
        user = {
          id: sessionUser.id,
          email: sessionUser.email,
          name: sessionUser.name ?? null,
        }
      }
    }
    
    console.log('GET /api/missions - User:', user ? user.id : 'No user')
    
    const missions = await prisma.mission.findMany({
      where: { isPublished: true },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        ...(user && {
          userProgress: {
            where: { userId: user.id },
          },
        }),
      },
      orderBy: { order: 'asc' },
    })
    
    console.log(`Found ${missions.length} missions`)
    
    return NextResponse.json({ missions })
  } catch (error) {
    console.error('Error fetching missions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch missions' },
      { status: 500 }
    )
  }
}
