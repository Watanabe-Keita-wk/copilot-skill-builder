import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Completing lesson:', params.lessonId, 'for user:', session.user.id)

    const lesson = await prisma.lesson.findUnique({
      where: { id: params.lessonId },
      include: { course: true },
    })

    if (!lesson) {
      console.error('Lesson not found:', params.lessonId)
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    console.log('Found lesson:', lesson.title, 'in course:', lesson.courseId)

    // レッスン進捗を記録
    console.log('Upserting lesson progress...')
    const lessonProgress = await prisma.userLessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId: params.lessonId,
        },
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
        lastAccessedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        lessonId: params.lessonId,
        isCompleted: true,
        completedAt: new Date(),
        lastAccessedAt: new Date(),
      },
    })
    console.log('Lesson progress updated:', lessonProgress.id)

    // コース進捗を更新
    const totalLessons = await prisma.lesson.count({
      where: {
        courseId: lesson.courseId,
        isPublished: true,
      },
    })

    const completedLessons = await prisma.userLessonProgress.count({
      where: {
        userId: session.user.id,
        lesson: {
          courseId: lesson.courseId,
        },
        isCompleted: true,
      },
    })

    const totalMissions = await prisma.mission.count({
      where: {
        courseId: lesson.courseId,
        isPublished: true,
      },
    })

    const completedMissions = await prisma.userMissionProgress.count({
      where: {
        userId: session.user.id,
        mission: {
          courseId: lesson.courseId,
        },
        status: 'COMPLETED',
      },
    })

    const totalItems = totalLessons + totalMissions
    const completedItems = completedLessons + completedMissions
    const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

    await prisma.userCourseProgress.upsert({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: lesson.courseId,
        },
      },
      update: {
        completedLessons,
        totalLessons,
        completedMissions,
        totalMissions,
        progressPercent,
        lastAccessedAt: new Date(),
        completedAt: progressPercent === 100 ? new Date() : null,
      },
      create: {
        userId: session.user.id,
        courseId: lesson.courseId,
        completedLessons,
        totalLessons,
        completedMissions,
        totalMissions,
        progressPercent,
      },
    })

    return NextResponse.json({
      success: true,
      lessonProgress,
      progressPercent,
    })
  } catch (error) {
    console.error('Lesson completion error:', error)
    
    // より詳細なエラー情報を出力
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { error: 'Failed to complete lesson', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
