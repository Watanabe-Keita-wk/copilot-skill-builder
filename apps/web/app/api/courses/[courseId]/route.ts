import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'

// GET /api/courses/[courseId]
export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await getCurrentUser()
    
    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
      include: {
        lessons: {
          where: { isPublished: true },
          orderBy: { order: 'asc' },
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
    })
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ course })
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}
