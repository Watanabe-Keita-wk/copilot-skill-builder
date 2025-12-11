import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { TestRunner } from '../../../components/TestRunner'

export default async function MissionPage({
  params,
}: {
  params: { missionId: string }
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login')
  }

  const mission = await prisma.mission.findUnique({
    where: { id: params.missionId },
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

  if (!mission) {
    redirect('/dashboard')
  }

  const progress = mission.userProgress[0]
  const tags = JSON.parse(mission.tags) as string[]
  const hints = mission.hints ? JSON.parse(mission.hints) : []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダー */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={mission.course ? `/courses/${mission.course.id}` : '/dashboard'}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ← {mission.course?.title || 'ダッシュボード'}
            </Link>
            {progress?.status === 'COMPLETED' && (
              <span className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                ✓ 完了済み
              </span>
            )}
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2">
            {/* ミッションヘッダー */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {mission.title}
                </h1>
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${
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
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {mission.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                {mission.estimatedTime && (
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
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
                    約{mission.estimatedTime}分
                  </div>
                )}
                <div className="flex gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 課題説明 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                📝 課題内容
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="flex items-center gap-2 text-3xl font-bold mb-4 pb-2 border-b-2 border-blue-500">
                        <span className="text-blue-600 dark:text-blue-400">📌</span>
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="flex items-center gap-2 text-2xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-200">
                        <span className="text-green-600 dark:text-green-400">🔹</span>
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="flex items-center gap-2 text-xl font-semibold mt-6 mb-3 text-gray-700 dark:text-gray-300">
                        <span className="text-purple-600 dark:text-purple-400">▸</span>
                        {children}
                      </h3>
                    ),
                    code: ({ node, inline, className, children, ...props }: any) => {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg !mt-2 !mb-4"
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
                    ul: ({ children }) => (
                      <ul className="space-y-2 my-4 ml-6 list-none">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="space-y-2 my-4 ml-6 list-decimal">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                        <span className="flex-1">{children}</span>
                      </li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 pl-4 py-2 my-4 italic">
                        {children}
                      </blockquote>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-4">
                        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-left">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {mission.instructions}
                </ReactMarkdown>
              </div>
            </div>

            {/* ヒント */}
            {hints.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  💡 ヒント
                </h2>
                <div className="space-y-3">
                  {hints.map((hint: string, index: number) => (
                    <details
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700 rounded p-4"
                    >
                      <summary className="cursor-pointer font-medium text-gray-900 dark:text-white">
                        ヒント {index + 1}
                      </summary>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">
                        {hint}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* テストランナー */}
            {mission.starterCode && mission.testCode && (
              <TestRunner
                missionId={mission.id}
                starterCode={mission.starterCode}
                testCode={mission.testCode}
              />
            )}
          </div>

          {/* サイドバー */}
          <div className="lg:col-span-1">
            {/* 進捗状況 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📊 進捗状況
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    ステータス
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                      progress?.status === 'COMPLETED'
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : progress?.status === 'IN_PROGRESS'
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {progress?.status === 'COMPLETED'
                      ? '完了'
                      : progress?.status === 'IN_PROGRESS'
                      ? '進行中'
                      : '未着手'}
                  </span>
                </div>

                {progress?.attemptCount !== undefined && (
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      挑戦回数
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {progress.attemptCount}回
                    </div>
                  </div>
                )}

                {progress?.completedAt && (
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      完了日時
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(progress.completedAt).toLocaleDateString('ja-JP')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 解答例（完了後のみ表示） */}
        {progress?.status === 'COMPLETED' && mission.solutionCode && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ✨ 解答例
            </h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
              <code>{mission.solutionCode}</code>
            </pre>
          </div>
        )}
      </main>
    </div>
  )
}
