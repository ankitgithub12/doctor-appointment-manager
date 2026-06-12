import { useEffect, useState } from 'react'

// Minimal History-API router — no dependency needed.
export function navigate(to) {
  if (window.location.pathname === to) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  window.history.pushState({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0 })
}

export function useRoute() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  return path
}

// Navigate home, then smooth-scroll to a #hash section once it renders.
export function goToSection(hash) {
  const scroll = () => {
    const el = document.querySelector(hash)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
  if (window.location.pathname !== '/') {
    navigate('/')
    requestAnimationFrame(() => requestAnimationFrame(scroll))
  } else {
    scroll()
  }
}
