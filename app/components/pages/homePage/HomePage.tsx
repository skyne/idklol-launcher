import { Page, setPage } from '@/app/states/router'
import { Button } from '../../ui/button/Button'
import ProfileIcon from '@/app/assets/paintedui/Profile_1.png'
import InfoBoxIcon from '@/app/assets/paintedui/Info_1.png'
import BackgroundImage from '@/app/assets/background_elf_2.png'
import { ButtonVariant } from '../../ui/button/Button.types'
import { Header } from '../../ui/header/Header'
import { InfoBox } from '../../ui/infoBox/InfoBox'

export const HomePage = () => {
  return (
    <div>
      <img src={BackgroundImage} alt="image" className="fixed top-[40px] bottom-0 right-0 h-screen" />
      <div className="flex flex-col gap-4 p-4">
        <Header title="Welcome <PlayerName>" />
        <div className="flex flex-col gap-2">
          <div onClick={() => setPage(Page.LOGIN)} className="mb-16 cursor-pointer">
            <InfoBox icon={ProfileIcon} title="Switch account" />
          </div>
          <InfoBox icon={InfoBoxIcon} title="Shard: EU-West" />
          <InfoBox icon={InfoBoxIcon} title="Server status: Operational" />
          <InfoBox icon={InfoBoxIcon} title="Patch notes" />
          <InfoBox icon={InfoBoxIcon} title="Dev diary" />
          <InfoBox icon={InfoBoxIcon} title="v1.2.3" />
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
        <Button variant={ButtonVariant.Large}>Play game</Button>
      </div>
    </div>
  )
}
