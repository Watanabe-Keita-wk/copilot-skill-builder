'use client'

interface OpenInVSCodeButtonProps {
  missionId: string
  missionTitle: string
}

export function OpenInVSCodeButton({ missionId, missionTitle }: OpenInVSCodeButtonProps) {
  const handleOpenInVSCode = () => {
    // VS Code URIスキーマを使用してミッションを開く
    // vscode://extension/EXTENSION_ID/mission?id=MISSION_ID
    // 実装例: カスタムプロトコルハンドラーを使用
    const vscodeUri = `vscode://copilot-skill-builder/mission/${missionId}`
    
    // まずVS Codeで開くことを試みる
    window.location.href = vscodeUri
    
    // フォールバック: 2秒後にまだページにいる場合は説明を表示
    setTimeout(() => {
      alert(
        'VS Code拡張機能が見つかりません。\n\n' +
        '1. VS Codeを開いてください\n' +
        '2. Copilot Skill Builder拡張機能をインストール/起動してください\n' +
        '3. 拡張機能のサイドバーからこのミッションを選択してください'
      )
    }, 2000)
  }

  return (
    <button
      onClick={handleOpenInVSCode}
      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
    >
      VS Codeで開く
    </button>
  )
}
