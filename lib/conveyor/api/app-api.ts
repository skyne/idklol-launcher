import { ConveyorApi } from '@/lib/preload/shared'

export class AppApi extends ConveyorApi {
  version = () => this.invoke('version')

  getKeycloakStatus = (baseUrl: string) => this.invoke('keycloak-status', baseUrl)
  logDebug = (entry: { level: 'debug' | 'info' | 'warn' | 'error'; message: string; data?: unknown }) =>
    this.invoke('log-debug', entry)

  getSettings = () => this.invoke('settings-get')
  saveSettings = (settings: {
    gameExecutablePath: string
    gameServerUrl: string
    chatServerUrl: string
    keycloakUrl: string
    logFileName: string
  }) => this.invoke('settings-save', settings)

  login = (params: { baseUrl: string; username: string; password: string }) => this.invoke('login', params)

  register = (params: { registrationEndpoint: string; username: string; email: string; password: string }) =>
    this.invoke('register', params)

  launchGame = () => this.invoke('launch-game')
}
