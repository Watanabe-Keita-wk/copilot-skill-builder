# Copilot Skill Builder

GitHub Copilotを実践的に学ぶための学習プラットフォーム

## 🎯 概要

Copilot Skill Builderは、GitHub Copilotの使い方を実践的なミッションを通して学べる学習プラットフォームです。Webアプリケーションと VS Code拡張機能を組み合わせて、効率的なコーディングスキルを身につけることができます。

## ✨ 主な機能

### Webアプリケーション
- 📚 **構造化されたコース**: 初級から上級までステップバイステップで学習
- 🎯 **実践的なミッション**: 実際のコーディング課題に挑戦
- 📊 **進捗管理**: 学習の進捗を可視化して達成感を得られる
- 🔐 **認証システム**: NextAuth.jsによる安全なユーザー管理

### VS Code拡張機能
- 🚀 **ワンクリックでミッション開始**: Webアプリから直接VS Codeで課題を開始
- 🧪 **自動テスト実行**: コードを書いたらすぐにテスト結果を確認
- 📈 **リアルタイム進捗同期**: 進捗状況を自動的にWebアプリと同期
- 💡 **ヒント表示**: 詰まったときにヒントを参照可能

## 🛠️ 技術スタック

### フロントエンド
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**

### バックエンド
- **Next.js API Routes**
- **Prisma ORM**
- **SQLite** (ローカル開発用)

### 認証
- **NextAuth.js v5**
- **bcryptjs**

### VS Code拡張
- **TypeScript**
- **VS Code Extension API**

## 📋 必要要件

- **Node.js**: 18.x 以上
- **pnpm**: 8.x 以上
- **VS Code**: 1.80.0 以上（拡張機能を使用する場合）

## 🚀 セットアップ

### 1. リポジトリのクローン

