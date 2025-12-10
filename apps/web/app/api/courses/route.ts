import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'

// GET /api/courses - 全コース取得
export async function GET() {
  try {
    const user = await getCurrentUser()
    
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      include: {
        lessons: {
          where: { isPublished: true },
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            order: true,
          },
        },
        _count: {
          select: {
            lessons: true,
          },
        },
        ...(user && {
          userProgress: {
            where: { userId: user.id },
          },
        }),
      },
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json({ courses })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
