import { ConveyorApi } from '@/lib/preload/shared'

export class AppApi extends ConveyorApi {
  version = () => this.invoke('version')

  getSettings = () => this.invoke('settings-get')
  saveSettings = (settings: {
    gameExecutablePath: string
    gameServerUrl: string
    chatServerUrl: string
  }) => this.invoke('settings-save', settings)

  launchGame = () => this.invoke('launch-game')
}
