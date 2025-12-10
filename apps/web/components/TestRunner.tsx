'use client'

import { useState, useEffect, useRef } from 'react'

interface TestResult {
  name: string
  passed: boolean
  error?: string
  actual?: any
  expected?: any
  details?: string
}

interface TestResponse {
  passed: boolean
  totalTests: number
  passedTests: number
  failedTests: number
  results: TestResult[]
  error?: string
}

interface TestRunnerProps {
  missionId: string
  starterCode: string
  testCode: string
}

function TestResultAccordion({ result, index }: { result: TestResult; index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className={`rounded-lg border-2 ${
        result.passed
          ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700'
          : 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700'
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 flex items-start gap-2 hover:opacity-80 transition-opacity"
      >
        <span className="text-lg mt-0.5">
          {result.passed ? '✓' : '✗'}
        </span>
        <div className="flex-1 text-left">
          <div
            className={`font-medium ${
              result.passed
                ? 'text-green-700 dark:text-green-300'
                : 'text-red-700 dark:text-red-300'
            }`}
          >
            {result.name}
          </div>
          {result.error && !isOpen && (
            <div className="text-sm text-red-600 dark:text-red-400 mt-1 truncate">
              {result.error}
            </div>
          )}
        </div>
        <svg
          className={`w-5 h-5 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          } ${
            result.passed
              ? 'text-green-700 dark:text-green-300'
              : 'text-red-700 dark:text-red-300'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="px-3 pb-3 space-y-2">
          {result.error && (
            <div className="bg-white dark:bg-gray-800 rounded p-3">
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                エラー:
              </div>
              <div className="text-sm text-red-600 dark:text-red-400 font-mono">
                {result.error}
              </div>
            </div>
          )}

          {result.expected !== undefined && (
            <div className="bg-white dark:bg-gray-800 rounded p-3">
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                期待値:
              </div>
              <div className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                {JSON.stringify(result.expected, null, 2)}
              </div>
            </div>
          )}

          {result.actual !== undefined && (
            <div className="bg-white dark:bg-gray-800 rounded p-3">
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                実際の値:
              </div>
              <div className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                {JSON.stringify(result.actual, null, 2)}
              </div>
            </div>
          )}

          {result.details && (
            <div className="bg-white dark:bg-gray-800 rounded p-3">
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                詳細:
              </div>
              <div className="text-sm text-gray-900 dark:text-gray-100">
                {result.details}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function TestRunner({ missionId, starterCode, testCode }: TestRunnerProps) {
  const [code, setCode] = useState(starterCode)
  const [testResults, setTestResults] = useState<TestResponse | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [showTests, setShowTests] = useState(false)
  const [lastSync, setLastSync] = useState<number | null>(null)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle')
  const lastCodeRef = useRef(code)

  // VS Codeからコードを手動で同期
  const syncFromVSCode = async () => {
    setSyncStatus('syncing')
    try {
      const response = await fetch(`/api/missions/${missionId}/code-sync`)
      if (response.ok) {
        const data = await response.json()
        
        if (data.code) {
          setCode(data.code)
          setLastSync(data.timestamp)
          setSyncStatus('synced')
          
          // 2秒後にステータスをリセット
          setTimeout(() => setSyncStatus('idle'), 2000)
        } else {
          setSyncStatus('idle')
          alert('VS Codeからの保存されたコードが見つかりません。\nVS Codeでファイルを保存してから再度お試しください。')
        }
      } else {
        setSyncStatus('idle')
        alert('コードの同期に失敗しました')
      }
    } catch (error) {
      console.error('Failed to sync code:', error)
      setSyncStatus('idle')
      alert('コードの同期に失敗しました')
    }
  }

  // VS Codeからのコード同期を定期的にチェック（自動同期）
  useEffect(() => {
    let intervalId: NodeJS.Timeout

    const checkForUpdates = async () => {
      try {
        const response = await fetch(`/api/missions/${missionId}/code-sync`)
        if (response.ok) {
          const data = await response.json()
          
          // 新しいコードがある場合のみ更新
          if (data.code && data.timestamp && data.timestamp !== lastSync) {
            // ユーザーがコードを編集中でない場合のみ更新
            if (lastCodeRef.current === code) {
              setCode(data.code)
              setLastSync(data.timestamp)
              setSyncStatus('synced')
              
              // 2秒後にステータスをリセット
              setTimeout(() => setSyncStatus('idle'), 2000)
            }
          }
        }
      } catch (error) {
        console.error('Failed to check for code updates:', error)
      }
    }

    // 3秒ごとにチェック
    intervalId = setInterval(checkForUpdates, 3000)
    
    // 初回チェック
    checkForUpdates()

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [missionId, lastSync, code])

  // コード変更時にrefを更新
  useEffect(() => {
    lastCodeRef.current = code
  }, [code])

  const runTests = async () => {
    setIsRunning(true)
    setTestResults(null)

    console.log('runTests called, missionId:', missionId, 'code length:', code.length)

    try {
      const url = `/api/missions/${missionId}/test`
      console.log('Fetching:', url)
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to run tests')
      }

      setTestResults(data.testResults)
    } catch (error) {
      console.error('Test execution error:', error)
      setTestResults({
        passed: false,
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        results: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* コードエディタ */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              💻 あなたのコード
            </h3>
            {syncStatus === 'synced' && (
              <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 animate-fade-in">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                VS Codeから同期済み
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={syncFromVSCode}
              disabled={syncStatus === 'syncing'}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                syncStatus === 'syncing'
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
              }`}
              title="VS Codeで保存したコードを取り込む"
            >
              {syncStatus === 'syncing' ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  同期中...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  VS Codeから同期
                </>
              )}
            </button>
            <button
              onClick={() => setCode(starterCode)}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-2"
            >
              リセット
            </button>
          </div>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-96 bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          spellCheck={false}
        />
      </div>

      {/* テストコード表示 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <button
          onClick={() => setShowTests(!showTests)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            🧪 テストコード
          </h3>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${
              showTests ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {showTests && (
          <pre className="mt-4 bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
            <code>{testCode}</code>
          </pre>
        )}
      </div>

      {/* テスト実行ボタン */}
      <div className="flex justify-center">
        <button
          onClick={runTests}
          disabled={isRunning}
          className={`px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transition-all ${
            isRunning
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
          }`}
        >
          {isRunning ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              テスト実行中...
            </span>
          ) : (
            '🚀 テストを実行'
          )}
        </button>
      </div>

      {/* テスト結果 */}
      {testResults && (
        <div
          className={`rounded-lg shadow-lg p-6 ${
            testResults.passed
              ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
              : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            {testResults.passed ? (
              <>
                <span className="text-4xl">✅</span>
                <div>
                  <h3 className="text-2xl font-bold text-green-700 dark:text-green-300">
                    テスト合格！
                  </h3>
                  <p className="text-green-600 dark:text-green-400">
                    おめでとうございます！すべてのテストに合格しました。
                  </p>
                </div>
              </>
            ) : (
              <>
                <span className="text-4xl">❌</span>
                <div>
                  <h3 className="text-2xl font-bold text-red-700 dark:text-red-300">
                    テスト失敗
                  </h3>
                  <p className="text-red-600 dark:text-red-400">
                    {testResults.error || 'いくつかのテストが失敗しました。'}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* テスト統計 */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {testResults.totalTests}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">総テスト数</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {testResults.passedTests}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">合格</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {testResults.failedTests}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">失敗</div>
            </div>
          </div>

          {/* 個別テスト結果 */}
          {testResults.results.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                テスト詳細:
              </h4>
              {testResults.results.map((result, index) => (
                <TestResultAccordion key={index} result={result} index={index} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
