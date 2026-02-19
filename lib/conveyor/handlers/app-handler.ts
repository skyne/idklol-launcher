import { type App } from 'electron'
import { promises as fs } from 'fs'
import { dirname, join } from 'path'
import { spawn } from 'child_process'
import { handle } from '@/lib/main/shared'

type Settings = {
  gameExecutablePath: string
  gameServerUrl: string
  chatServerUrl: string
  keycloakUrl: string
  logFileName: string
}

const defaultSettings: Settings = {
  gameExecutablePath: '',
  gameServerUrl: '',
  chatServerUrl: '',
  keycloakUrl: 'http://localhost:8080',
  logFileName: 'date.log',
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
    if (key === 'keycloakUrl') result.keycloakUrl = value
    if (key === 'logFileName') result.logFileName = value
  }

  return result
}

const serializeSettingsYaml = (settings: Settings): string => {
  const escape = (v: string) => v.replace(/"/g, '\\"')
  return [
    `gameExecutablePath: "${escape(settings.gameExecutablePath)}"`,
    `gameServerUrl: "${escape(settings.gameServerUrl)}"`,
    `chatServerUrl: "${escape(settings.chatServerUrl)}"`,
    `keycloakUrl: "${escape(settings.keycloakUrl)}"`,
    `logFileName: "${escape(settings.logFileName)}"`,
    '',
  ].join('\n')
}

const resolveLogFileName = (name: string) => {
  const date = new Date().toISOString().slice(0, 10)
  if (!name || name === 'date.log') return `${date}.log`
  return name.replace('{date}', date)
}

export const registerAppHandlers = (app: App) => {
  // App operations
  handle('version', () => app.getVersion())

  handle('keycloak-status', async (baseUrl: string) => {
    const normalized = baseUrl.replace(/\/+$/, '')
    const statusUrl = `${normalized}/realms/idklol/.well-known/openid-configuration`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    try {
      const response = await fetch(statusUrl, { method: 'GET', cache: 'no-store', signal: controller.signal })
      if (!response.ok) {
        return { ok: false, registrationEndpoint: null as string | null }
      }
      const config = (await response.json()) as { registration_endpoint?: string }
      return { ok: true, registrationEndpoint: config.registration_endpoint ?? null }
    } catch {
      return { ok: false, registrationEndpoint: null as string | null }
    } finally {
      clearTimeout(timeoutId)
    }
  })

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

  handle(
    'log-debug',
    async (entry: { level: 'debug' | 'info' | 'warn' | 'error'; message: string; data?: unknown }) => {
      const settingsPath = getSettingsPath(app)
      const content = await fs.readFile(settingsPath, 'utf-8').catch(() => '')
      const settings = content ? parseSettingsYaml(content) : defaultSettings
      const logFileName = resolveLogFileName(settings.logFileName)
      const logsDir = join(app.getPath('userData'), 'logs')
      const logPath = join(logsDir, logFileName)

      await fs.mkdir(logsDir, { recursive: true }).catch(() => {})

      const payload = {
        ts: new Date().toISOString(),
        level: entry.level,
        message: entry.message,
        data: entry.data ?? null,
      }

      await fs.appendFile(logPath, `${JSON.stringify(payload)}\n`, 'utf-8').catch(() => {})
    }
  )

  handle('login', async (params: { baseUrl: string; username: string; password: string }) => {
    const normalized = params.baseUrl.replace(/\/+$/, '')
    const tokenUrl = `${normalized}/realms/idklol/protocol/openid-connect/token`

    const body = new URLSearchParams({
      grant_type: 'password',
      client_id: 'idklol-chat',
      username: params.username.trim(),
      password: params.password,
    })

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
        signal: controller.signal,
      })

      if (!response.ok) {
        const errorText = await response.text()
        
        // Parse error if it's JSON
        let errorMessage = errorText
        try {
          const errorJson = JSON.parse(errorText)
          if (errorJson.error === 'unauthorized_client') {
            errorMessage = 'Direct Access Grants (Resource Owner Password Credentials) is disabled for this client. Please enable it in Keycloak Admin Console:\n\n' +
              '1. Go to Clients → idklol-chat\n' +
              '2. Click Settings tab\n' +
              '3. Enable "Direct access grants"\n' +
              '4. Click Save\n\n' +
              `Original error: ${errorText}`
          } else if (errorJson.error_description) {
            errorMessage = errorJson.error_description
          }
        } catch {
          // Not JSON, use as-is
        }
        
        throw new Error(errorMessage)
      }

      const token = await response.json()
      return { success: true, token, error: null as string | null }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed.'
      return { success: false, token: null, error: message }
    } finally {
      clearTimeout(timeoutId)
    }
  })

  handle('register', async (params: { registrationEndpoint: string; username: string; email: string; password: string }) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
      const response = await fetch(params.registrationEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: 'idklol-chat',
          username: params.username.trim(),
          email: params.email.trim(),
          enabled: true,
          emailVerified: true,
          credentials: [
            {
              type: 'password',
              value: params.password,
              temporary: false,
            },
          ],
        }),
        signal: controller.signal,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Registration failed.')
      }

      return { success: true, error: null as string | null }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed.'
      return { success: false, error: message }
    } finally {
      clearTimeout(timeoutId)
    }
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
      args.push(`-gameServerUrl=${settings.gameServerUrl.trim()}`)
    }
    if (settings.chatServerUrl.trim()) {
      args.push(`-chatServerUrl=${settings.chatServerUrl.trim()}`)
    }
    const token = localStorage.getItem('idklol.auth.token')
    if (token) {
      args.push(`-authToken=${token}`)
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
