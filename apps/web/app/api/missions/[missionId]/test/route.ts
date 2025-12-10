import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import * as vm from 'vm'

export async function POST(
  request: NextRequest,
  { params }: { params: { missionId: string } }
) {
  try {
    console.log('POST /api/missions/' + params.missionId + '/test - Start')
    
    const session = await auth()
    console.log('Session:', session?.user ? `User: ${session.user.id}` : 'Not authenticated')

    if (!session?.user) {
      console.log('Authentication failed - returning 401')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { code } = await request.json()
    console.log('Code received, length:', code?.length)

    if (!code) {
      console.log('No code provided - returning 400')
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    const mission = await prisma.mission.findUnique({
      where: { id: params.missionId },
    })

    if (!mission) {
      console.log('Mission not found - returning 404')
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 })
    }

    console.log('Mission found:', mission.title)
    console.log('Running tests...')
    
    // テスト実行
    const testResults = await runTests(code, mission.testCode)
    console.log('Test results:', testResults)

    // 進捗を更新
    const progress = await prisma.userMissionProgress.upsert({
      where: {
        userId_missionId: {
          userId: session.user.id,
          missionId: params.missionId,
        },
      },
      update: {
        status: testResults.passed ? 'COMPLETED' : 'IN_PROGRESS',
        attemptCount: {
          increment: 1,
        },
        completedAt: testResults.passed ? new Date() : null,
        testResults: JSON.stringify(testResults),
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        missionId: params.missionId,
        status: testResults.passed ? 'COMPLETED' : 'IN_PROGRESS',
        attemptCount: 1,
        completedAt: testResults.passed ? new Date() : null,
        testResults: JSON.stringify(testResults),
        startedAt: new Date(),
      },
    })

    console.log('Progress updated successfully')
    
    // コース進捗を更新（ミッションが完了した場合のみ）
    if (testResults.passed && mission.courseId) {
      const totalLessons = await prisma.lesson.count({
        where: {
          courseId: mission.courseId,
          isPublished: true,
        },
      })

      const completedLessons = await prisma.userLessonProgress.count({
        where: {
          userId: session.user.id,
          lesson: {
            courseId: mission.courseId,
          },
          isCompleted: true,
        },
      })

      const totalMissions = await prisma.mission.count({
        where: {
          courseId: mission.courseId,
          isPublished: true,
        },
      })

      const completedMissions = await prisma.userMissionProgress.count({
        where: {
          userId: session.user.id,
          mission: {
            courseId: mission.courseId,
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
            courseId: mission.courseId,
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
          courseId: mission.courseId,
          completedLessons,
          totalLessons,
          completedMissions,
          totalMissions,
          progressPercent,
        },
      })
    }
    
    return NextResponse.json({
      success: true,
      testResults,
      progress,
    })
  } catch (error) {
    console.error('Test execution error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { error: 'Failed to execute tests', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

async function runTests(userCode: string, testCode: string) {
  try {
    console.log('runTests - userCode length:', userCode.length)
    console.log('runTests - testCode length:', testCode.length)
    console.log('runTests - userCode:', userCode)
    console.log('runTests - testCode:', testCode)
    
    // TypeScriptコードを簡易的にJavaScriptに変換
    // export を削除、型アノテーションを削除
    let jsUserCode = userCode
      .replace(/export\s+(function|const|let|var|class|interface|type|enum)/g, '$1')
      .replace(/(\w+)<[^>]+>(?=\s*\()/g, '$1') // 関数のジェネリクスを削除 function<T>( -> function(
      .replace(/function\s+\w+\s*\(([^)]*)\)/g, (match, params) => { // 関数定義の引数から型を削除
        const cleanParams = params.replace(/(\w+)\s*:\s*[^,)]+/g, '$1')
        return match.substring(0, match.indexOf('(') + 1) + cleanParams + ')'
      })
      .replace(/\(([^)]*)\)\s*=>/g, (match, params) => { // アロー関数の引数から型を削除
        const cleanParams = params.replace(/(\w+)\s*:\s*[^,)]+/g, '$1')
        return '(' + cleanParams + ') =>'
      })
      .replace(/\)\s*:\s*[\w\[\]\|\s<>]+(?=\s*[{\=])/g, ')') // 関数の戻り値の型を削除
      .replace(/(const|let|var)\s+(\w+)\s*:\s*[\w\[\]\|\s<>]+(?=\s*=)/g, '$1 $2') // 変数宣言の型を削除
      .replace(/interface\s+\w+\s*\{[^}]*\}/g, '') // interface定義を削除
      .replace(/type\s+\w+\s*=\s*[^;]+;?/g, '') // type定義を削除
    
    let jsTestCode = testCode
      .replace(/import\s+.*?from\s+['"].*?['"]\s*;?/g, '') // import文を削除
      .replace(/export\s+(function|const|let|var|class|interface|type|enum)/g, '$1')
      .replace(/(\w+)<[^>]+>(?=\s*\()/g, '$1') // 関数のジェネリクスを削除
      .replace(/function\s+\w+\s*\(([^)]*)\)/g, (match, params) => {
        const cleanParams = params.replace(/(\w+)\s*:\s*[^,)]+/g, '$1')
        return match.substring(0, match.indexOf('(') + 1) + cleanParams + ')'
      })
      .replace(/\(([^)]*)\)\s*=>/g, (match, params) => {
        const cleanParams = params.replace(/(\w+)\s*:\s*[^,)]+/g, '$1')
        return '(' + cleanParams + ') =>'
      })
      .replace(/\)\s*:\s*[\w\[\]\|\s<>]+(?=\s*[{\=])/g, ')')
      .replace(/(const|let|var)\s+(\w+)\s*:\s*[\w\[\]\|\s<>]+(?=\s*=)/g, '$1 $2')
      .replace(/interface\s+\w+\s*\{[^}]*\}/g, '')
      .replace(/type\s+\w+\s*=\s*[^;]+;?/g, '')
    
    console.log('Converted userCode:', jsUserCode)
    console.log('Converted testCode:', jsTestCode)
    
    // シンプルなテストランナー実装
    const testResults: Array<{ 
      name: string
      passed: boolean
      error?: string
      actual?: any
      expected?: any
      details?: string
    }> = []
    let allPassed = true
    let currentTestName = ''

    // テストフレームワークのモック実装
    const describe = (suiteName: string, fn: () => void) => {
      console.log('describe called:', suiteName)
      fn()
    }

    const test = (testName: string, fn: () => void) => {
      console.log('test called:', testName)
      currentTestName = testName
      try {
        fn()
        // テスト成功時は最後のexpect呼び出しの値を取得
        const lastExpect = (global as any).__lastExpectValue
        testResults.push({ 
          name: testName, 
          passed: true,
          actual: lastExpect?.actual,
          expected: lastExpect?.expected,
        })
        console.log('test passed:', testName)
      } catch (error) {
        allPassed = false
        console.error('test error details:', error)
        
        // エラーの詳細を取得
        let errorMessage = 'Test failed'
        let actual = undefined
        let expected = undefined
        let details = undefined
        
        if (error instanceof Error) {
          errorMessage = error.message
          // スタックトレースも含める
          if (error.stack) {
            details = error.stack.split('\n').slice(0, 3).join('\n')
          }
        }
        
        const errorData = (error as any)
        if (errorData.actual !== undefined) {
          actual = errorData.actual
        }
        if (errorData.expected !== undefined) {
          expected = errorData.expected
        }
        if (errorData.details !== undefined) {
          details = errorData.details
        }
        
        testResults.push({
          name: testName,
          passed: false,
          error: errorMessage,
          actual,
          expected,
          details,
        })
        console.log('test failed:', testName, errorMessage, { actual, expected, details })
      } finally {
        // 次のテストのためにクリア
        delete (global as any).__lastExpectValue
      }
    }

    const expect = (actual: any) => {
      // expectが呼ばれた時点で値を記録
      (global as any).__lastExpectValue = { actual }
      
      return {
      toBe: (expected: any) => {
        (global as any).__lastExpectValue.expected = expected
        if (actual !== expected) {
          const error: any = new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`)
          error.actual = actual
          error.expected = expected
          throw error
        }
      },
      toEqual: (expected: any) => {
        (global as any).__lastExpectValue.expected = expected
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          const error: any = new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`)
          error.actual = actual
          error.expected = expected
          throw error
        }
      },
      toBeCloseTo: (expected: number, precision = 2) => {
        (global as any).__lastExpectValue.expected = expected
        const factor = Math.pow(10, precision)
        if (Math.round(actual * factor) !== Math.round(expected * factor)) {
          const error: any = new Error(`Expected ${expected} (within ${precision} decimals), but got ${actual}`)
          error.actual = actual
          error.expected = expected
          error.details = `Precision: ${precision} decimals`
          throw error
        }
      },
      toBeUndefined: () => {
        (global as any).__lastExpectValue.expected = undefined
        if (actual !== undefined) {
          const error: any = new Error(`Expected undefined, but got ${JSON.stringify(actual)}`)
          error.actual = actual
          error.expected = undefined
          throw error
        }
      },
      toThrow: () => {
        if (typeof actual !== 'function') {
          throw new Error('Expected a function')
        }
        let threw = false
        try {
          actual()
        } catch (e) {
          threw = true
        }
        if (!threw) {
          const error: any = new Error('Expected function to throw')
          error.details = 'Function did not throw an error'
          throw error
        }
      },
      toHaveLength: (expected: number) => {
        (global as any).__lastExpectValue.expected = expected
        const actualLength = actual?.length
        if (actualLength !== expected) {
          const error: any = new Error(`Expected length ${expected}, but got ${actualLength}`)
          error.actual = actualLength
          error.expected = expected
          error.details = `Array/String has ${actualLength} items/characters`
          throw error
        }
      },
    }
    }

    // 安全な実行環境を作成
    const sandbox = {
      describe,
      test,
      expect,
      console: {
        log: (...args: any[]) => console.log('[Test]', ...args),
        error: (...args: any[]) => console.error('[Test]', ...args),
      },
    }

    console.log('Creating VM context...')
    
    // ユーザーコードを実行
    const context = vm.createContext(sandbox)
    console.log('Running user code...')
    vm.runInContext(jsUserCode, context)
    console.log('User code executed successfully')

    // テストコードを実行
    console.log('Running test code...')
    vm.runInContext(jsTestCode, context)
    console.log('Test code executed successfully')

    console.log('Final test results:', testResults)

    return {
      passed: allPassed,
      totalTests: testResults.length,
      passedTests: testResults.filter((t) => t.passed).length,
      failedTests: testResults.filter((t) => !t.passed).length,
      results: testResults,
    }
  } catch (error) {
    console.error('runTests - Error occurred:', error)
    console.error('runTests - Error type:', typeof error)
    console.error('runTests - Error message:', error instanceof Error ? error.message : String(error))
    console.error('runTests - Error stack:', error instanceof Error ? error.stack : 'No stack')
    
    return {
      passed: false,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      results: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
