import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Copilot Skill Builder
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            GitHub Copilotを実践的に学ぶ学習プラットフォーム
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            ようこそ！
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            このプラットフォームでは、GitHub Copilotの使い方を実践的なミッションを通して学べます。
          </p>
          
          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors"
            >
              ログイン
            </Link>
            
            <Link
              href="/auth/signup"
              className="block w-full bg-white hover:bg-gray-50 text-blue-600 font-medium py-3 px-4 rounded-lg text-center border-2 border-blue-600 transition-colors"
            >
              新規登録
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              構造化された学習
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              基礎から応用まで、段階的にCopilotの使い方を学べます
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-3xl mb-3">💻</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              実践的なミッション
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              VS Code上で実際にコードを書きながら学習できます
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              進捗管理
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              学習の進捗を可視化し、達成感を得られます
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
