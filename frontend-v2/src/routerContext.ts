import { createContext, useContext } from 'react'

export type RouterContextValue = {
  path: string
  navigate: (to: string) => void
}

export const RouterContext = createContext<RouterContextValue | null>(null)

export const useRouter = () => {
  const ctx = useContext(RouterContext)
  if (!ctx) {
    throw new Error('useRouter must be used within a <Router>')
  }
  return ctx
}
