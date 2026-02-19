import { useEffect, useMemo, useState } from 'react'
import { Page, setPage } from '@/app/states/router'
import { Header } from '../../ui/header/Header'
import { Input } from '../../ui/input/Input'
import { Button } from '../../ui/button/Button'
import BackgroundImage from '@/app/assets/background_elf.png'
import { ButtonVariant } from '../../ui/button/Button.types'
import { Badge } from '../../ui/badge'

export const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [keycloakUrl, setKeycloakUrl] = useState('')
  const [serverStatus, setServerStatus] = useState<'unknown' | 'online' | 'offline'>('unknown')

  const writeLog = (level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: unknown) => {
    try {
      void window.conveyor.app.logDebug({ level, message, data })
    } catch {
      // ignore logging errors
    }
  }

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const loaded = await window.conveyor.app.getSettings()
        if (!mounted) return
        setKeycloakUrl((loaded.keycloakUrl ?? '').trim())
      } catch (err) {
        console.error('Failed to load settings', err)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  const normalizedKeycloakUrl = useMemo(() => keycloakUrl.replace(/\/+$/, ''), [keycloakUrl])

  useEffect(() => {
    if (!normalizedKeycloakUrl) {
      setServerStatus('offline')
      return
    }

    let mounted = true
    let intervalId: ReturnType<typeof setInterval> | null = null

    const checkStatus = async () => {
      try {
        writeLog('debug', 'checking keycloak status', { baseUrl: normalizedKeycloakUrl })
        const status = await window.conveyor.app.getKeycloakStatus(normalizedKeycloakUrl)
        writeLog('debug', 'keycloak status result', status)
        if (!mounted) return
        setServerStatus(status.ok ? 'online' : 'offline')
      } catch {
        if (!mounted) return
        setServerStatus('offline')
      }
    }

    void checkStatus()
    intervalId = setInterval(checkStatus, 15000)

    return () => {
      mounted = false
      if (intervalId) clearInterval(intervalId)
    }
  }, [normalizedKeycloakUrl])

  const login = async () => {
    if (!normalizedKeycloakUrl) {
      setError('Keycloak URL is not configured. Set it in Settings.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      writeLog('info', 'login token request', { baseUrl: normalizedKeycloakUrl, username: username.trim() })

      const result = await window.conveyor.app.login({
        baseUrl: normalizedKeycloakUrl,
        username: username.trim(),
        password,
      })

      if (!result.success) {
        writeLog('warn', 'login failed', { error: result.error })
        throw new Error(result.error || 'Login failed.')
      }

      writeLog('info', 'login success', { hasAccessToken: Boolean(result.token?.access_token) })
      writeLog('debug', 'full login result', result)
      
      // Decode JWT to extract user info
      try {
        const accessToken = result.token.access_token
        const parts = accessToken.split('.')
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]))
          const userInfo = {
            username: payload.preferred_username || username.trim(),
            email: payload.email || '',
          }
          localStorage.setItem('idklol.auth.user', JSON.stringify(userInfo))
          writeLog('debug', 'decoded user info', userInfo)
        }
      } catch (decodeErr) {
        console.error('Failed to decode JWT', decodeErr)
        writeLog('warn', 'failed to decode JWT', { error: decodeErr instanceof Error ? decodeErr.message : String(decodeErr) })
      }
      
      localStorage.setItem('idklol.auth.token', JSON.stringify(result.token))
      setPage(Page.HOME)
    } catch (err) {
      writeLog('error', 'login failed', { error: err instanceof Error ? err.message : String(err) })
      setError(err instanceof Error ? err.message : 'Login failed.')
    } finally {
      setIsLoading(false)
    }
  }

  const openRegistration = async () => {
    if (!normalizedKeycloakUrl) {
      setError('Keycloak URL is not configured. Set it in Settings.')
      return
    }

    try {
      writeLog('info', 'opening Keycloak registration page')
      const registrationUrl = `${normalizedKeycloakUrl}/realms/idklol/protocol/openid-connect/registrations?client_id=idklol-chat&response_type=code&redirect_uri=http://localhost/callback`
      await window.conveyor.window.webOpenUrl(registrationUrl)
    } catch (err) {
      writeLog('error', 'failed to open registration', { error: err instanceof Error ? err.message : String(err) })
      setError('Failed to open registration page. Please enable self-registration in Keycloak.')
    }
  }

  const handleSubmit = () => {
    if (isLoading) return
    void login()
  }

  return (
    <div className="fixed inset-0 overflow-hidden overscroll-none">
      <img src={BackgroundImage} alt="image" className="fixed top-[40px] bottom-0 right-0 h-screen" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/55 to-black/10" />

      <div className="relative z-10 flex flex-col gap-3 p-5 max-w-lg w-full text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] overflow-hidden">
        <div className="mt-2">
          <Header title="IDKLOL - Login" />
        </div>

        <div className="flex flex-col gap-3 bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md shadow-2xl max-h-[calc(100vh-170px)] overflow-hidden">
          <Input
            label="Username:"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="Password:"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />

          <div className="min-h-[72px] space-y-2">
            {error && (
              <div className="text-red-100 text-sm bg-red-900/60 border border-red-500/40 rounded px-3 py-2 backdrop-blur-sm">
                {error}
              </div>
            )}

            {!normalizedKeycloakUrl && (
              <div className="text-yellow-100 text-sm bg-yellow-900/60 border border-yellow-500/40 rounded px-3 py-2 backdrop-blur-sm">
                Keycloak URL is not configured. Set it in Settings.
                <button className="ml-2 underline font-semibold hover:text-yellow-50" onClick={() => setPage(Page.SETTINGS)}>
                  Go to Settings
                </button>
              </div>
            )}
          </div>

          <div className="mt-0">
            <Button onClick={handleSubmit} variant={ButtonVariant.Large}>
              {isLoading ? 'Working...' : 'Login'}
            </Button>
          </div>

          <button
            onClick={openRegistration}
            className="text-sm underline transition-colors self-start mt-0 text-white hover:text-gray-100"
          >
            Need an account? Register
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/85 via-black/65 to-transparent backdrop-blur-md border-t border-white/10 flex items-center justify-end px-6 z-20">
        <Badge
          variant={serverStatus === 'online' ? 'secondary' : serverStatus === 'offline' ? 'destructive' : 'outline'}
          className="flex items-center gap-2 shadow-lg"
        >
          <span
            className={
              serverStatus === 'online'
                ? 'h-2 w-2 rounded-full bg-emerald-500 animate-pulse'
                : serverStatus === 'offline'
                  ? 'h-2 w-2 rounded-full bg-red-500'
                  : 'h-2 w-2 rounded-full bg-yellow-400 animate-pulse'
            }
          />
          {serverStatus === 'online' ? 'Server Online' : serverStatus === 'offline' ? 'Server Offline' : 'Checking Server'}
        </Badge>
      </div>
    </div>
  )
}
