// The ONE module that reads and writes SmartBoo's data.
// Screens never touch storage directly — they go through the app state in ./useApp.
//
// Now (web, step 04): the data is kept in the browser's localStorage.
// Step 05 (Capacitor): switch to @capacitor/filesystem — one JSON file in the app's Data directory
// (iOS may clear a web view's localStorage when space is low; app files are kept).
// After the demo: rewrite only this module for Supabase.

import type { AppData } from './types'

const KEY = 'smartboo:data:v1'

export async function loadData(): Promise<AppData | null> {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as AppData) : null
  } catch {
    return null
  }
}

export async function saveData(data: AppData): Promise<void> {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // Storage full or blocked — the app keeps working in memory.
  }
}

export async function clearData(): Promise<void> {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
