// Phase 2: 効果的なプロンプティングと実践テクニック のレッスンとミッション

export const phase2Lessons = [
  {
    title: 'モジュール3: コメント駆動開発の基礎',
    description: '良いプロンプトの書き方とコメント駆動開発',
    content: `# モジュール3: コメント駆動開発の基礎

## 「良いプロンプト」とは？

良いプロンプトは、Copilotに対する明確な指示です。曖昧なコメントではなく、具体的な要件を記述することで、期待通りのコードが生成されやすくなります。

### 良いプロンプトの3つの要素

#### 1. 具体的な説明
❌ 悪い例: \`// データを処理する\`
✅ 良い例: \`// ユーザーIDの配列から重複を削除し、昇順にソートする\`

#### 2. 入出力の明示
\`\`\`typescript
// 入力: ユーザーオブジェクトの配列 [{ id: number, name: string, age: number }]
// 出力: 20歳以上のユーザー名の配列
function getAdultNames(users) {
  // Copilotがここで適切な実装を提案
}
\`\`\`

#### 3. エッジケースの考慮
\`\`\`typescript
// 配列の最大値を返す
// 空の配列の場合はnullを返す
// 負の数も含めて処理する
function findMax(numbers: number[]): number | null {
  // 実装
}
\`\`\`

## ファイル全体の目的を定義

ファイルの冒頭にそのファイルの目的や役割を記述すると、Copilotがより適切な提案を行います。

\`\`\`typescript
/**
 * ユーザー管理機能
 * - ユーザー情報のCRUD操作
 * - パスワードのハッシュ化
 * - メール送信機能
 */

// この後の関数はこの文脈を考慮して生成される
\`\`\`

## 実践のコツ

### 段階的に詳細化する
1. まず大まかな説明を書く
2. Copilotの提案を確認
3. 必要に応じて詳細を追加
4. 再度提案を確認

### コメントの位置
- **関数の前**: 関数全体の目的
- **処理のブロック前**: その処理の意図
- **複雑なロジックの横**: なぜそうするのか

## まとめ
- 具体的で明確なコメントを書く
- 入出力とエッジケースを明示
- ファイル全体の文脈を提供
- 段階的にコメントを詳細化
`,
    order: 3,
    duration: 20,
    isPublished: true,
  },
  {
    title: 'モジュール4: 既存コードをコンテキストとして活用',
    description: '開いているファイルやプロジェクト全体の情報を活用する方法',
    content: `# モジュール4: 既存コードをコンテキストとして活用

## Copilotが参照する情報

GitHub Copilotは単独のファイルだけでなく、プロジェクト全体の情報を活用します。

### 1. 現在のファイル
- 変数名、関数名、型定義
- インポート文
- 既存の実装パターン

### 2. 開いているタブのファイル
VS Codeで開いている他のファイルも参照対象です。関連ファイルを開いておくと提案の精度が上がります。

### 3. プロジェクト構造
- package.jsonの依存関係
- tsconfig.jsonの設定
- 同じディレクトリ内のファイル

## 効果的なコンテキストの提供方法

### パターン1: 型定義を先に書く
\`\`\`typescript
// 型を定義
interface User {
  id: string
  name: string
  email: string
  createdAt: Date
}

// この後にUser型を使う関数を書くと、
// Copilotは型を理解した上で提案してくれる
function formatUser
// → formatUser(user: User): string などが提案される
\`\`\`

### パターン2: 似た実装を参照する
\`\`\`typescript
// 既存の関数
function getUserById(id: string): User | null {
  return users.find(u => u.id === id) ?? null
}

// 似たパターンで書き始めると...
function getUserByEmail
// → Copilotが同じパターンで実装を提案
\`\`\`

### パターン3: 関連ファイルを開く
例: \`userService.ts\` を実装する時
- \`User.ts\` (型定義)
- \`userRepository.ts\` (DB操作)
- \`userController.ts\` (既存の実装例)

これらを開いておくと、一貫性のある実装が提案されます。

## ワークスペースの整理

### ファイル名を意味のあるものにする
❌ \`utils.ts\`, \`helpers.ts\`
✅ \`dateUtils.ts\`, \`stringFormatters.ts\`

### 機能ごとにディレクトリを分ける
\`\`\`
src/
  user/
    types.ts
    service.ts
    repository.ts
  product/
    types.ts
    service.ts
    repository.ts
\`\`\`

このような構造にすると、Copilotが関連ファイルを理解しやすくなります。

## 実践のコツ

1. **関連ファイルを開く**: 実装前に参考になるファイルを開く
2. **型を先に定義**: データ構造を明確にする
3. **一貫したパターン**: プロジェクト内で同じパターンを使う
4. **命名規則を統一**: 関数名や変数名に一貫性を持たせる

## まとめ
- Copilotはプロジェクト全体の情報を活用
- 型定義と関連ファイルを適切に配置
- 一貫したコーディングパターンを維持
`,
    order: 4,
    duration: 25,
    isPublished: true,
  },
  {
    title: 'モジュール5: Copilot Chatの効果的な使い方',
    description: '対話的にコードの改善や説明を行う方法',
    content: `# モジュール5: Copilot Chatの効果的な使い方

## Copilot Chatとは？

Copilot Chatは、対話形式でコードについて質問したり、改善を依頼したりできる機能です。

### 起動方法
- **チャットパネル**: \`Command/Ctrl + Shift + I\`
- **インラインチャット**: \`Command/Ctrl + I\`
- **エディタ右クリック**: "Copilot" → "Start Inline Chat"

## 主な使い方

### 1. コードの説明を求める
選択したコードを説明してもらいます。

\`\`\`
/explain この関数は何をしていますか？
\`\`\`

### 2. リファクタリング
コードの改善を依頼します。

\`\`\`
この関数をもっと読みやすくしてください
\`\`\`

\`\`\`
この処理を非同期にしてください
\`\`\`

### 3. バグ修正
エラーの原因を特定し、修正案を提示してもらいます。

\`\`\`
/fix このエラーを修正してください
\`\`\`

### 4. テストコード生成
関数のテストコードを生成します。

\`\`\`
/tests この関数のユニットテストを作成してください
\`\`\`

### 5. ドキュメント生成
コメントやJSDocを自動生成します。

\`\`\`
/doc この関数のドキュメントを作成してください
\`\`\`

## 効果的な質問の仕方

### 具体的に聞く
❌ 「このコードを改善して」
✅ 「このコードのパフォーマンスを改善して、O(n²)をO(n)にしてください」

### コンテキストを提供
\`\`\`
このユーザー管理システムで、
パスワードをハッシュ化する関数を追加したいです。
bcryptを使って実装してください。
\`\`\`

### 段階的に掘り下げる
1. 「この関数は何をしていますか？」
2. 「なぜこのアプローチを使っているのですか？」
3. 「他にもっと良い方法はありますか？」

## スラッシュコマンド

よく使うコマンド:
- \`/explain\`: コードの説明
- \`/fix\`: バグ修正
- \`/tests\`: テスト生成
- \`/doc\`: ドキュメント生成
- \`/help\`: ヘルプ表示

## インラインチャットの活用

### コードの一部を選択して質問
1. コードを選択
2. \`Command/Ctrl + I\`
3. 質問を入力

### その場で変更を適用
提案されたコードをその場で確認・適用できます。

## 実践のコツ

1. **明確な指示**: 何をしたいか具体的に伝える
2. **反復的な対話**: 1回で完璧を求めず、段階的に改善
3. **コードレビュー**: 提案されたコードを理解してから使う
4. **学習ツールとして**: なぜそうなるのか説明を求める

## まとめ
- Copilot Chatは対話的にコードを改善
- スラッシュコマンドで効率的に操作
- 具体的な質問とコンテキスト提供が重要
`,
    order: 5,
    duration: 30,
    isPublished: true,
  },
]

