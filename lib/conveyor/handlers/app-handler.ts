import { type App } from 'electron'
import { promises as fs } from 'fs'
import { dirname, join } from 'path'
import { spawn } from 'child_process'
import { handle } from '@/lib/main/shared'

type Settings = {
  gameExecutablePath: string
  gameServerUrl: string
  chatServerUrl: string
}

const defaultSettings: Settings = {
  gameExecutablePath: '',
  gameServerUrl: '',
  chatServerUrl: '',
}

const getSettingsPath = (app: App) => {
  const userData = app.getPath('userData')
  return join(userData, 'settings.yaml')
}

const parseSettingsYaml = (content: string): Settings => {
  const result: Settings = { ...defaultSettings }

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const [key, ...rest] = line.split(':')
    if (!key || rest.length === 0) continue
    let value = rest.join(':').trim()
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1)
    }

    if (key === 'gameExecutablePath') result.gameExecutablePath = value
    if (key === 'gameServerUrl') result.gameServerUrl = value
    if (key === 'chatServerUrl') result.chatServerUrl = value
  }

  return result
}

const serializeSettingsYaml = (settings: Settings): string => {
  const escape = (v: string) => v.replace(/"/g, '\\"')
  return [
    `gameExecutablePath: "${escape(settings.gameExecutablePath)}"`,
    `gameServerUrl: "${escape(settings.gameServerUrl)}"`,
    `chatServerUrl: "${escape(settings.chatServerUrl)}"`,
    '',
  ].join('\n')
}

export const registerAppHandlers = (app: App) => {
  // App operations
  handle('version', () => app.getVersion())

  handle('settings-get', async () => {
    const settingsPath = getSettingsPath(app)
    try {
      const content = await fs.readFile(settingsPath, 'utf-8')
      return parseSettingsYaml(content)
    } catch {
      // If file does not exist or cannot be parsed, return defaults
      return defaultSettings
    }
  })

  handle('settings-save', async (settings: Settings) => {
    const settingsPath = getSettingsPath(app)
    const yaml = serializeSettingsYaml(settings)
    await fs.mkdir(dirname(settingsPath), { recursive: true }).catch(() => {})
    await fs.writeFile(settingsPath, yaml, 'utf-8')
  })

  handle('launch-game', async () => {
    const settingsPath = getSettingsPath(app)
    const content = await fs.readFile(settingsPath, 'utf-8').catch(() => '')
    const settings = content ? parseSettingsYaml(content) : defaultSettings

    const exe = settings.gameExecutablePath.trim()
    if (!exe) {
      throw new Error('Game executable path is not configured.')
    }

    const args: string[] = []
    if (settings.gameServerUrl.trim()) {
      args.push(`--gameServerUrl=${settings.gameServerUrl.trim()}`)
    }
    if (settings.chatServerUrl.trim()) {
      args.push(`--chatServerUrl=${settings.chatServerUrl.trim()}`)
    }

    try {
      // On macOS, launch .app bundles via `open` to avoid EACCES on the bundle path
      if (process.platform === 'darwin' && exe.endsWith('.app')) {
        const child = spawn('open', ['-n', exe, '--args', ...args], {
          detached: true,
          stdio: 'ignore',
        })
        child.unref()
        return
      }

      const child = spawn(exe, args, {
        detached: true,
        stdio: 'ignore',
      })

      child.unref()
    } catch (error) {
      console.error('Failed to launch game executable', error)
      throw new Error('Failed to launch game executable. Please check the path and file permissions.')
    }
  })
}
