// UI-only state: the Boo sheet and the "Saved · Undo" toast. Not saved to the phone.

import { create } from 'zustand'

/** Where the Boo sheet opens. `reading`: straight to reading a paper (the one that waited for the connection). */
export type BooStart = 'menu' | 'talk' | 'snap' | 'type' | 'reading'

type Toast = { id: number; text: string; undo?: () => void }

type UiState = {
  booOpen: boolean
  booStart: BooStart
  booText: string
  booSession: number
  openBoo: (start?: BooStart, text?: string) => void
  closeBoo: () => void
  toast?: Toast
  showToast: (text: string, undo?: () => void) => void
  hideToast: () => void
  /** A paper picked while offline: Boo reads it as soon as the phone is back online. */
  paperWaiting: boolean
  setPaperWaiting: (waiting: boolean) => void
}

export const useUi = create<UiState>((set) => ({
  booOpen: false,
  booStart: 'menu',
  booText: '',
  booSession: 0,
  openBoo: (start = 'menu', text = '') => set((s) => ({ booOpen: true, booStart: start, booText: text, booSession: s.booSession + 1 })),
  closeBoo: () => set({ booOpen: false }),
  showToast: (text, undo) => set({ toast: { id: Date.now(), text, undo } }),
  hideToast: () => set({ toast: undefined }),
  paperWaiting: false,
  setPaperWaiting: (paperWaiting) => set({ paperWaiting }),
}))
