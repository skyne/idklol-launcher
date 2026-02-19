import { Page, setPage } from '@/app/states/router'
import { Button } from '../../ui/button/Button'
import ProfileIcon from '@/app/assets/paintedui/Profile_1.png'
import InfoBoxIcon from '@/app/assets/paintedui/Info_1.png'
import SettingsIcon from '@/app/assets/paintedui/Options_1.png'
import BackgroundImage from '@/app/assets/background_elf_2.png'
import { ButtonVariant } from '../../ui/button/Button.types'
import { Header } from '../../ui/header/Header'
import { InfoBox } from '../../ui/infoBox/InfoBox'
import { useState, useEffect } from 'react'

export const HomePage = () => {
  const [username, setUsername] = useState('Player')

  useEffect(() => {
    try {
      const userInfoStr = localStorage.getItem('idklol.auth.user')
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr)
        setUsername(userInfo.username || 'Player')
      }
    } catch (err) {
      console.error('Failed to load user info', err)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('idklol.auth.token')
    localStorage.removeItem('idklol.auth.user')
    setPage(Page.LOGIN)
  }

  return (
    <div>
      <img src={BackgroundImage} alt="image" className="fixed top-[40px] bottom-0 right-0 h-screen" />
      <div className="flex flex-col gap-4 p-4">
        <Header title={`Welcome ${username}`} />
        <div className="flex flex-col gap-2">
          <div onClick={handleLogout} className="mb-4 cursor-pointer">
            <InfoBox icon={ProfileIcon} title="Logout / Switch account" />
          </div>
          <InfoBox icon={InfoBoxIcon} title="Shard: EU-West" />
          <InfoBox icon={InfoBoxIcon} title="Server status: Operational" />
          <InfoBox icon={InfoBoxIcon} title="Patch notes" />
          <InfoBox icon={InfoBoxIcon} title="Dev diary" />
          <InfoBox icon={InfoBoxIcon} title="v1.2.3" />
          <InfoBox icon={SettingsIcon} title="Settings" onClick={() => setPage(Page.SETTINGS)} />
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
        <Button variant={ButtonVariant.Large} onClick={() => {
                void window.conveyor.app.launchGame()
              }}>Play game</Button>
      </div>
    </div>
  )
}
