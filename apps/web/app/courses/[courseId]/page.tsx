import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function CoursePage({
  params,
}: {
  params: { courseId: string }
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login')
  }

  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: {
      lessons: {
        where: { isPublished: true },
        orderBy: { order: 'asc' },
        include: {
          userProgress: {
            where: { userId: session.user.id },
          },
        },
      },
      userProgress: {
        where: { userId: session.user.id },
      },
    },
  })

  if (!course) {
    redirect('/dashboard')
  }

  const missions = await prisma.mission.findMany({
    where: {
      courseId: course.id,
      isPublished: true,
    },
    include: {
      userProgress: {
        where: { userId: session.user.id },
      },
    },
    orderBy: { order: 'asc' },
  })

  // 進捗を計算
  const totalLessons = course.lessons.length
  const completedLessons = course.lessons.filter(
    (lesson) => lesson.userProgress[0]?.isCompleted
  ).length
  const totalMissions = missions.length
  const completedMissions = missions.filter(
    (mission) => mission.userProgress[0]?.status === 'COMPLETED'
  ).length
  const totalItems = totalLessons + totalMissions
  const completedItems = completedLessons + completedMissions
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  const courseProgress = course.userProgress[0]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダー */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ← ダッシュボード
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* コース情報 */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-blue-100 mb-6">{course.description}</p>

          {/* プログレスバー */}
          <div className="bg-white/20 rounded-full h-3 mb-2">
            <div
              className="bg-white h-3 rounded-full transition-all"
              style={{
                width: `${progressPercent}%`,
              }}
            />
          </div>
          <p className="text-sm text-blue-100">
            進捗: {progressPercent}% ({completedItems}/{totalItems} 完了)
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* レッスン一覧 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              📚 レッスン
            </h2>
            <div className="space-y-4">
              {course.lessons.map((lesson) => {
                const isCompleted = lesson.userProgress[0]?.isCompleted || false
                
                return (
                  <Link
                    key={lesson.id}
                    href={`/courses/${course.id}/lessons/${lesson.id}`}
                    className="block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                            {lesson.order}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {lesson.title}
                          </h3>
                          {isCompleted && (
                            <span className="text-green-600 dark:text-green-400">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {lesson.description}
                        </p>
                      </div>
                    <div className="ml-4">
                      {lesson.duration && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {lesson.duration}分
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              )
              })}
            </div>
          </div>

          {/* ミッション一覧 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🎯 ミッション
            </h2>
            <div className="space-y-4">
              {missions.map((mission) => {
                const progress = mission.userProgress[0]
                const isCompleted = progress?.status === 'COMPLETED'
                const isInProgress = progress?.status === 'IN_PROGRESS'

                return (
                  <Link
                    key={mission.id}
                    href={`/missions/${mission.id}`}
                    className="block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {isCompleted && (
                            <span className="text-green-500">✓</span>
                          )}
                          {isInProgress && (
                            <span className="text-yellow-500">⏳</span>
                          )}
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {mission.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                          {mission.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              mission.difficulty === 'BEGINNER'
                                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                : mission.difficulty === 'INTERMEDIATE'
                                ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                                : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                            }`}
                          >
                            {mission.difficulty === 'BEGINNER'
                              ? '初級'
                              : mission.difficulty === 'INTERMEDIATE'
                              ? '中級'
                              : '上級'}
                          </span>
                          {mission.estimatedTime && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              約{mission.estimatedTime}分
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