export const phase2Missions = [
  {
    title: 'FizzBuzz問題をコメントから実装',
    description: 'コメント駆動開発の練習',
    difficulty: 'BEGINNER',
    order: 3,
    estimatedTime: 15,
    instructions: `# Mission: FizzBuzz問題をコメントから実装

## 目的
詳細なコメントから正確な実装を生成する練習です。

## 課題
1から100までの数字について、以下のルールで文字列を返す関数を実装してください:
- 3の倍数の場合は "Fizz"
- 5の倍数の場合は "Buzz"
- 15の倍数の場合は "FizzBuzz"
- それ以外は数字そのものを文字列に

## Copilot活用のポイント
1. 詳細なコメントを書く（ルールを明確に）
2. 入出力の型を明示
3. エッジケースを考慮

## 要件
- 関数名: \`fizzBuzz\`
- 引数: \`n: number\`
- 戻り値: \`string\`
`,
    starterCode: `export function fizzBuzz(n: number): string {
  
}
`,
    testCode: `import { fizzBuzz } from './main'

describe('fizzBuzz', () => {
  test('3の倍数', () => {
    expect(fizzBuzz(3)).toBe('Fizz')
    expect(fizzBuzz(6)).toBe('Fizz')
    expect(fizzBuzz(9)).toBe('Fizz')
  })

  test('5の倍数', () => {
    expect(fizzBuzz(5)).toBe('Buzz')
    expect(fizzBuzz(10)).toBe('Buzz')
    expect(fizzBuzz(20)).toBe('Buzz')
  })

  test('15の倍数', () => {
    expect(fizzBuzz(15)).toBe('FizzBuzz')
    expect(fizzBuzz(30)).toBe('FizzBuzz')
    expect(fizzBuzz(45)).toBe('FizzBuzz')
  })

  test('それ以外', () => {
    expect(fizzBuzz(1)).toBe('1')
    expect(fizzBuzz(2)).toBe('2')
    expect(fizzBuzz(7)).toBe('7')
  })
})
`,
    solutionCode: `/**
 * FizzBuzz問題を解く関数
 * 
 * ルール:
 * - 15の倍数の場合は "FizzBuzz" を返す
 * - 3の倍数の場合は "Fizz" を返す
 * - 5の倍数の場合は "Buzz" を返す
 * - それ以外は数字を文字列にして返す
 * 
 * @param n - 判定する数値（1以上の整数）
 * @returns FizzBuzzの結果文字列
 */
export function fizzBuzz(n: number): string {
  if (n % 15 === 0) return 'FizzBuzz'
  if (n % 3 === 0) return 'Fizz'
  if (n % 5 === 0) return 'Buzz'
  return String(n)
}
`,
    tags: '["typescript", "conditional", "fizzbuzz"]',
    hints: '[\"15の倍数を最初にチェックすることが重要\", \"else if を使うとシンプルに\"]',
    isPublished: true,
    dependencies: '[]',
  },
  {
    title: '配列のフィルタと変換',
    description: 'コンテキストを活用した実装',
    difficulty: 'INTERMEDIATE',
    order: 4,
    estimatedTime: 20,
    instructions: `# Mission: 配列のフィルタと変換

## 目的
型定義をコンテキストとして活用し、適切なデータ変換を実装します。

## 課題
ユーザーオブジェクトの配列から、成人（20歳以上）のユーザー名だけを抽出する関数を実装してください。

## データ構造
Userオブジェクトは以下の属性を持ちます:
- \`id\`: string - ユーザーID
- \`name\`: string - ユーザー名
- \`age\`: number - 年齢
- \`email\`: string - メールアドレス

## Copilot活用のポイント
1. 型定義を先に確認
2. filterとmapの組み合わせをCopilotに提案させる
3. 複数の実装方法を比較

## 要件
- 関数名: \`getAdultNames\`
- 引数: \`users: User[]\`（User型の配列）
- 戻り値: \`string[]\`（名前の配列）
- 20歳以上のユーザーの名前を配列で返す

## 例
\`\`\`typescript
const users = [
  { id: '1', name: 'Alice', age: 25, email: 'alice@example.com' },
  { id: '2', name: 'Bob', age: 17, email: 'bob@example.com' },
  { id: '3', name: 'Charlie', age: 30, email: 'charlie@example.com' },
]
getAdultNames(users) // => ['Alice', 'Charlie']
\`\`\`
`,
    starterCode: `export function getAdultNames(users) {
  
}
`,
    testCode: `import { getAdultNames, User } from './main'

describe('getAdultNames', () => {
  const users: User[] = [
    { id: '1', name: 'Alice', age: 25, email: 'alice@example.com' },
    { id: '2', name: 'Bob', age: 17, email: 'bob@example.com' },
    { id: '3', name: 'Charlie', age: 30, email: 'charlie@example.com' },
    { id: '4', name: 'David', age: 19, email: 'david@example.com' },
    { id: '5', name: 'Eve', age: 20, email: 'eve@example.com' },
  ]

  test('成人ユーザーの名前を抽出', () => {
    const result = getAdultNames(users)
    expect(result).toEqual(['Alice', 'Charlie', 'Eve'])
  })

  test('空の配列', () => {
    expect(getAdultNames([])).toEqual([])
  })

  test('成人がいない場合', () => {
    const youngUsers: User[] = [
      { id: '1', name: 'Alice', age: 15, email: 'alice@example.com' },
      { id: '2', name: 'Bob', age: 18, email: 'bob@example.com' },
    ]
    expect(getAdultNames(youngUsers)).toEqual([])
  })
})
`,
    solutionCode: `// ユーザー型の定義
export interface User {
  id: string
  name: string
  age: number
  email: string
}

/**
 * 成人ユーザーの名前を抽出する
 * @param users - ユーザーの配列
 * @returns 20歳以上のユーザー名の配列
 */
export function getAdultNames(users: User[]): string[] {
  return users
    .filter(user => user.age >= 20)
    .map(user => user.name)
}
`,
    tags: '["typescript", "array", "filter", "map"]',
    hints: '[\"filter で年齢をチェック\", \"map で名前だけ抽出\", \"メソッドチェーンで繋げられます\"]',
    isPublished: true,
    dependencies: '[]',
  },
]
