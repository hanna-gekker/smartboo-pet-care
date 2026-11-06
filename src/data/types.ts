// The shape of SmartBoo's data. Everything lives on the phone until the demo.

export type Species = 'dog' | 'cat' | 'fish' | 'bird' | 'reptile' | 'small mammal' | 'other'

export type Pet = {
  id: string
  name: string
  species: Species
  breed?: string
  birthDate?: string // YYYY-MM-DD
  photo?: string
  weightUnit: 'kg' | 'g'
  allergies: string[]
  microchip?: string
  insurance?: string
  vet?: { name: string; phone: string }
}

export type RecordType = 'health' | 'meds' | 'vaccine' | 'weight' | 'document' | 'note'

export type PetRecord = {
  id: string
  petId: string
  type: RecordType
  date: string // YYYY-MM-DD
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

export type Settings = {
  remindDaysBefore: number
  booConsent: boolean
  gapHintHiddenUntil?: string // YYYY-MM-DD
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
