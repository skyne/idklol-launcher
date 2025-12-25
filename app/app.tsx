import { LoginPage } from './components/pages/loginPage'
import { HomePage } from './components/pages/homePage'
import { SettingsPage } from './components/pages/settingsPage'
import { Page, usePage } from './states/router'
import './styles/app.css'

export default function App() {
  const page = usePage()

  switch (page) {
    case Page.LOGIN:
      return <LoginPage />
    case Page.HOME:
      return <HomePage />
    case Page.SETTINGS:
      return <SettingsPage />
    default:
      return <LoginPage />
  }
}
