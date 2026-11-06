// App state on top of data/store: screens read from here and update instantly when Boo saves something.

import { create } from 'zustand'
import { today } from '../lib/dates'
import { emptyData, sampleData } from './sample'
import { clearData, loadData, saveData } from './store'
import type { AppData, Med, Pet, PetDocument, PetRecord, Settings, Task, Vaccine } from './types'

export const newId = (prefix = 'id') => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

type AppState = AppData & {
  loaded: boolean
  init: () => Promise<void>
  toggleTask: (id: string) => void
  addPet: (pet: Pet) => void
  updatePet: (id: string, patch: Partial<Pet>) => void
  addRecord: (record: PetRecord) => void
  removeRecord: (id: string) => void
  addPaper: (input: {
    pet: Pet
    isNewPet: boolean
    document: PetDocument
    vaccines: Vaccine[]
    records: PetRecord[]
  }) => void
  addMed: (med: Med, tasks: Task[], record: PetRecord) => void
  remindVaccines: (petId: string, documentId: string) => number
  updateSettings: (patch: Partial<Settings>) => void
  loadSample: () => void
  startFresh: () => Promise<void>
}

const dataOf = (s: AppState): AppData => ({
  version: 1,
  pets: s.pets,
  records: s.records,
  vaccines: s.vaccines,
  meds: s.meds,
  tasks: s.tasks,
  documents: s.documents,
  settings: s.settings,
})

export const useApp = create<AppState>((set, get) => ({
  ...emptyData(),
  loaded: false,

  init: async () => {
    const saved = await loadData()
    // First run in development: start with the sample household so every screen has something to show.
    // "Start fresh" in Settings shows the real first launch (Welcome).
    set({ ...(saved ?? sampleData()), loaded: true })
  },

  toggleTask: (id) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, doneAt: t.doneAt ? undefined : new Date().toISOString() } : t)),
    })),

  addPet: (pet) => set((s) => ({ pets: [...s.pets, pet] })),

  updatePet: (id, patch) => set((s) => ({ pets: s.pets.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),

  addRecord: (record) => set((s) => ({ records: [...s.records, record] })),

  removeRecord: (id) => set((s) => ({ records: s.records.filter((r) => r.id !== id) })),

  addPaper: ({ pet, isNewPet, document, vaccines, records }) =>
    set((s) => ({
      pets: isNewPet ? [...s.pets, pet] : s.pets,
      documents: [...s.documents, document],
      vaccines: [...s.vaccines, ...vaccines],
      records: [...s.records, ...records],
    })),

  addMed: (med, tasks, record) =>
    set((s) => ({ meds: [...s.meds, med], tasks: [...s.tasks, ...tasks], records: [...s.records, record] })),

  remindVaccines: (petId, documentId) => {
    const s = get()
    const vax = s.vaccines.filter((v) => v.petId === petId && v.documentId === documentId && v.due && v.due >= today())
    const tasks: Task[] = vax.map((v) => ({
      id: newId('task'),
      petId,
      kind: 'vaccine',
      title: v.name,
      detail: 'vaccine due',
      date: v.due!,
      remind: true,
    }))
    set({ tasks: [...s.tasks, ...tasks] })
    return tasks.length
  },

  updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

  loadSample: () => set({ ...sampleData() }),

  startFresh: async () => {
    await clearData()
    set({ ...emptyData() })
  },
}))

// Save after every change (once the data has been loaded).
useApp.subscribe((s) => {
  if (s.loaded) void saveData(dataOf(s))
})

export const petById = (pets: Pet[], id: string) => pets.find((p) => p.id === id)
