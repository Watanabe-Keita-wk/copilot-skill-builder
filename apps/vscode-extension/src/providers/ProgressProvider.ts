import * as vscode from 'vscode'
import { ApiClient } from '../api/client'

export class ProgressProvider implements vscode.TreeDataProvider<ProgressItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<
    ProgressItem | undefined | null | void
  >()
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event

  constructor(private apiClient: ApiClient) {}

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  getTreeItem(element: ProgressItem): vscode.TreeItem {
    return element
  }

  async getChildren(element?: ProgressItem): Promise<ProgressItem[]> {
    if (!element) {
      try {
        const progress = await this.apiClient.getProgress()
        return progress.map(
          (p: any) =>
            new ProgressItem(
              p.mission.title,
              p.status,
              p.attempts,
              p.completedAt,
              vscode.TreeItemCollapsibleState.None
            )
        )
      } catch (error) {
        vscode.window.showErrorMessage('Failed to load progress')
        return []
      }
    }

    return []
  }
}

class ProgressItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly status: string,
    public readonly attempts: number,
    public readonly completedAt: string | null,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState)
    this.description = this.getStatusText()
    this.tooltip = this.getTooltip()
  }

  private getStatusText(): string {
    switch (this.status) {
      case 'COMPLETED':
        return '✅ Completed'
      case 'IN_PROGRESS':
        return '🔄 In Progress'
      case 'FAILED':
        return '❌ Failed'
      default:
        return '📝 Not Started'
    }
  }

  private getTooltip(): string {
    let tooltip = `Status: ${this.status}\nAttempts: ${this.attempts}`
    if (this.completedAt) {
      tooltip += `\nCompleted: ${new Date(this.completedAt).toLocaleDateString()}`
    }
    return tooltip
  }
}
