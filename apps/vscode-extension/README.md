# Copilot Skill Builder - VS Code Extension

GitHub Copilotのスキルを実践的に学ぶためのVS Code拡張機能

## 機能

### 🎯 ミッション管理
- Webアプリから同期されたミッション一覧を表示
- ワンクリックでミッションを開始
- 進捗状況をリアルタイムで表示

### 📝 自動ファイル生成
- スターターコードの自動生成
- テストコードの自動配置
- README（課題説明）の自動生成

### 🧪 テスト実行
- ミッション完了時の自動テスト実行
- 結果をWebアプリに自動同期

### 🔐 セキュアな認証
- APIトークンによる安全な認証
- VS Code Secretsへの安全な保存

## インストール

### 開発版

1. このリポジトリをクローン
2. \`apps/vscode-extension\`ディレクトリで依存関係をインストール:
   \`\`\`bash
   cd apps/vscode-extension
   pnpm install
   \`\`\`
3. VS Codeでこのディレクトリを開く
4. F5キーを押してデバッグモードで起動

### Marketplace版（準備中）

VS Code Marketplaceで"Copilot Skill Builder"を検索してインストール

## セットアップ

1. Webアプリ（http://localhost:3000）にアクセス
2. ログイン後、設定ページへ移動
3. APIトークンを生成
4. VS Codeのコマンドパレット（Cmd/Ctrl + Shift + P）を開く
5. 「Copilot Skill Builder: Authenticate」を実行
6. 生成したトークンを貼り付け

## 使い方

### ミッションを開始

1. アクティビティバーの「Copilot Skill Builder」アイコンをクリック
2. 「Missions」ビューからミッションを選択
3. ミッションファイルが自動的に生成されます

または:

- コマンドパレットから「Copilot Skill Builder: Start Mission」を実行
- ミッションを選択

### ミッションを完了

1. \`main.ts\`にコードを書く
2. コマンドパレットから「Copilot Skill Builder: Submit Mission」を実行
3. テストが実行され、結果がWebアプリに同期されます

### 進捗を確認

- 「Progress」ビューで自分の進捗を確認
- または「Copilot Skill Builder: View Progress」コマンドで詳細表示

## コマンド

| コマンド | 説明 |
|---------|------|
| \`Copilot Skill Builder: Authenticate\` | APIトークンを設定 |
| \`Copilot Skill Builder: Start Mission\` | 新しいミッションを開始 |
| \`Copilot Skill Builder: Submit Mission\` | 現在のミッションを提出 |
| \`Copilot Skill Builder: View Progress\` | 進捗を表示 |

## 設定

| 設定項目 | デフォルト値 | 説明 |
|---------|-------------|------|
| \`copilotSkillBuilder.apiToken\` | (空) | Webアプリで生成したAPIトークン |
| \`copilotSkillBuilder.apiUrl\` | \`http://localhost:3000\` | WebアプリのURL |

## トラブルシューティング

### 認証エラー

- APIトークンが正しく設定されているか確認
- Webアプリが起動しているか確認
- トークンが有効期限切れでないか確認

### ミッションが表示されない

- 認証が完了しているか確認
- Webアプリでミッションが公開されているか確認

### テストが失敗する

- コードが正しく実装されているか確認
- テストファイルが破損していないか確認

## 要件

- VS Code 1.80.0 以上
- Webアプリが起動していること
- 有効なAPIトークン

## フィードバック

問題や提案がありましたら、[GitHubのIssue](https://github.com/your-repo/issues)でお知らせください。

## ライセンス

MIT License
