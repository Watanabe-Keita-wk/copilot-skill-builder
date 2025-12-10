// Phase 3のレッスンデータ
export const phase3Lessons = [
  {
    title: 'モジュール6: AIが生成したコードの検証',
    description: 'コードレビューと品質チェックの方法',
    content: `# モジュール6: AIが生成したコードの検証

## なぜ検証が必要か？

GitHub Copilotは強力なツールですが、完璧ではありません。生成されたコードは必ずレビューし、理解した上で使用する必要があります。

## チェックポイント

### 1. ロジックの正確性
生成されたコードが要件を満たしているか確認します。

**チェック項目:**
- エッジケースの処理（空配列、null、undefined）
- ループの境界条件
- 条件分岐の漏れ

### 2. パフォーマンス
効率的な実装になっているか確認します。

**注意すべき点:**
- ネストしたループ（O(n²) の計算量）
- 不必要な配列のコピー
- メモリの無駄遣い

### 3. セキュリティ
セキュリティリスクがないか確認します。

**危険な例:**
- SQL インジェクションの可能性
- XSS（クロスサイトスクリpting）の脆弱性
- 機密情報のハードコード

### 4. 可読性
他の開発者が理解できるコードか確認します。

**改善ポイント:**
- 変数名が意味を表している
- 複雑な処理にコメントがある
- 適切な関数の分割

## 実践的な検証方法

### ステップ1: コードを読む
生成されたコードを一行ずつ理解します。

\`\`\`typescript
// Copilotが生成したコード
function processData(data: any[]): any[] {
  return data.map(item => item.value).filter(v => v > 0)
}
\`\`\`

**疑問点:**
- \`any\` 型でいいのか？
- \`item.value\` が存在しない場合は？
- 空配列の場合は問題ないか？

### ステップ2: エッジケースを考える
想定外の入力で動作するか確認します。

\`\`\`typescript
// テストケースを考える
processData([])  // 空配列
processData([{ value: 0 }])  // 0の場合
processData([{ noValue: 1 }])  // valueがない
processData([{ value: null }])  // nullの場合
\`\`\`

### ステップ3: 改善案を考える
問題があれば、Copilot Chatに改善を依頼します。

\`\`\`
この関数の型安全性を向上させて、
エッジケースも適切に処理してください
\`\`\`

## Copilot Chatでの検証

### /explain を使う
\`\`\`
/explain この関数は何をしていますか？
潜在的な問題はありますか？
\`\`\`

### /tests を使う
テストコードを生成して、カバレッジを確認します。

\`\`\`
/tests この関数の包括的なテストを作成してください
エッジケースも含めて
\`\`\`

## まとめ
- AIのコードは必ず検証する
- ロジック、パフォーマンス、セキュリティ、可読性をチェック
- エッジケースを考慮
- Copilot Chatも活用して検証
`,
    order: 6,
    duration: 30,
  },
  {
    title: 'モジュール7: Copilotを活用したテストとデバッグ',
    description: 'テストコード生成とデバッグの効率化',
    content: `# モジュール7: Copilotを活用したテストとデバッグ

## テストコードの生成

GitHub Copilotはテストコードの生成も得意です。適切なプロンプトで、包括的なテストを作成できます。

### 基本的なテスト生成

#### パターン1: /tests コマンド
\`\`\`
関数を選択して:
/tests この関数のユニットテストを作成してください
\`\`\`

#### パターン2: コメント駆動
\`\`\`typescript
// sum関数のテスト
// - 正の数の合計
// - 負の数の合計
// - 空配列の場合
// - 大きな数の配列
describe('sum', () => {
  // Copilotがテストケースを生成
})
\`\`\`

### 包括的なテストの作成

**良いテストのポイント:**
1. 正常系のテスト
2. エッジケースのテスト
3. エラーケースのテスト
4. 境界値のテスト

\`\`\`typescript
describe('divide', () => {
  // 正常系
  test('正の数の除算', () => {
    expect(divide(10, 2)).toBe(5)
  })

  // エッジケース
  test('0での除算はエラー', () => {
    expect(() => divide(10, 0)).toThrow()
  })

  // 境界値
  test('小数の除算', () => {
    expect(divide(1, 3)).toBeCloseTo(0.333, 2)
  })
})
\`\`\`

## デバッグの効率化

### 1. エラーメッセージから修正案を得る
\`\`\`
/fix このTypeScriptのエラーを修正してください
\`\`\`

### 2. ログの追加
デバッグ用のログ出力をCopilotに生成させます。

\`\`\`typescript
// この関数にデバッグログを追加
function complexCalculation(data: Data[]): Result {
  // Copilotが適切な位置にログを追加
}
\`\`\`

### 3. エッジケースの特定
\`\`\`
この関数が失敗する可能性のある
エッジケースを教えてください
\`\`\`

## TDD (テスト駆動開発) とCopilot

### ステップ1: テストを先に書く
\`\`\`typescript
describe('calculateDiscount', () => {
  test('10%割引', () => {
    expect(calculateDiscount(1000, 10)).toBe(900)
  })

  test('割引なし', () => {
    expect(calculateDiscount(1000, 0)).toBe(1000)
  })
})
\`\`\`

### ステップ2: 実装をCopilotに生成させる
テストを書いた後、実装部分でCopilotが要件を理解した提案をします。

\`\`\`typescript
// テストを満たす実装
function calculateDiscount(price: number, discountPercent: number): number {
  // Copilotがテストを見て適切な実装を提案
}
\`\`\`

## テストカバレッジの向上

### 不足しているテストケースを特定
\`\`\`
この関数のテストカバレッジを確認して、
足りないテストケースを提案してください
\`\`\`

### モックの生成
\`\`\`typescript
// APIのモックを作成
// Copilotが適切なモックオブジェクトを提案
const mockApiClient = {
  // ...
}
\`\`\`

## デバッグのベストプラクティス

### 1. 段階的なデバッグ
複雑な問題を小さく分解してデバッグします。

### 2. ログの戦略的配置
入力値、中間結果、出力値を記録します。

### 3. 型チェックの活用
TypeScriptの型エラーを最大限活用します。

### 4. テストの自動化
変更のたびにテストを実行して、リグレッションを防ぎます。

## 実践のコツ

1. **テストファーストで考える**: 実装前にテストケースを考える
2. **Copilotにエッジケースを聞く**: 見落としを防ぐ
3. **生成されたテストを検証**: テストコードもレビューする
4. **デバッグログは一時的に**: 本番コードには残さない

## まとめ
- Copilotでテストコード生成を効率化
- /tests コマンドとコメント駆動を活用
- TDDのサイクルでCopilotを使う
- デバッグも対話的に進める
`,
    order: 7,
    duration: 35,
  },
]

