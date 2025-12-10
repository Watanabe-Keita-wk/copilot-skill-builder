export const phase1Lessons = [
  {
    title: 'モジュール1: Copilotの概要とAIコーディングとは',
    description: 'AIコーディングの基本概念とGitHub Copilotの機能を理解する',
    content: `# モジュール1: Copilotの概要とAIコーディングとは

## AIコーディングとは？

AIコーディングは、人工知能を活用してコードを書く新しいアプローチです。従来のコーディングでは、プログラマーが1行1行すべてのコードを手動で書いていましたが、AIコーディングではAIがコードの提案やサポートを行います。

### 従来のコーディングとの違い

**従来のコーディング:**
- すべてのコードを手動で入力
- ドキュメントやStack Overflowを検索しながら実装
- 定型的なコードも毎回記述

**AIコーディング:**
- AIが文脈に応じてコードを提案
- コメントから実装コードを自動生成
- 繰り返しのパターンを学習して効率化

## GitHub Copilotの機能

### 1. コード補完
入力中のコードの続きを自動的に提案します。

### 2. コメントからのコード生成
自然言語で書いたコメントから、実装コードを生成します。

### 3. チャット機能
対話形式でコードの説明、リファクタリング、バグ修正などを依頼できます。

### 4. 複数の提案
同じ状況に対して複数の実装案を提示し、選択できます。

## Copilotがコードを提案する仕組み

GitHub Copilotは以下の情報を参考にしてコードを提案します:

1. **現在のファイルの内容**: 変数名、関数名、型定義など
2. **開いている他のファイル**: 関連するコードの文脈
3. **カーソル位置**: どこに何を書こうとしているか
4. **コメント**: 意図や要件の説明

### いつ提案が出るか

- 関数名を入力したとき
- コメントを書いた後
- 新しい行を開始したとき
- 既存のパターンに続くコードを書くとき

## まとめ

- AIコーディングは効率的な開発をサポートする新しい手法
- GitHub Copilotは様々な機能でコーディングを支援
- 文脈を理解して適切な提案を行う
`,
    order: 1,
    duration: 15,
    isPublished: true,
  },
  {
    title: 'モジュール2: 環境設定と基本操作',
    description: 'Copilotのセットアップと基本的な操作方法を学ぶ',
    content: `# モジュール2: 環境設定と基本操作

## インストールと認証

### 1. GitHub Copilotの有効化
1. GitHub.comにログイン
2. Settings → Copilot → Copilot Settings
3. GitHub Copilot for Individualsを有効化（または組織で有効化）

### 2. VS Code拡張機能のインストール
1. VS Codeを開く
2. 拡張機能マーケットプレイスを開く（Mac: \`Command + Shift + X\` / Win: \`Ctrl + Shift + X\`）
3. "GitHub Copilot"を検索
4. "インストール"をクリック
5. GitHubアカウントでサインイン

### 3. 認証
初回起動時に自動的にGitHubアカウントとの連携を求められます。
ブラウザが開くので、指示に従って認証してください。

## 基本操作

### コード補完を受け入れる

**提案が表示されたら:**
- \`Tab\`: 提案全体を受け入れる
- \`Command/Ctrl + →\`: 単語単位で受け入れる
- \`Esc\`: 提案を拒否

### 複数の提案を確認する

**ショートカットキー:**
- \`Option/Alt + ]\`: 次の提案を表示
- \`Option/Alt + [\`: 前の提案を表示
- \`Option/Alt + ¥\`: すべての提案をサイドパネルで表示

### 実践のコツ

1. **明確な変数名を使う**: \`data\`より\`userData\`
2. **型定義を先に書く**: TypeScriptの型があると提案の精度が上がる
3. **コメントで意図を伝える**: 何をしたいかをコメントで書く

## 次のステップ

実際にミッションでCopilotを使ってみましょう！
最初は簡単な関数から始めて、徐々に慣れていきます。
`,
    order: 2,
    duration: 20,
    isPublished: true,
  },
]

