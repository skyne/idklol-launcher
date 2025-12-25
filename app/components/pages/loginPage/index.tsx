import { Page, setPage } from '@/app/states/router'
import { Header } from '../../ui/header/Header'
import { Input } from '../../ui/input/Input'
import { Button } from '../../ui/button/Button'
import BackgroundImage from '@/app/assets/background_elf.png'
import { ButtonVariant } from '../../ui/button/Button.types'

export const LoginPage = () => {
  const handleLogin = () => {
    setPage(Page.HOME)
  }

  return (
    <div className="inline-flex shrink-0 grow-0">
      <img src={BackgroundImage} alt="image" className="fixed top-[40px] bottom-0 right-0 h-screen" />
      <div className="flex flex-col gap-16 p-4">
        <Header title="IDKLOL - Login" />
        <div className="flex flex-col gap-2 z-10">
          <Input label="Username:" />
          <Input label="Password:" />
          <Button onClick={handleLogin} variant={ButtonVariant.Large}>
            GO
          </Button>
        </div>
      </div>
    </div>
  )
}
