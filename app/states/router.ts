import { atom, useAtom } from 'react-atomic-state'

export enum Page {
  LOGIN = 'login',
  HOME = 'home',
  SETTINGS = 'settings',
}

const page = atom(Page.LOGIN)

export const setPage = (newPage: Page) => page.set(() => newPage)

// create a custom hook
export const usePage = (): Page => useAtom(page)