// Phase 3のミッションデータ
export const phase3Missions = [
  {
    title: 'エッジケースを考慮した実装',
    description: 'より堅牢なコードを書く練習',
    difficulty: 'INTERMEDIATE',
    order: 5,
    estimatedTime: 25,
    instructions: `# Mission: エッジケースを考慮した実装

## 目的
エッジケースを適切に処理する堅牢なコードを実装します。

## 課題
配列から指定されたインデックスの要素を安全に取得する関数を実装してください。

## 要件
- 関数名: \`getAt\`
- 引数: \`arr: T[], index: number\`
- 戻り値: \`T | undefined\`
- 負のインデックスは配列の末尾から数える（Python風）
- 範囲外のインデックスは \`undefined\` を返す

## Copilot活用のポイント
1. エッジケースをコメントで明示
2. 型の安全性を確保
3. Copilot Chatで検証を依頼

## 例
\`\`\`typescript
getAt([1, 2, 3], 0)   // 1
getAt([1, 2, 3], -1)  // 3
getAt([1, 2, 3], 10)  // undefined
getAt([], 0)          // undefined
\`\`\`
`,
    starterCode: `export function getAt(arr, index) {
  
}
`,
    testCode: `import { getAt } from './main'

describe('getAt', () => {
  const arr = [10, 20, 30, 40, 50]

  test('正のインデックス', () => {
    expect(getAt(arr, 0)).toBe(10)
    expect(getAt(arr, 2)).toBe(30)
    expect(getAt(arr, 4)).toBe(50)
  })

  test('負のインデックス', () => {
    expect(getAt(arr, -1)).toBe(50)
    expect(getAt(arr, -2)).toBe(40)
    expect(getAt(arr, -5)).toBe(10)
  })

  test('範囲外のインデックス', () => {
    expect(getAt(arr, 10)).toBeUndefined()
    expect(getAt(arr, -10)).toBeUndefined()
  })

  test('空配列', () => {
    expect(getAt([], 0)).toBeUndefined()
    expect(getAt([], -1)).toBeUndefined()
  })

  test('境界値', () => {
    expect(getAt(arr, 5)).toBeUndefined()
    expect(getAt(arr, -6)).toBeUndefined()
  })
})
`,
    solutionCode: `/**
 * 配列から指定されたインデックスの要素を安全に取得
 * 
 * エッジケース:
 * - 負のインデックス: 末尾からの位置（-1は最後の要素）
 * - 範囲外のインデックス: undefinedを返す
 * - 空配列: undefinedを返す
 * 
 * @param arr - 対象の配列
 * @param index - インデックス（負の値も可）
 * @returns 要素またはundefined
 */
export function getAt<T>(arr: T[], index: number): T | undefined {
  // 負のインデックスを正に変換
  const actualIndex = index < 0 ? arr.length + index : index

  // 範囲チェック
  if (actualIndex < 0 || actualIndex >= arr.length) {
    return undefined
  }

  return arr[actualIndex]
}
`,
    tags: '["typescript", "array", "edge-cases", "generics"]',
    hints: '[\"負のインデックスは arr.length + index で変換\", \"範囲チェックを忘れずに\", \"ジェネリクスで型安全に\"]',
  },
  {
    title: '総合演習: ユーザー検索機能',
    description: 'これまでの学習を総動員した実践的な課題',
    difficulty: 'ADVANCED',
    order: 6,
    estimatedTime: 40,
    instructions: `# Mission: 総合演習 - ユーザー検索機能

## 目的
Phase 1-3で学んだすべてのテクニックを活用して、実践的な機能を実装します。

## 課題
複数の条件でユーザーを検索する機能を実装してください。

## 要件

### 1. 型定義
まず、以下の型を定義してください:

\`\`\`typescript
interface User {
  id: string
  name: string
  age: number
  email: string
  isActive: boolean
}

interface SearchCriteria {
  namePattern?: string
  minAge?: number
  maxAge?: number
  isActive?: boolean
}
\`\`\`

### 2. 実装する関数
- \`searchUsers(users: User[], criteria: SearchCriteria): User[]\`

### 3. 検索ロジック
- namePattern: 部分一致（大文字小文字区別なし）
- minAge/maxAge: 範囲指定
- isActive: 真偽値
- すべての条件はAND条件
- 条件が指定されていない場合はフィルタしない

## Copilot活用のポイント
1. **詳細なコメント**: 各条件の処理ロジックを明確に
2. **型の活用**: TypeScriptの型でCopilotをガイド
3. **段階的実装**: 1つずつ条件を追加
4. **テストで検証**: エッジケースも含めてテスト
5. **Copilot Chatでレビュー**: 実装後に改善点を確認

## 評価ポイント
- すべてのテストがパス
- エッジケースの適切な処理
- 読みやすいコード
- 型安全な実装
`,
    starterCode: `export function searchUsers(users, criteria) {
  
}
`,
    testCode: `import { searchUsers, User, SearchCriteria } from './main'

describe('searchUsers', () => {
  const users: User[] = [
    { id: '1', name: 'Alice Smith', age: 25, email: 'alice@example.com', isActive: true },
    { id: '2', name: 'Bob Johnson', age: 17, email: 'bob@example.com', isActive: false },
    { id: '3', name: 'Charlie Brown', age: 30, email: 'charlie@example.com', isActive: true },
    { id: '4', name: 'David Wilson', age: 45, email: 'david@example.com', isActive: true },
    { id: '5', name: 'Eve Davis', age: 20, email: 'eve@example.com', isActive: false },
  ]

  test('条件なしは全件返す', () => {
    expect(searchUsers(users, {})).toEqual(users)
  })

  test('名前で部分一致検索', () => {
    const result = searchUsers(users, { namePattern: 'smith' })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Alice Smith')
  })

  test('年齢範囲で検索', () => {
    const result = searchUsers(users, { minAge: 20, maxAge: 30 })
    expect(result).toHaveLength(3)
    expect(result.map(u => u.name)).toEqual(['Alice Smith', 'Charlie Brown', 'Eve Davis'])
  })

  test('アクティブ状態で検索', () => {
    const result = searchUsers(users, { isActive: true })
    expect(result).toHaveLength(3)
  })

  test('複数条件のAND検索', () => {
    const result = searchUsers(users, {
      minAge: 20,
      isActive: true
    })
    expect(result).toHaveLength(3)
    expect(result.map(u => u.name)).toEqual(['Alice Smith', 'Charlie Brown', 'David Wilson'])
  })

  test('すべての条件を指定', () => {
    const result = searchUsers(users, {
      namePattern: 'brown',
      minAge: 25,
      maxAge: 35,
      isActive: true
    })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Charlie Brown')
  })

  test('条件に一致するユーザーがいない', () => {
    const result = searchUsers(users, { namePattern: 'xyz' })
    expect(result).toEqual([])
  })

  test('空配列', () => {
    expect(searchUsers([], { namePattern: 'test' })).toEqual([])
  })
})
`,
    solutionCode: `// ユーザー型の定義
export interface User {
  id: string
  name: string
  age: number
  email: string
  isActive: boolean
}

// 検索条件の型定義
export interface SearchCriteria {
  namePattern?: string    // 名前の部分一致（大文字小文字区別なし）
  minAge?: number         // 最小年齢
  maxAge?: number         // 最大年齢
  isActive?: boolean      // アクティブ状態
}

/**
 * ユーザーを複数条件で検索する
 * 
 * 検索ロジック:
 * 1. namePattern: 名前に含まれる文字列で部分一致（大文字小文字無視）
 * 2. minAge: 指定年齢以上のユーザー
 * 3. maxAge: 指定年齢以下のユーザー
 * 4. isActive: アクティブ状態が一致
 * 
 * すべての条件はAND条件で、指定されていない条件は無視する
 * 
 * @param users - 検索対象のユーザー配列
 * @param criteria - 検索条件
 * @returns 条件に一致するユーザーの配列
 */
export function searchUsers(users: User[], criteria: SearchCriteria): User[] {
  return users.filter(user => {
    // 名前の部分一致チェック
    if (criteria.namePattern !== undefined) {
      const pattern = criteria.namePattern.toLowerCase()
      if (!user.name.toLowerCase().includes(pattern)) {
        return false
      }
    }

    // 最小年齢チェック
    if (criteria.minAge !== undefined && user.age < criteria.minAge) {
      return false
    }

    // 最大年齢チェック
    if (criteria.maxAge !== undefined && user.age > criteria.maxAge) {
      return false
    }

    // アクティブ状態チェック
    if (criteria.isActive !== undefined && user.isActive !== criteria.isActive) {
      return false
    }

    return true
  })
}
`,
    tags: '["typescript", "filter", "search", "advanced"]',
    hints: '[\"filter で条件を1つずつチェック\", \"undefined チェックを忘れずに\", \"toLowerCase() で大文字小文字を統一\"]',
  },
]
