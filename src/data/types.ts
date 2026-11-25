// The shape of SmartBoo's data. Everything lives on the phone until the demo.

export const SPECIES = [
  'dog', 'cat', 'rabbit', 'hamster', 'guinea-pig', 'rat', 'chinchilla', 'ferret', 'hedgehog',
  'bird', 'parrot', 'fish', 'turtle', 'lizard', 'snake', 'frog', 'other',
] as const
export type Species = (typeof SPECIES)[number]

/** Frame colour of a pet (Figma pet/*): the petals around its photo, and its placeholder. */
export type PetColor = 'ocean' | 'lavender' | 'butter' | 'mint' | 'pink' | 'slate'

export type WeightUnit = 'kg' | 'lb' | 'g' | 'oz'

export type Pet = {
  id: string
  name: string
  species: Species
  breed?: string
  birthDate?: string // YYYY-MM-DD
  photo?: string
  /** Frame colour, picked when the pet is added. Older pets have none and get one by their place in the list. */
  color?: PetColor
  /** lb / kg for larger pets, g / oz for small ones. */
  weightUnit: WeightUnit
  allergies: string[]
  microchip?: string
  insurance?: string
  vet?: Vet
}

export type RecordType = 'health' | 'meds' | 'vaccine' | 'weight' | 'document' | 'note'

export type PetRecord = {
  id: string
  petId: string
  type: RecordType
  date: string // YYYY-MM-DD
  /** When it was logged, "09:20". Older records have none. */
  time?: string
  title: string
  detail?: string
  value?: number // weight
  documentId?: string // a record extracted from a document links back to it
}

export type Vaccine = {
  id: string
  petId: string
  name: string
  given: string // YYYY-MM-DD
  due?: string // YYYY-MM-DD
  documentId?: string
}

export type Med = {
  id: string
  petId: string
  name: string
  dose: string
  until?: string // YYYY-MM-DD
}

export type TaskKind = 'vaccine' | 'med' | 'lab' | 'insurance' | 'chore' | 'vet'

export type Task = {
  id: string
  petId: string
  kind: TaskKind
  title: string
  detail?: string // e.g. dose
  date: string // YYYY-MM-DD
  time?: string // HH:mm
  doneAt?: string // ISO time when crossed out
  remind?: boolean
}

export type PetDocument = {
  id: string
  petId: string
  title: string
  clinic?: string
  date: string // YYYY-MM-DD
  fileName?: string
}

/** A vet: the one in a pet's profile, or one added in Settings (emergency or specialist). */
export type Vet = { name: string; clinic?: string; phone: string }

/** Settings → Your profile (Figma 18a). */
export type Owner = { name: string; phone: string; email?: string; photo?: string }

export type Theme = 'system' | 'light' | 'dark'

export type Settings = {
  remindDaysBefore: number
  booConsent: boolean
  gapHintHiddenUntil?: string // YYYY-MM-DD
  owner?: Owner
  /** Vets added in Settings → "Add a vet" (the primary vet comes from the pets' profiles). */
  vets?: Vet[]
  /** Daily tasks summary time, HH:mm, or 'off'. Missing = 8:00 AM (Figma 18). */
  dailyTime?: string
  /** Appearance. Missing = follow the phone. */
  theme?: Theme
}

export type AppData = {
  version: 1
  pets: Pet[]
  records: PetRecord[]
  vaccines: Vaccine[]
  meds: Med[]
  tasks: Task[]
  documents: PetDocument[]
  settings: Settings
}
