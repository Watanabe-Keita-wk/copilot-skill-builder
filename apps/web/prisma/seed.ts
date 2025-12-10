import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { coursesData } from './seed-data/courses'
import { phase1Lessons, phase1Missions } from './seed-data/phase1'
import { phase2Lessons, phase2Missions } from './seed-data/phase2'
import { phase3Lessons, phase3Missions } from './seed-data/phase3'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // テストユーザー作成
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
    },
  })

  console.log('✅ Created test user:', user.email)

  // コース作成とコンテンツのシード
  for (let i = 0; i < coursesData.length; i++) {
    const courseData = coursesData[i]
    
    // コース作成
    const course = await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: {},
      create: {
        title: courseData.title,
        description: courseData.description,
        slug: courseData.slug,
        difficulty: courseData.difficulty,
        order: courseData.order,
        isPublished: true,
      },
    })

    console.log(`✅ Created course: ${course.title}`)

    // 各フェーズのレッスンとミッションを作成
    if (i === 0) {
      // Phase 1
      await createLessons(course.id, phase1Lessons)
      await createMissions(course.id, phase1Missions)
    } else if (i === 1) {
      // Phase 2
      await createLessons(course.id, phase2Lessons)
      await createMissions(course.id, phase2Missions)
    } else if (i === 2) {
      // Phase 3
      await createLessons(course.id, phase3Lessons)
      await createMissions(course.id, phase3Missions)
    }
  }

  console.log('🎉 Seed completed successfully!')
}

async function createLessons(courseId: string, lessons: any[]) {
  for (const lessonData of lessons) {
    await prisma.lesson.create({
      data: {
        ...lessonData,
        courseId,
        isPublished: true,
      },
    })
    console.log(`✅ Created lesson: ${lessonData.title}`)
  }
}

async function createMissions(courseId: string, missions: any[]) {
  for (const missionData of missions) {
    await prisma.mission.create({
      data: {
        ...missionData,
        courseId,
        isPublished: true,
        dependencies: '[]',
      },
    })
    console.log(`✅ Created mission: ${missionData.title}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
