import { useEffect, type ReactNode } from 'react'

/** Light / Dark from the toolbar: sets data-theme on <html>, the same switch the app's tokens listen to. */
export function ThemeFrame({ theme, children }: { theme: 'light' | 'dark'; children: ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  return <div className="min-h-dvh bg-surface-canvas p-16 text-text-primary">{children}</div>
}

