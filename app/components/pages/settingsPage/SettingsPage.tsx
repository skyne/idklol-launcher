import { useEffect, useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Page, setPage } from '@/app/states/router'

type SettingsState = {
  gameExecutablePath: string
  gameServerUrl: string
  chatServerUrl: string
}

const initialState: SettingsState = {
  gameExecutablePath: '',
  gameServerUrl: '',
  chatServerUrl: '',
}

export const SettingsPage = () => {
  const [settings, setSettings] = useState<SettingsState>(initialState)
  const [isSaving, setIsSaving] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const loaded = await window.conveyor.app.getSettings()
        if (!mounted) return
        setSettings({
          gameExecutablePath: loaded.gameExecutablePath ?? '',
          gameServerUrl: loaded.gameServerUrl ?? '',
          chatServerUrl: loaded.chatServerUrl ?? '',
        })
        setHasLoaded(true)
      } catch (error) {
        console.error('Failed to load settings', error)
        if (mounted) setHasLoaded(true)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  const updateField =
    (field: keyof SettingsState) =>
    (value: string) => {
      setSettings((prev) => ({ ...prev, [field]: value }))
    }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await window.conveyor.app.saveSettings(settings)
    } catch (error) {
      console.error('Failed to save settings', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleBrowseExecutable = async () => {
    try {
      const path = await window.conveyor.window.selectExecutable()
      if (path) {
        updateField('gameExecutablePath')(path)
      }
    } catch (error) {
      console.error('Failed to select executable', error)
    }
  }

  return (
    <div className="relative flex h-full bg-background text-foreground">
      {/* Shared painterly background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,253,250,1),_transparent_62%),radial-gradient(circle_at_bottom,_rgba(254,215,170,0.35),_transparent_58%)] dark:bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.95),_transparent_62%),radial-gradient(circle_at_bottom,_rgba(127,29,29,0.55),_transparent_58%)]" />
        <div className="absolute inset-0 mix-blend-soft-light opacity-70 [background-image:linear-gradient(118deg,rgba(254,215,170,0.55),transparent_36%,rgba(254,243,199,0.6)_72%,transparent)]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
        <div className="flex w-full flex-col gap-6 rounded-2xl border border-border/70 bg-card/90 px-5 py-6 shadow-[0_18px_48px_rgba(248,113,22,0.35)] backdrop-blur-xl sm:px-7 sm:py-7 lg:px-8 lg:py-8">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-500/85 dark:text-amber-300/85">
                Launcher settings
              </p>
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Configure your warpath
              </h1>
              <p className="text-xs text-slate-600/95 dark:text-slate-200/85">
                Choose where the Era client lives and which realms to speak to for
                gameplay and chat.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPage(Page.HOME)}
              className="text-[11px]"
            >
              Back to launcher
            </Button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Executable path */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-800 dark:text-slate-100">
                Game executable
              </label>
              <p className="text-[11px] text-slate-500/95 dark:text-slate-400/90">
                Point the launcher to the Era client executable used to start the game.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={settings.gameExecutablePath}
                  onChange={(e) => updateField('gameExecutablePath')(e.target.value)}
                  placeholder="/Games/Era/EraClient.exe"
                  className="h-9 w-full flex-1 rounded-md border border-border bg-background/95 px-3 text-sm text-foreground shadow-xs outline-none ring-0 transition-all placeholder:text-slate-400 focus-visible:border-orange-300 focus-visible:ring-2 focus-visible:ring-orange-200/80 dark:border-slate-700 dark:bg-slate-900/70 dark:placeholder:text-slate-500 dark:focus-visible:border-amber-300 dark:focus-visible:ring-amber-500/60"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleBrowseExecutable}
                  className="shrink-0 text-xs"
                >
                  Browse…
                </Button>
              </div>
            </div>

            {/* Game server URL */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-800 dark:text-slate-100">
                Game server URL
              </label>
              <p className="text-[11px] text-slate-500/95 dark:text-slate-400/90">
                REST or gateway endpoint used by the launcher to talk to the game
                backend.
              </p>
              <input
                type="text"
                value={settings.gameServerUrl}
                onChange={(e) => updateField('gameServerUrl')(e.target.value)}
                placeholder="https://game.era-legends.com"
                className="h-9 w-full rounded-md border border-border bg-background/95 px-3 text-sm text-foreground shadow-xs outline-none ring-0 transition-all placeholder:text-slate-400 focus-visible:border-orange-300 focus-visible:ring-2 focus-visible:ring-orange-200/80 dark:border-slate-700 dark:bg-slate-900/70 dark:placeholder:text-slate-500 dark:focus-visible:border-amber-300 dark:focus-visible:ring-amber-500/60"
              />
            </div>

            {/* Chat server URL */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-800 dark:text-slate-100">
                Chat server URL
              </label>
              <p className="text-[11px] text-slate-500/95 dark:text-slate-400/90">
                WebSocket or chat service endpoint for guild, party, and warband
                communication.
              </p>
              <input
                type="text"
                value={settings.chatServerUrl}
                onChange={(e) => updateField('chatServerUrl')(e.target.value)}
                placeholder="wss://chat.era-legends.com"
                className="h-9 w-full rounded-md border border-border bg-background/95 px-3 text-sm text-foreground shadow-xs outline-none ring-0 transition-all placeholder:text-slate-400 focus-visible:border-orange-300 focus-visible:ring-2 focus-visible:ring-orange-200/80 dark:border-slate-700 dark:bg-slate-900/70 dark:placeholder:text-slate-500 dark:focus-visible:border-amber-300 dark:focus-visible:ring-amber-500/60"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-2 flex items-center justify-between border-t border-border/70 pt-4">
            <p className="text-[11px] text-slate-500/95 dark:text-slate-400/90">
              Settings are stored in <span className="font-mono">settings.yaml</span>{' '}
              in your Era user data folder.
            </p>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={!hasLoaded || isSaving}
              className="h-8 px-4 text-xs bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white hover:from-amber-400 hover:via-orange-400 hover:to-rose-400"
            >
              {isSaving ? 'Saving…' : 'Save settings'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


