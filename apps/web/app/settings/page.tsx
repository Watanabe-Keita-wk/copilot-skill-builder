'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ApiToken {
  id: string
  name: string
  token: string
  createdAt: string
  lastUsedAt: string
}

export default function SettingsPage() {
  const [tokens, setTokens] = useState<ApiToken[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newTokenName, setNewTokenName] = useState('')
  const [showNewToken, setShowNewToken] = useState<string | null>(null)

  useEffect(() => {
    fetchTokens()
  }, [])

  const fetchTokens = async () => {
    try {
      const response = await fetch('/api/tokens')
      const data = await response.json()
      setTokens(data.tokens)
    } catch (error) {
      console.error('Failed to fetch tokens:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createToken = async () => {
    if (!newTokenName.trim()) return

    setIsCreating(true)
    try {
      const response = await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTokenName }),
      })

      const data = await response.json()
      setShowNewToken(data.token.token)
      setNewTokenName('')
      fetchTokens()
    } catch (error) {
      console.error('Failed to create token:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const deleteToken = async (tokenId: string) => {
    if (!confirm('本当にこのトークンを削除しますか？')) return

    try {
      await fetch('/api/tokens', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenId }),
      })

      fetchTokens()
    } catch (error) {
      console.error('Failed to delete token:', error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('トークンをクリップボードにコピーしました')
  }

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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          設定
        </h1>

        {/* APIトークン管理 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            🔑 APIトークン
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            VS Code拡張機能との連携に使用するAPIトークンを管理します
          </p>

          {/* 新しいトークン表示 */}
          {showNewToken && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-2">
                トークンが作成されました
              </h3>
              <p className="text-sm text-green-800 dark:text-green-400 mb-4">
                このトークンは一度だけ表示されます。安全な場所に保存してください。
              </p>
              <div className="bg-white dark:bg-gray-800 p-4 rounded border border-green-200 dark:border-green-700 font-mono text-sm break-all mb-4">
                {showNewToken}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(showNewToken)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                >
                  コピー
                </button>
                <button
                  onClick={() => setShowNewToken(null)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  閉じる
                </button>
              </div>
            </div>
          )}

          {/* トークン作成フォーム */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              新しいトークンを作成
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTokenName}
                onChange={(e) => setNewTokenName(e.target.value)}
                placeholder="トークン名（例: VS Code - MacBook）"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && createToken()}
              />
              <button
                onClick={createToken}
                disabled={isCreating || !newTokenName.trim()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
              >
                {isCreating ? '作成中...' : '作成'}
              </button>
            </div>
          </div>

          {/* トークン一覧 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              既存のトークン
            </h3>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                読み込み中...
              </div>
            ) : tokens.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                トークンがありません
              </div>
            ) : (
              <div className="space-y-4">
                {tokens.map((token) => (
                  <div
                    key={token.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {token.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        作成: {new Date(token.createdAt).toLocaleDateString('ja-JP')}
                        {' | '}
                        最終使用:{' '}
                        {new Date(token.lastUsedAt).toLocaleDateString('ja-JP')}
                      </div>
                      <div className="text-xs font-mono text-gray-400 dark:text-gray-500 mt-1">
                        {token.token.substring(0, 8)}...
                      </div>
                    </div>
                    <button
                      onClick={() => deleteToken(token.id)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      削除
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* VS Code拡張機能のインストールガイド */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
            📦 VS Code拡張機能のセットアップ
          </h3>
          <ol className="text-sm text-blue-800 dark:text-blue-400 space-y-2 list-decimal list-inside">
            <li>VS Codeで拡張機能をインストール</li>
            <li>上記でAPIトークンを作成</li>
            <li>VS Codeの設定でトークンを登録</li>
            <li>ミッションに挑戦！</li>
          </ol>
        </div>
      </main>
    </div>
  )
}