export const phase1Missions = [
  {
    title: '基本操作: 配列の合計を計算する',
    description: 'Copilotの基本的なコード補完を体験します',
    difficulty: 'BEGINNER',
    order: 1,
    estimatedTime: 10,
    instructions: `# Mission: 配列の合計を計算する

## 目的
このミッションでは、GitHub Copilotの基本的なコード補完機能を体験します。

## 課題
数値の配列を受け取り、その合計を返す \`sum\` 関数を実装してください。

## Copilot活用のポイント
1. コメントで要件を明確に書く
2. 関数のシグネチャ（名前と型）を先に書く
3. Copilotの提案を確認して、適切なものを選ぶ

## 要件
- 関数名: \`sum\`
- 引数: \`numbers: number[]\`
- 戻り値: \`number\`
- 空の配列の場合は0を返す

## ヒント
\`// 配列の合計を計算する関数\` というコメントを書いてから、
関数定義を書き始めると、Copilotが実装を提案してくれます。
`,
    starterCode: `// 配列の合計を計算する関数
export function sum(numbers: number[]): number {
  // TODO: Copilotの提案を使って実装してください
}
`,
    testCode: `import { sum } from './main'

describe('sum', () => {
  test('空の配列は0を返す', () => {
    expect(sum([])).toBe(0)
  })

  test('正の数の合計を計算', () => {
    expect(sum([1, 2, 3, 4, 5])).toBe(15)
  })

  test('負の数を含む合計', () => {
    expect(sum([-1, -2, -3])).toBe(-6)
  })

  test('混合した数値', () => {
    expect(sum([10, -5, 3, -2])).toBe(6)
  })
})
`,
    solutionCode: `// 配列の合計を計算する関数
export function sum(numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0)
}
`,
    tags: '["typescript", "array", "basic", "reduce"]',
    hints: '[\"reduce メソッドを使うと簡潔に書けます\", \"初期値を0にすることを忘れずに\"]',
    isPublished: true,
    dependencies: '[]',
  },
  {
    title: '基本操作: 年齢で人物をソート',
    description: '複数の提案から最適な実装を選ぶ練習',
    difficulty: 'BEGINNER',
    order: 2,
    estimatedTime: 15,
    instructions: `# Mission: 年齢で人物をソート

## 目的
複数の提案を確認し、最適な実装を選択する方法を学びます。

## 課題
Person オブジェクトの配列を受け取り、年齢の昇順でソートした新しい配列を返す \`sortByAge\` 関数を実装してください。

## Copilot活用のポイント
1. 型定義（interface Person）を先に書く
2. 関数名 \`sortByAge\` を入力した後、\`Option/Alt + ]\` で複数の提案を確認
3. 異なる実装方法を比較:
   - sort を使った方法（破壊的/非破壊的）
   - アロー関数 vs 通常の関数
   - 三項演算子 vs 減算

## 要件
- インターフェース名: \`Person\`（id, name, age を持つ）
- 関数名: \`sortByAge\`
- 引数: \`people: Person[]\`
- 戻り値: \`Person[]\`
- 元の配列は変更しない（新しい配列を返す）
- 年齢の昇順でソート

## 例
\`\`\`typescript
sortByAge([
  { id: '1', name: 'Alice', age: 30 },
  { id: '2', name: 'Bob', age: 25 },
  { id: '3', name: 'Charlie', age: 35 }
])
// => [Bob(25), Alice(30), Charlie(35)]
\`\`\`

## ヒント
- まず \`interface Person\` を定義してから関数を書き始めましょう
- \`[...people]\` や \`people.slice()\` で配列をコピーしてから sort すると、元の配列を変更せずに済みます
`,
    starterCode: `// TODO: Person インターフェースを定義してください
// id: string, name: string, age: number を持つ

// TODO: 年齢でソートする関数を実装してください
`,
    testCode: `import { sortByAge, Person } from './main'

describe('sortByAge', () => {
  const people: Person[] = [
    { id: '1', name: 'Alice', age: 30 },
    { id: '2', name: 'Bob', age: 25 },
    { id: '3', name: 'Charlie', age: 35 },
    { id: '4', name: 'David', age: 20 },
  ]

  test('年齢の昇順でソート', () => {
    const result = sortByAge(people)
    expect(result.map(p => p.age)).toEqual([20, 25, 30, 35])
    expect(result.map(p => p.name)).toEqual(['David', 'Bob', 'Alice', 'Charlie'])
  })

  test('元の配列を変更しない', () => {
    const original = [...people]
    sortByAge(people)
    expect(people).toEqual(original)
  })

  test('空の配列', () => {
    expect(sortByAge([])).toEqual([])
  })

  test('1人だけ', () => {
    const single = [{ id: '1', name: 'Alice', age: 30 }]
    expect(sortByAge(single)).toEqual(single)
  })

  test('同じ年齢', () => {
    const samAge = [
      { id: '1', name: 'Alice', age: 25 },
      { id: '2', name: 'Bob', age: 25 },
    ]
    const result = sortByAge(samAge)
    expect(result.every(p => p.age === 25)).toBe(true)
  })
})
`,
    solutionCode: `// Person インターフェースの定義
export interface Person {
  id: string
  name: string
  age: number
}

// 年齢でソートする関数
export function sortByAge(people: Person[]): Person[] {
  return [...people].sort((a, b) => a.age - b.age)
}

// 別解1: slice() でコピー
// export function sortByAge(people: Person[]): Person[] {
//   return people.slice().sort((a, b) => a.age - b.age)
// }

// 別解2: 三項演算子を使う
// export function sortByAge(people: Person[]): Person[] {
//   return [...people].sort((a, b) => a.age < b.age ? -1 : a.age > b.age ? 1 : 0)
// }

// 別解3: 通常の関数構文
// export function sortByAge(people: Person[]): Person[] {
//   return [...people].sort(function(a, b) {
//     return a.age - b.age
//   })
// }
`,
    tags: '["typescript", "array", "sort", "interface"]',
    hints: '[\"sort メソッドは元の配列を変更するので、先にコピーしましょう\", \"a.age - b.age で昇順ソートができます\", \"spread演算子 [...people] が最もモダンな書き方です\"]',
    isPublished: true,
    dependencies: '[]',
  },
]
