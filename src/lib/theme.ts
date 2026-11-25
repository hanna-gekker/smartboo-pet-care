// Appearance (Settings → Appearance: System · Light · Dark).
// The CSS already follows the phone (prefers-color-scheme) unless <html data-theme="light|dark"> says otherwise
// (base.css, tokens.css). On the iPhone the status bar (clock, battery) is told the same, so it stays readable when
// the app's theme differs from the phone's.

import { StatusBar, Style } from '@capacitor/status-bar'
import type { Theme } from '../data/types'
import { isNative } from './reminders'

export function applyTheme(theme: Theme = 'system') {
  const root = document.documentElement
  if (theme === 'system') {
    delete root.dataset.theme
    root.style.colorScheme = ''
  } else {
    root.dataset.theme = theme
    // Native controls (date and time pickers, scrollbars) follow too
    root.style.colorScheme = theme
  }
  if (isNative()) {
    // Style.Dark = light text for a dark screen
    void StatusBar.setStyle({ style: theme === 'dark' ? Style.Dark : theme === 'light' ? Style.Light : Style.Default }).catch(() => {})
  }
}
