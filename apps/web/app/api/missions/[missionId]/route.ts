import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'

// GET /api/missions/[missionId]
export async function GET(
  request: Request,
  { params }: { params: { missionId: string } }
) {
  try {
    const user = await getCurrentUser()
    
    const mission = await prisma.mission.findUnique({
      where: { id: params.missionId },
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
    })
    
    if (!mission) {
      return NextResponse.json(
        { error: 'Mission not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ mission })
  } catch (error) {
    console.error('Error fetching mission:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mission' },
      { status: 500 }
    )
  }
}