\`\`\`bash
git clone <repository-url>
cd copilot-skill-builder
\`\`\`

### 2. 依存関係のインストール

\`\`\`bash
pnpm install
\`\`\`

### 3. 環境変数の設定

\`\`\`bash
cd apps/web
cp .env.example .env
\`\`\`

\`.env\`ファイルを編集:

\`\`\`env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
\`\`\`

### 4. データベースのセットアップ

\`\`\`bash
cd apps/web
pnpm prisma migrate dev
pnpm prisma db seed
\`\`\`

### 5. 開発サーバーの起動

\`\`\`bash
# プロジェクトルートから
pnpm dev
\`\`\`

アプリケーションが \`http://localhost:3000\` で起動します。

### 6. VS Code拡張機能のセットアップ（オプション）

1. VS Codeで`apps/vscode-extension`フォルダを開く

2. 依存関係をインストールしてビルド
   ```bash
   cd apps/vscode-extension
   pnpm install
   pnpm run build
   ```

3. **F5キー**を押して拡張機能をデバッグモードで起動
   - Mac: `fn + F5` または `Command + Shift + D` でデバッグビューを開いてから再生ボタンをクリック
   - Windows/Linux: `F5`

4. 新しいVS Codeウィンドウ（Extension Development Host）が開きます

5. **Extension Development Hostで作業フォルダを開く**
   - 新しく開いたウィンドウで、任意の空のフォルダまたは新規フォルダを開く
   - 推奨: ホームディレクトリに `copilot-missions` フォルダを作成して開く
     ```bash
     mkdir ~/copilot-missions
     ```
   - VS Codeで `File` > `Open Folder...` から `~/copilot-missions` を開く
   - ℹ️ このフォルダにミッションファイルが自動的に作成されます

6. **APIトークンの設定**
   
   a. Webアプリでトークンを生成
      - http://localhost:3000/settings を開く
      - 「新しいトークンを生成」をクリックしてコピー
   
   b. VS Codeでトークンを設定（推奨順）
   
   **推奨: コマンドパレットから**
   - コマンドパレット（Mac: `Command + Shift + P` / Win: `Ctrl + Shift + P`）を開く
   - "Copilot Skill Builder: Authenticate" を選択
   - トークンを貼り付けて Enter
   
   **または: 設定画面から**
   - 設定を開く（Mac: `Command + ,` / Win: `Ctrl + ,`）
   - "copilot skill builder" と検索
   - "Api Token" にトークンを貼り付け

7. サイドバーの「Copilot Skill Builder」アイコンをクリックしてミッション一覧を確認

## 📖 使い方

### 初回ログイン

1. \`http://localhost:3000\`にアクセス
2. 「新規登録」をクリック
3. アカウント情報を入力して登録

**テストアカウント（シードデータ）:**
- Email: \`test@example.com\`
- Password: \`password123\`

### コースを開始

1. ダッシュボードでコースを選択
2. レッスンを読んで基礎知識を学習
3. ミッションに挑戦

### VS Codeでミッションに挑戦

1. VS Code拡張機能のサイドバーから挑戦したいミッションを選択
2. ミッションが自動的に開始される
3. \`main.ts\`にコードを書く
4. テストを実行して結果を確認
5. 完了したら「Submit Mission」を実行

## 🗂️ プロジェクト構造

\`\`\`
copilot-skill-builder/
├── apps/
│   ├── web/                    # Next.jsアプリケーション
│   │   ├── app/               # App Router
│   │   │   ├── api/          # APIルート
│   │   │   ├── auth/         # 認証ページ
│   │   │   ├── courses/      # コースページ
│   │   │   ├── dashboard/    # ダッシュボード
│   │   │   ├── missions/     # ミッションページ
│   │   │   └── settings/     # 設定ページ
│   │   ├── components/        # Reactコンポーネント
│   │   ├── lib/              # ユーティリティ関数
│   │   ├── prisma/           # データベース
│   │   │   ├── migrations/  # マイグレーション履歴
│   │   │   └── seed-data/   # シードデータ
│   │   ├── types/            # TypeScript型定義
│   │   ├── next.config.js
│   │   ├── postcss.config.js
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── vscode-extension/      # VS Code拡張機能
│       ├── .vscode/          # デバッグ設定
│       ├── resources/        # リソースファイル
│       ├── src/
│       │   ├── api/         # APIクライアント
│       │   └── providers/   # ツリービュープロバイダー
│       ├── dist/            # ビルド出力
│       ├── package.json
│       └── tsconfig.json
│
├── .gitignore
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
\`\`\`

## 🔧 開発コマンド

\`\`\`bash
# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# データベースマイグレーション
pnpm db:migrate

# シードデータ投入
pnpm db:seed

# Prisma Studio起動
cd apps/web && pnpm db:studio

# VS Code拡張機能のビルド
cd apps/vscode-extension && pnpm build
\`\`\`

## 📝 データベーススキーマ

主要なモデル:

- **User**: ユーザー情報
- **Course**: コース
- **Lesson**: レッスン
- **Mission**: ミッション（課題）
- **UserMissionProgress**: ユーザーのミッション進捗
- **UserCourseProgress**: ユーザーのコース進捗
- **ApiToken**: VS Code拡張用APIトークン

## 🔧 トラブルシューティング

### Webアプリケーション

#### ログイン・認証関連

**ログアウト後にログインできない**
- ブラウザのキャッシュをクリア
- シークレット/プライベートウィンドウで試す
- データベースをリセット: `cd apps/web && pnpm prisma migrate reset`

**新規登録でエラーが出る**
- データベースが正しくセットアップされているか確認
- `cd apps/web && pnpm prisma migrate dev` を実行

#### ダッシュボード・表示関連

**ダッシュボードでエラーが表示される**
- ブラウザのコンソールでエラーを確認（F12キー）
- データベースにシードデータを投入: `cd apps/web && pnpm db:seed`
- Webサーバーを再起動

**画像やスタイルが表示されない**
- `cd apps/web && pnpm dev` でサーバーを再起動
- ブラウザのキャッシュをクリア

### VS Code拡張機能

#### セットアップ・起動関連

**「preLaunchTask 'watch' を待機しています...」で止まる**
1. デバッグを停止（赤い停止ボタンをクリック）
2. ターミナルで `pnpm run build` を実行
3. 再度F5キーでデバッグを開始

**「デバッガーの選択」画面が表示される**
1. `apps/vscode-extension/.vscode/launch.json`ファイルが存在するか確認
2. ファイルが存在しない場合は、以下の内容で作成:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Run Extension",
         "type": "extensionHost",
         "request": "launch",
         "args": ["--extensionDevelopmentPath=${workspaceFolder}"],
         "outFiles": ["${workspaceFolder}/dist/**/*.js"]
       }
     ]
   }
   ```
