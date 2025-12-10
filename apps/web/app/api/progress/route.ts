import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { requireAuth } from '../../../lib/session'
import { verifyApiToken } from '../../../lib/api-auth'
import { z } from 'zod'

const progressSchema = z.object({
  missionId: z.string(),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'FAILED']),
  submittedCode: z.string().optional(),
  testResults: z.string().optional(),
  completedAt: z.string().optional(),
})

// GET /api/progress - ユーザーの全進捗取得
export async function GET(request: NextRequest) {
  try {
    // まずAPIトークンで認証を試みる
    let user = await verifyApiToken(request)
    
    // APIトークンがなければセッション認証を試みる
    if (!user) {
      const session = await requireAuth()
      user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name ?? null,
      }
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const progress = await prisma.userMissionProgress.findMany({
      where: { userId: user.id },
      include: {
        mission: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            order: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })
    
    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}

// POST /api/progress - 進捗の作成・更新
export async function POST(request: NextRequest) {
  try {
    // まずAPIトークンで認証を試みる
    let user = await verifyApiToken(request)
    
    // APIトークンがなければセッション認証を試みる
    if (!user) {
      const session = await requireAuth()
      user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name ?? null,
      }
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    
    const validatedData = progressSchema.parse(body)
    
    // 既存の進捗をチェック
    const existingProgress = await prisma.userMissionProgress.findUnique({
      where: {
        userId_missionId: {
          userId: user.id,
          missionId: validatedData.missionId,
        },
      },
    })
    
    let progress
    
    if (existingProgress) {
      // 更新
      progress = await prisma.userMissionProgress.update({
        where: {
          userId_missionId: {
            userId: user.id,
            missionId: validatedData.missionId,
          },
        },
        data: {
          status: validatedData.status,
          testResults: validatedData.testResults,
          ...(validatedData.status === 'IN_PROGRESS' && !existingProgress.startedAt && {
            startedAt: new Date(),
          }),
          ...(validatedData.status === 'COMPLETED' && {
            completedAt: validatedData.completedAt
              ? new Date(validatedData.completedAt)
              : new Date(),
          }),
          attemptCount: existingProgress.attemptCount + 1,
        },
        include: {
          mission: true,
        },
      })
    } else {
      // 新規作成
      progress = await prisma.userMissionProgress.create({
        data: {
          userId: user.id,
          missionId: validatedData.missionId,
          status: validatedData.status,
          testResults: validatedData.testResults,
          ...(validatedData.status === 'IN_PROGRESS' && {
            startedAt: new Date(),
          }),
          ...(validatedData.status === 'COMPLETED' && {
            completedAt: validatedData.completedAt
              ? new Date(validatedData.completedAt)
              : new Date(),
          }),
          attemptCount: 1,
        },
        include: {
          mission: true,
        },
      })
    }
    
    // コースの進捗を更新
    if (progress.mission.courseId) {
      await updateCourseProgress(user.id, progress.mission.courseId)
    }
    
    return NextResponse.json({ progress })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    
    console.error('Error updating progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}

// コース進捗を更新する補助関数
async function updateCourseProgress(userId: string, courseId: string) {
  // コースの全ミッション数を取得
  const totalMissions = await prisma.mission.count({
    where: { courseId, isPublished: true },
  })
  
  // 完了したミッション数を取得
  const completedMissions = await prisma.userMissionProgress.count({
    where: {
      userId,
      status: 'COMPLETED',
      mission: {
        courseId,
        isPublished: true,
      },
    },
  })
  
  const progressPercent =
    totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0
  
  // コース進捗を作成または更新
  await prisma.userCourseProgress.upsert({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    update: {
      completedMissions,
      totalMissions,
      progressPercent,
      lastAccessedAt: new Date(),
    },
    create: {
      userId,
      courseId,
      completedMissions,
      totalMissions,
      progressPercent,
      lastAccessedAt: new Date(),
    },
  })
}
