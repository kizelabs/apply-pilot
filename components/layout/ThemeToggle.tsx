'use client'

import { useSyncExternalStore, useCallback } from 'react'
import { Sun, Moon } from 'lucide-react'

function getThemeSnapshot(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function getServerSnapshot(): 'light' | 'dark' {
  return 'light'
}

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
  return () => observer.disconnect()
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerSnapshot)

  const toggle = useCallback(() => {
    const next = theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', next)
    if (next === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl hover:bg-primary/5 transition-colors duration-200 cursor-pointer"
    >
      <Sun className={`w-4 h-4 text-muted-foreground transition-all duration-200 absolute ${theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'}`} />
      <Moon className={`w-4 h-4 text-muted-foreground transition-all duration-200 absolute ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
    </button>
  )
}