3. 再度F5キーを押してデバッグを開始

**拡張機能が表示されない**
- `dist/extension.js` ファイルが存在するか確認
- 存在しない場合は `pnpm run build` を実行
- VS Codeを完全に再起動

#### アイコン・表示関連

**サイドバーに「Copilot Skill Builder」アイコンが表示されない**
1. `resources/icon.svg` ファイルが存在するか確認
2. 拡張機能を再読み込み:
   - コマンドパレット（Mac: `Command + Shift + P` / Win: `Ctrl + Shift + P`）を開く
   - "Developer: Reload Window" を実行
3. それでも表示されない場合は、VS Codeを完全に再起動
4. アイコンがなくても、コマンドパレットから "Copilot Skill Builder" のコマンドは使用可能

**アイコンが真っ白または表示がおかしい**
1. `cd apps/vscode-extension && pnpm run build` を実行
2. VS Codeで "Developer: Reload Window" を実行

#### ミッション・データ表示関連

**「MISSIONS」や「PROGRESS」に何も表示されない**
1. APIトークンが正しく設定されているか確認
   - 設定画面（Mac: `Command + ,` / Win: `Ctrl + ,`）で "copilot skill builder" と検索
   - トークンが設定されているか確認
2. Webアプリが起動しているか確認（http://localhost:3000）
3. VS Codeの開発者コンソールでエラーを確認:
   - メニューから "Help" > "Toggle Developer Tools" を選択
   - "Console" タブでエラーメッセージを確認
4. データベースにミッションが存在するか確認:
   - `cd apps/web && pnpm db:seed` を実行してサンプルデータを投入
5. VS Codeウィンドウを再読み込み（"Developer: Reload Window"）

**APIトークンが機能しない**
1. トークンを再生成:
   - http://localhost:3000/settings を開く
   - 既存のトークンを削除
   - 新しいトークンを生成
2. VS Codeで再認証:
   - コマンドパレットから "Copilot Skill Builder: Authenticate" を実行
   - 新しいトークンを入力

### データベース関連

**マイグレーションエラー**
```bash
cd apps/web
pnpm prisma migrate reset  # 警告: 全データが削除されます
pnpm prisma migrate dev
pnpm db:seed
```

**データが表示されない**
```bash
cd apps/web
pnpm db:seed  # サンプルデータを投入
```

**Prisma Studioが起動しない**
```bash
cd apps/web
pnpm db:studio
# ブラウザで http://localhost:5555 を開く
```

### 一般的な問題

**依存関係のエラー**
```bash
# プロジェクトルートで
rm -rf node_modules
rm -rf apps/*/node_modules
pnpm install
```

**ポートが既に使用されている**
- Webアプリ（3000番ポート）が起動できない場合:
  - 他のプロセスを終了: `lsof -ti:3000 | xargs kill -9`
  - または `.env` で別のポートを指定

**Mac特有の問題**
- Fn + F5でデバッグが起動しない場合:
  - `Command + Shift + D` でデバッグビューを開く
  - 「Run Extension」を選択して再生ボタンをクリック

### さらなるヘルプ

上記で解決しない場合:
1. ブラウザとVS Codeの開発者ツール（コンソール）でエラーメッセージを確認
2. ターミナルのログを確認
3. GitHubリポジトリでIssueを作成

## 📄 ライセンス

MIT License

## 🙏 謝辞

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## 📧 お問い合わせ

質問や提案がありましたら、Issueを作成してください。

---

Made with ❤️ for GitHub Copilot learners
