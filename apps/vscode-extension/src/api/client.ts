import * as vscode from 'vscode'
import axios, { AxiosInstance } from 'axios'

export class ApiClient {
  private client: AxiosInstance
  private token: string = ''

  constructor(private context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration('copilotSkillBuilder')
    const apiUrl = config.get<string>('apiUrl', 'http://localhost:3000')

    this.client = axios.create({
      baseURL: apiUrl + '/api',
      timeout: 10000,
    })
  }

  async setToken(token: string) {
    this.token = token
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`
    console.log('Token set in ApiClient:', token.substring(0, 10) + '...')
    console.log('Authorization header:', this.client.defaults.headers.common['Authorization'])
  }

  async getMissions() {
    const response = await this.client.get('/missions')
    return response.data.missions
  }

  async getMission(missionId: string) {
    const response = await this.client.get(`/missions/${missionId}`)
    return response.data.mission
  }

  async getProgress() {
    const response = await this.client.get('/progress')
    return response.data.progress
  }

  async updateProgress(
    missionId: string,
    status: string,
    submittedCode?: string
  ) {
    const response = await this.client.post('/progress', {
      missionId,
      status,
      submittedCode,
    })
    return response.data.progress
  }

  async getCourses() {
    const response = await this.client.get('/courses')
    return response.data.courses
  }

  async syncCode(missionId: string, code: string) {
    console.log('ApiClient.syncCode called:', { missionId, codeLength: code.length })
    console.log('Current token:', this.token ? `Set (${this.token.substring(0, 10)}...)` : 'Not set')
    console.log('Request URL:', `${this.client.defaults.baseURL}/missions/${missionId}/code-sync`)
    
    try {
      const response = await this.client.post(`/missions/${missionId}/code-sync`, {
        code,
      })
      console.log('Sync response:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Sync error:', error.response?.status, error.response?.data)
      throw error
    }
  }
}
