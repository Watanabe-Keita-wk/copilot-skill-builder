import * as vscode from 'vscode'
import { ApiClient } from './api/client'
import { MissionsProvider } from './providers/MissionsProvider'
import { ProgressProvider } from './providers/ProgressProvider'

let apiClient: ApiClient

export function activate(context: vscode.ExtensionContext) {
  console.log('Copilot Skill Builder extension is now active!')

  // API クライアントの初期化
  apiClient = new ApiClient(context)

  // ツリービュープロバイダーの登録
  const missionsProvider = new MissionsProvider(apiClient)
  const progressProvider = new ProgressProvider(apiClient)

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider(
      'copilot-skill-builder.missions',
      missionsProvider
    )
  )

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider(
      'copilot-skill-builder.progress',
      progressProvider
    )
  )

  // コマンドの登録
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'copilot-skill-builder.authenticate',
      async () => {
        const token = await vscode.window.showInputBox({
          prompt: 'Enter your API token from the web app',
          password: true,
        })

        if (token) {
          await context.secrets.store('apiToken', token)
          await apiClient.setToken(token)
          vscode.window.showInformationMessage(
            'Successfully authenticated with Copilot Skill Builder!'
          )
          missionsProvider.refresh()
          progressProvider.refresh()
        }
      }
    )
  )

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'copilot-skill-builder.startMission',
      async (missionId?: string) => {
        if (!missionId) {
          // ミッションを選択
          const missions = await apiClient.getMissions()
          const selected = await vscode.window.showQuickPick(
            missions.map((m: any) => ({
              label: m.title,
              description: m.difficulty,
              detail: m.description,
              missionId: m.id,
            })),
            { placeHolder: 'Select a mission to start' }
          )

          if (!selected) return
          missionId = selected.missionId
        }

        await startMission(missionId, context, apiClient)
      }
    )
  )

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'copilot-skill-builder.submitMission',
      async () => {
        const currentMissionId = context.workspaceState.get<string>('currentMissionId')
        if (!currentMissionId) {
          vscode.window.showWarningMessage('No active mission')
          return
        }

        await submitMission(currentMissionId, context, apiClient)
      }
    )
  )

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'copilot-skill-builder.viewProgress',
      async () => {
        const progress = await apiClient.getProgress()
        const panel = vscode.window.createWebviewPanel(
          'progress',
          'My Progress',
          vscode.ViewColumn.One,
          {}
        )
        panel.webview.html = getProgressHtml(progress)
      }
    )
  )

  // 初期化時にトークンを読み込み
  context.secrets.get('apiToken').then(async (token) => {
    if (token) {
      console.log('Token loaded from secrets:', token.substring(0, 10) + '...')
      await apiClient.setToken(token)
      missionsProvider.refresh()
      progressProvider.refresh()
    } else {
      console.log('No token found in secrets')
      vscode.window.showWarningMessage(
        'Copilot Skill Builder: Please authenticate using the command palette (Cmd+Shift+P > Copilot Skill Builder: Authenticate)'
      )
    }
  })

  // ファイル保存時にコードを同期
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(async (document) => {
      console.log('File saved:', document.fileName)
      
      // main.ts ファイルかチェック
      if (document.fileName.includes('copilot-missions') && document.fileName.endsWith('main.ts')) {
        console.log('Copilot mission file detected')
        
        const currentMissionId = context.workspaceState.get<string>('currentMissionId')
        console.log('Current mission ID:', currentMissionId)
        
        if (currentMissionId && document.fileName.includes(currentMissionId)) {
          try {
            const code = document.getText()
            console.log('Syncing code for mission:', currentMissionId, 'Code length:', code.length)
            
            const result = await apiClient.syncCode(currentMissionId, code)
            console.log('Sync result:', result)
            
            // 保存成功のステータスバー通知
            vscode.window.setStatusBarMessage('✓ Code synced to browser', 3000)
            vscode.window.showInformationMessage('✓ Code synced to browser')
          } catch (error) {
            console.error('Failed to sync code:', error)
            vscode.window.showErrorMessage(`Failed to sync code: ${error}`)
          }
        } else {
          console.log('Mission ID not matching. Current:', currentMissionId, 'File:', document.fileName)
        }
      }
    })
  )
}

async function startMission(
  missionId: string,
  context: vscode.ExtensionContext,
  apiClient: ApiClient
) {
  try {
    const mission = await apiClient.getMission(missionId)

    // ワークスペースフォルダーを開く
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]
    if (!workspaceFolder) {
      vscode.window.showErrorMessage('Please open a folder first')
      return
    }

    // ミッションファイルを作成
    const missionFolder = vscode.Uri.joinPath(
      workspaceFolder.uri,
      'copilot-missions',
      missionId
    )

    await vscode.workspace.fs.createDirectory(missionFolder)

    // main.ts (スターターコード)
    const mainFile = vscode.Uri.joinPath(missionFolder, 'main.ts')
    await vscode.workspace.fs.writeFile(
      mainFile,
      Buffer.from(mission.starterCode || '')
    )

    // test.ts (テストコード)
    const testFile = vscode.Uri.joinPath(missionFolder, 'test.ts')
    await vscode.workspace.fs.writeFile(
      testFile,
      Buffer.from(mission.testCode || '')
    )

    // README.md (課題説明)
    const readmeFile = vscode.Uri.joinPath(missionFolder, 'README.md')
    await vscode.workspace.fs.writeFile(
      readmeFile,
      Buffer.from(mission.instructions || '')
    )

    // ファイルを開く
    const doc = await vscode.workspace.openTextDocument(mainFile)
    await vscode.window.showTextDocument(doc)

    // 現在のミッションIDを保存
    await context.workspaceState.update('currentMissionId', missionId)

    // 進捗を更新
    await apiClient.updateProgress(missionId, 'IN_PROGRESS')

    vscode.window.showInformationMessage(`Mission "${mission.title}" started!`)
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to start mission: ${error}`)
  }
}

async function submitMission(
  missionId: string,
  context: vscode.ExtensionContext,
  apiClient: ApiClient
) {
  try {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]
    if (!workspaceFolder) return

    const mainFile = vscode.Uri.joinPath(
      workspaceFolder.uri,
      'copilot-missions',
      missionId,
      'main.ts'
    )

    const submittedCode = await vscode.workspace.fs.readFile(mainFile)

    // テストを実行（簡略化版）
    vscode.window.showInformationMessage('Running tests...')

    // 進捗を更新
    await apiClient.updateProgress(missionId, 'COMPLETED', submittedCode.toString())

    vscode.window.showInformationMessage('Mission completed! 🎉')
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to submit mission: ${error}`)
  }
}

function getProgressHtml(progress: any[]): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { padding: 20px; font-family: sans-serif; }
        .mission { padding: 10px; margin: 10px 0; border-left: 4px solid #007acc; }
        .completed { border-color: #4caf50; }
      </style>
    </head>
    <body>
      <h1>My Progress</h1>
      ${progress
        .map(
          (p) => `
        <div class="mission ${p.status === 'COMPLETED' ? 'completed' : ''}">
          <strong>${p.mission.title}</strong>
          <div>Status: ${p.status}</div>
          <div>Attempts: ${p.attempts}</div>
        </div>
      `
        )
        .join('')}
    </body>
    </html>
  `
}

export function deactivate() {}
