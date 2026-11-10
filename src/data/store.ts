// The ONE module that reads and writes SmartBoo's data.
// Screens never touch storage directly — they go through the app state in ./useApp.
//
// Where: one JSON file, smartboo/data.json, in the app's own Data directory (@capacitor/filesystem).
// iOS may clear a web view's localStorage when space is low; the app's own files are kept.
// In the browser (web version, Storybook) the same plugin keeps the file in IndexedDB.
// After the demo: rewrite only this module for Supabase.

import { Directory, Encoding, Filesystem } from '@capacitor/filesystem'
import type { AppData } from './types'

const FILE = { path: 'smartboo/data.json', directory: Directory.Data }

// Before this module used files, the data lived in localStorage under this key.
const OLD_KEY = 'smartboo:data:v1'

export async function loadData(): Promise<AppData | null> {
  try {
    const { data } = await Filesystem.readFile({ ...FILE, encoding: Encoding.UTF8 })
    return JSON.parse(data as string) as AppData
  } catch {
    // No file yet (first launch) or it could not be read: try the old storage once.
    return moveFromLocalStorage()
  }
}

// Saves run one after another, so quick changes (three tasks ticked in a row) never overlap.
let queue: Promise<void> = Promise.resolve()

export function saveData(data: AppData): Promise<void> {
  const json = JSON.stringify(data)
  queue = queue.then(async () => {
    await writeFile(json)
  })
  return queue
}

export async function clearData(): Promise<void> {
  await queue
  try {
    await Filesystem.deleteFile(FILE)
  } catch {
    // Nothing to delete.
  }
}

async function writeFile(json: string): Promise<boolean> {
  try {
    await Filesystem.writeFile({ ...FILE, data: json, encoding: Encoding.UTF8, recursive: true })
    return true
  } catch (error) {
    // Storage full or blocked — the app keeps working in memory and tries again on the next change.
    console.error('SmartBoo: could not save data', error)
    return false
  }
}

// One-time move: data saved by the earlier version goes into the file, then the old copy is removed.
async function moveFromLocalStorage(): Promise<AppData | null> {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(OLD_KEY)
  } catch {
    return null
  }
  if (!raw) return null
  try {
    const data = JSON.parse(raw) as AppData
    // Keep the old copy until the file is really written.
    if (await writeFile(raw)) localStorage.removeItem(OLD_KEY)
    return data
  } catch {
    return null
  }
}
