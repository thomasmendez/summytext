import { useCallback, useEffect, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { RouterContext, useRouter } from './routerContext'

// A tiny history-based router that replaces react-router-dom. It tracks
// window.location.pathname, re-renders on back/forward, and exposes a
// navigate() helper plus a <Link> that pushes without a full page reload.

export const Router = ({ children }: { children: ReactNode }) => {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = useCallback((to: string) => {
    if (to === window.location.pathname) return
    window.history.pushState({}, '', to)
    setPath(to)
    window.scrollTo(0, 0)
  }, [])

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  )
}

type LinkProps = {
  to: string
  children: ReactNode
  className?: string
}

export const Link = ({ to, children, className }: LinkProps) => {
  const { navigate } = useRouter()
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    navigate(to)
  }
  return (
    <a href={to} onClick={onClick} className={className}>
      {children}
    </a>
  )
}
