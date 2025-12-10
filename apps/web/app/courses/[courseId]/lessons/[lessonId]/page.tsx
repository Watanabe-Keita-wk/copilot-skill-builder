import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { LessonCompleteButton } from '@/components/LessonCompleteButton'

export default async function LessonPage({
  params,
}: {
  params: { courseId: string; lessonId: string }
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login')
  }

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: params.lessonId,
      courseId: params.courseId,
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
        },
      },
      userProgress: {
        where: { userId: session.user.id },
      },
    },
  })

  if (!lesson) {
    redirect(`/courses/${params.courseId}`)
  }

  const isCompleted = lesson.userProgress[0]?.isCompleted || false

  // 前後のレッスンを取得
  const [prevLesson, nextLesson] = await Promise.all([
    prisma.lesson.findFirst({
      where: {
        courseId: params.courseId,
        order: { lt: lesson.order },
        isPublished: true,
      },
      orderBy: { order: 'desc' },
    }),
    prisma.lesson.findFirst({
      where: {
        courseId: params.courseId,
        order: { gt: lesson.order },
        isPublished: true,
      },
      orderBy: { order: 'asc' },
    }),
  ])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダー */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/courses/${params.courseId}`}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ← {lesson.course.title}
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* レッスンヘッダー */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold">
              {lesson.order}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {lesson.title}
            </h1>
          </div>
          {lesson.description && (
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {lesson.description}
            </p>
          )}
          {lesson.duration && (
            <div className="flex items-center gap-2 mt-4">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-gray-600 dark:text-gray-400">
                約{lesson.duration}分
              </span>
            </div>
          )}
        </div>

        {/* レッスンコンテンツ */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-8 prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-h1:text-3xl prose-h1:border-b prose-h1:border-gray-200 dark:prose-h1:border-gray-700 prose-h1:pb-4 prose-h1:mb-6 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-l-4 prose-h2:border-blue-500 prose-h2:pl-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-blue-600 dark:prose-h3:text-blue-400 prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2 prose-h4:font-semibold prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:shadow-lg prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-950/30 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic prose-ul:space-y-2 prose-ol:space-y-2 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:marker:text-blue-500">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '')
                  const inline = !match
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-lg shadow-md my-6"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
                h1: ({ children }) => (
                  <h1 className="flex items-center gap-3">
                    <span className="text-4xl">📚</span>
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="flex items-center gap-3">
                    <span className="text-2xl">📖</span>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="flex items-center gap-2">
                    <span className="text-xl">▸</span>
                    {children}
                  </h3>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-2 my-4">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="space-y-2 my-4">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1.5">•</span>
                    <span className="flex-1">{children}</span>
                  </li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="relative my-6">
                    <div className="absolute -left-1 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
                    {children}
                  </blockquote>
                ),
                p: ({ children }) => {
                  const text = String(children)
                  // ❌ や ✅ などの絵文字で始まる段落を特別にスタイリング
                  if (text.startsWith('❌') || text.startsWith('✅')) {
                    return (
                      <p className="flex items-start gap-2 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg my-3">
                        {children}
                      </p>
                    )
                  }
                  return <p>{children}</p>
                },
                table: ({ children }) => (
                  <div className="overflow-x-auto my-6 shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-gray-50 dark:bg-gray-900">{children}</thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {children}
                  </tbody>
                ),
                th: ({ children }) => (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    {children}
                  </td>
                ),
              }}
            >
              {lesson.content}
            </ReactMarkdown>
          </div>

          {lesson.videoUrl && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                📹 ビデオレッスン
              </h3>
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">
                  ビデオプレイヤー（実装予定）
                </p>
              </div>
            </div>
          )}
        </div>

        {/* レッスン完了ボタン */}
        <div className="my-8 flex justify-center">
          <LessonCompleteButton lessonId={lesson.id} isCompleted={isCompleted} />
        </div>

        {/* ナビゲーション */}
        <div className="flex justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-700">
          {prevLesson ? (
            <Link
              href={`/courses/${params.courseId}/lessons/${prevLesson.id}`}
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <div className="text-left">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  前のレッスン
                </div>
                <div className="font-medium">{prevLesson.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <Link
              href={`/courses/${params.courseId}/lessons/${nextLesson.id}`}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow hover:shadow-lg transition-all"
            >
              <div className="text-right">
                <div className="text-xs text-blue-100">次のレッスン</div>
                <div className="font-medium">{nextLesson.title}</div>
              </div>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ) : (
            <Link
              href={`/courses/${params.courseId}`}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow hover:shadow-lg transition-all"
            >
              コース一覧に戻る
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}
