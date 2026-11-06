// Sample household for development and demos: Rocky (dog), Milo and Cleo (cats), Tank (clownfish).
// Dates are relative to today, so the app always looks "alive".

import { addDays, addMonths, today } from '../lib/dates'
import type { AppData } from './types'

export function emptyData(): AppData {
  return {
    version: 1,
    pets: [],
    records: [],
    vaccines: [],
    meds: [],
    tasks: [],
    documents: [],
    settings: { remindDaysBefore: 14, booConsent: false },
  }
}

export function sampleData(): AppData {
  const t = today()
  const d = (n: number) => addDays(t, n)
  const vet = { name: 'Bayside Animal Clinic', phone: '+14155550142' }

  return {
    version: 1,
    pets: [
      {
        id: 'rocky',
        name: 'Rocky',
        species: 'dog',
        breed: 'Labrador Retriever',
        birthDate: '2019-04-12',
        photo: '/pets/rocky.jpg',
        weightUnit: 'kg',
        allergies: ['Chicken'],
        microchip: '985 112 004 337 219',
        insurance: 'Lemonade · policy LP-48213',
        vet,
      },
      {
        id: 'milo',
        name: 'Milo',
        species: 'cat',
        breed: 'Domestic Shorthair',
        birthDate: '2021-08-03',
        photo: '/pets/milo.jpg',
        weightUnit: 'kg',
        allergies: [],
        vet,
      },
      {
        id: 'cleo',
        name: 'Cleo',
        species: 'cat',
        breed: 'Tabby',
        birthDate: '2023-02-20',
        photo: '/pets/cleo.jpg',
        weightUnit: 'kg',
        allergies: [],
        vet,
      },
      {
        id: 'tank',
        name: 'Tank',
        species: 'fish',
        breed: 'Clownfish',
        birthDate: '2024-06-01',
        photo: '/pets/tank.jpg',
        weightUnit: 'g',
        allergies: [],
      },
    ],
    documents: [
      { id: 'doc-rocky-1', petId: 'rocky', title: 'Vaccine certificate', clinic: vet.name, date: addMonths(t, -7) },
      { id: 'doc-rocky-2', petId: 'rocky', title: 'Visit invoice · ear infection', clinic: vet.name, date: d(-12) },
      { id: 'doc-cleo-1', petId: 'cleo', title: 'Spay surgery discharge', clinic: vet.name, date: addMonths(t, -4) },
    ],
    vaccines: [
      { id: 'v1', petId: 'rocky', name: 'Rabies (3-year)', given: addMonths(t, -35), due: d(19), documentId: 'doc-rocky-1' },
      { id: 'v2', petId: 'rocky', name: 'DHPP', given: addMonths(t, -7), due: addMonths(t, 5), documentId: 'doc-rocky-1' },
      { id: 'v3', petId: 'rocky', name: 'Bordetella', given: addMonths(t, -7), due: addMonths(t, 5), documentId: 'doc-rocky-1' },
      { id: 'v4', petId: 'cleo', name: 'FVRCP', given: addMonths(t, -4), due: addMonths(t, 8) },
      { id: 'v5', petId: 'cleo', name: 'Rabies (1-year)', given: addMonths(t, -4), due: addMonths(t, 8) },
    ],
    meds: [
      { id: 'm1', petId: 'rocky', name: 'Otomax ear drops', dose: '4 drops, twice a day', until: d(3) },
      { id: 'm2', petId: 'milo', name: 'Revolution Plus', dose: '1 tube, monthly' },
    ],
    records: [
      { id: 'r1', petId: 'rocky', type: 'weight', date: addMonths(t, -6), title: 'Weight', value: 32.4 },
      { id: 'r2', petId: 'rocky', type: 'weight', date: addMonths(t, -3), title: 'Weight', value: 31.9 },
      { id: 'r3', petId: 'rocky', type: 'weight', date: d(-12), title: 'Weight', value: 31.5, documentId: 'doc-rocky-2' },
      { id: 'r4', petId: 'rocky', type: 'health', date: d(-13), title: 'Scratching his left ear', detail: 'Shaking his head since the weekend' },
      { id: 'r5', petId: 'rocky', type: 'health', date: d(-12), title: 'Ear infection (otitis externa)', detail: 'Diagnosed at Bayside Animal Clinic', documentId: 'doc-rocky-2' },
      { id: 'r6', petId: 'rocky', type: 'meds', date: d(-12), title: 'Started Otomax ear drops', detail: '4 drops, twice a day for 14 days', documentId: 'doc-rocky-2' },
      { id: 'r7', petId: 'rocky', type: 'document', date: d(-12), title: 'Visit invoice · ear infection', detail: '$184.50', documentId: 'doc-rocky-2' },
      { id: 'r8', petId: 'rocky', type: 'vaccine', date: addMonths(t, -7), title: 'DHPP and Bordetella given', documentId: 'doc-rocky-1' },
      { id: 'r9', petId: 'rocky', type: 'document', date: addMonths(t, -7), title: 'Vaccine certificate', documentId: 'doc-rocky-1' },
      { id: 'r10', petId: 'milo', type: 'weight', date: addMonths(t, -2), title: 'Weight', value: 5.1 },
      { id: 'r11', petId: 'milo', type: 'weight', date: d(-6), title: 'Weight', value: 5.3 },
      { id: 'r12', petId: 'milo', type: 'meds', date: d(-20), title: 'Revolution Plus', detail: 'Monthly flea & tick' },
      { id: 'r13', petId: 'cleo', type: 'weight', date: addMonths(t, -4), title: 'Weight', value: 3.6 },
      { id: 'r14', petId: 'cleo', type: 'weight', date: d(-9), title: 'Weight', value: 3.9 },
      { id: 'r15', petId: 'cleo', type: 'document', date: addMonths(t, -4), title: 'Spay surgery discharge', documentId: 'doc-cleo-1' },
      { id: 'r16', petId: 'cleo', type: 'vaccine', date: addMonths(t, -4), title: 'FVRCP and Rabies given' },
      { id: 'r17', petId: 'tank', type: 'note', date: d(-3), title: 'Changed 20% of the water' },
    ],
    tasks: [
      { id: 't1', petId: 'rocky', kind: 'med', title: 'Ear drops', detail: 'Otomax · 4 drops', date: t, time: '08:00' },
      { id: 't2', petId: 'milo', kind: 'chore', title: 'Breakfast', detail: '½ cup dry food', date: t, time: '07:30', doneAt: `${t}T07:42:00` },
      { id: 't3', petId: 'cleo', kind: 'chore', title: 'Breakfast', detail: '½ cup dry food', date: t, time: '07:30', doneAt: `${t}T07:42:00` },
      { id: 't4', petId: 'rocky', kind: 'med', title: 'Ear drops', detail: 'Otomax · 4 drops', date: t, time: '20:00' },
      { id: 't5', petId: 'tank', kind: 'chore', title: 'Feed', detail: 'A pinch of pellets', date: t, time: '18:00' },
      { id: 't6', petId: 'rocky', kind: 'med', title: 'Ear drops', detail: 'Otomax · 4 drops', date: d(1), time: '08:00' },
      { id: 't7', petId: 'rocky', kind: 'med', title: 'Ear drops', detail: 'Otomax · 4 drops', date: d(1), time: '20:00' },
      { id: 't8', petId: 'rocky', kind: 'vet', title: 'Ear recheck', detail: 'Bayside Animal Clinic', date: d(3), time: '10:30' },
      { id: 't9', petId: 'milo', kind: 'med', title: 'Revolution Plus', detail: '1 tube', date: d(10), remind: true },
      { id: 't10', petId: 'rocky', kind: 'insurance', title: 'Submit the ear-visit claim', detail: 'Lemonade · 90-day limit', date: d(5), remind: true },
      { id: 't11', petId: 'rocky', kind: 'vaccine', title: 'Rabies booster', detail: 'Rabies (3-year)', date: d(19), remind: true },
      { id: 't12', petId: 'cleo', kind: 'lab', title: 'Bloodwork recheck', detail: 'After spay', date: d(-1), remind: true },
      { id: 't13', petId: 'rocky', kind: 'med', title: 'Ear drops', detail: 'Otomax · 4 drops', date: d(-1), time: '08:00', doneAt: `${d(-1)}T08:10:00` },
      { id: 't14', petId: 'rocky', kind: 'med', title: 'Ear drops', detail: 'Otomax · 4 drops', date: d(-1), time: '20:00', doneAt: `${d(-1)}T20:25:00` },
      { id: 't15', petId: 'tank', kind: 'chore', title: 'Change 20% of the water', date: d(4) },
    ],
    settings: { remindDaysBefore: 14, booConsent: false },
  }
}
