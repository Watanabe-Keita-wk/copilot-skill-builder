import * as vscode from 'vscode'
import { ApiClient } from '../api/client'

export class MissionsProvider implements vscode.TreeDataProvider<MissionItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<
    MissionItem | undefined | null | void
  >()
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event

  constructor(private apiClient: ApiClient) {}

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  getTreeItem(element: MissionItem): vscode.TreeItem {
    return element
  }

  async getChildren(element?: MissionItem): Promise<MissionItem[]> {
    if (!element) {
      // ルートレベル：全ミッションを取得
      try {
        const missions = await this.apiClient.getMissions()
        return missions.map(
          (mission: any) =>
            new MissionItem(
              mission.title,
              mission.id,
              mission.difficulty,
              mission.userProgress?.[0]?.status || 'NOT_STARTED',
              vscode.TreeItemCollapsibleState.None
            )
        )
      } catch (error: any) {
        console.error('Failed to load missions:', error)
        
        if (error.response?.status === 401) {
          vscode.window.showErrorMessage(
            'Authentication required. Please run "Copilot Skill Builder: Authenticate" command.'
          )
        } else {
          vscode.window.showErrorMessage(
            `Failed to load missions: ${error.message || 'Unknown error'}`
          )
        }
        return []
      }
    }

    return []
  }
}

class MissionItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly missionId: string,
    public readonly difficulty: string,
    public readonly status: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState)
    this.tooltip = `${this.label} - ${this.difficulty}`
    this.description = this.getDifficultyIcon() + ' ' + this.getStatusIcon()
    this.command = {
      command: 'copilot-skill-builder.startMission',
      title: 'Start Mission',
      arguments: [this.missionId],
    }
  }

  private getDifficultyIcon(): string {
    switch (this.difficulty) {
      case 'BEGINNER':
        return '🟢'
      case 'INTERMEDIATE':
        return '🟡'
      case 'ADVANCED':
        return '🔴'
      default:
        return '⚪'
    }
  }

  private getStatusIcon(): string {
    switch (this.status) {
      case 'COMPLETED':
        return '✅'
      case 'IN_PROGRESS':
        return '🔄'
      case 'FAILED':
        return '❌'
      default:
        return '📝'
    }
  }
}
