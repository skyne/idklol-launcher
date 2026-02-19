import { useEffect, useState } from 'react'
import { Button } from '@/app/components/ui/button/Button'
import { Page, setPage } from '@/app/states/router'
import { Header } from '@/app/components/ui/header/Header'
import { Input } from '@/app/components/ui/input/Input'
import { InfoBox } from '@/app/components/ui/infoBox/InfoBox'
import BackgroundImage from '@/app/assets/background_elf.png'
import SettingsIcon from '@/app/assets/paintedui/Options_1.png'
import { ButtonVariant } from '@/app/components/ui/button/Button.types'

type SettingsState = {
  gameExecutablePath: string
  gameServerUrl: string
  chatServerUrl: string
  keycloakUrl: string
  logFileName: string
}

const initialState: SettingsState = {
  gameExecutablePath: '',
  gameServerUrl: '',
  chatServerUrl: '',
  keycloakUrl: 'http://localhost:8080',
  logFileName: 'date.log',
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
          keycloakUrl: loaded.keycloakUrl ?? '',
          logFileName: loaded.logFileName ?? 'date.log',
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
    <div>
      <img src={BackgroundImage} alt="image" className="fixed top-[40px] bottom-0 right-0 h-screen" />
      <div className="flex flex-col gap-4 p-4">
        <Header title="Settings" />
        
        <div className="flex flex-col gap-2 z-10">
          {/* Game Executable */}
          <div className="flex flex-col gap-1">
            <Input 
              label="Game Executable:" 
              value={settings.gameExecutablePath}
              onChange={(e) => updateField('gameExecutablePath')(e.target.value)}
              placeholder="/path/to/game.exe"
            />
            <Button 
              variant={ButtonVariant.Small}
              onClick={handleBrowseExecutable}
            >
              Browse
            </Button>
          </div>

          {/* Game Server URL */}
          <Input 
            label="Game Server URL:" 
            value={settings.gameServerUrl}
            onChange={(e) => updateField('gameServerUrl')(e.target.value)}
            placeholder="https://game.server.com"
          />

          {/* Chat Server URL */}
          <Input 
            label="Chat Server URL:" 
            value={settings.chatServerUrl}
            onChange={(e) => updateField('chatServerUrl')(e.target.value)}
            placeholder="wss://chat.server.com"
          />

          {/* Keycloak URL */}
          <Input
            label="Keycloak URL:"
            value={settings.keycloakUrl}
            onChange={(e) => updateField('keycloakUrl')(e.target.value)}
            placeholder="http://localhost:8080"
          />

          {/* Log File Name */}
          <Input
            label="Log File Name:"
            value={settings.logFileName}
            onChange={(e) => updateField('logFileName')(e.target.value)}
            placeholder="date.log or {date}.log"
          />

          {/* Settings Info */}
          <div className="mt-8">
            <InfoBox icon={SettingsIcon} title="Back to Home" onClick={() => setPage(Page.HOME)} />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
        <Button 
          variant={ButtonVariant.Large} 
          onClick={handleSave}
          disabled={!hasLoaded || isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}


