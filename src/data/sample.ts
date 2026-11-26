// Sample household for development and demos, as in the Figma mockups: Rocky and Bella (dogs), Milo and Cleo
// (cats), Tank (clownfish).
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
  const vet = { name: 'Dr. Lee', clinic: 'Paws & Claws', phone: '+14155550142' }
  // Rocky's two core vaccines ran out 24 days ago (Figma: "Rabies & DHPP are overdue · due since Nov 1")
  const overdue = d(-24)
  const spring = d(-207)

  return {
    version: 1,
    pets: [
      {
        id: 'rocky',
        color: 'ocean',
        name: 'Rocky',
        species: 'dog',
        breed: 'Beagle',
        birthDate: '2019-03-12',
        photo: '/pets/rocky.jpg',
        weightUnit: 'lb',
        allergies: ['Chicken'],
        microchip: '985 141 000 123 456',
        insurance: 'Trupanion · #TR-88213',
        vet,
      },
      {
        id: 'milo',
        color: 'lavender',
        name: 'Milo',
        species: 'cat',
        breed: 'Tabby',
        birthDate: '2021-08-03',
        photo: '/pets/milo.jpg',
        weightUnit: 'lb',
        allergies: [],
        vet,
      },
      {
        id: 'cleo',
        color: 'butter',
        name: 'Cleo',
        species: 'cat',
        breed: 'Bengal',
        birthDate: '2023-02-20',
        photo: '/pets/cleo.jpg',
        weightUnit: 'lb',
        allergies: [],
        vet,
      },
      {
        id: 'tank',
        color: 'mint',
        name: 'Tank',
        species: 'fish',
        breed: 'Clownfish',
        birthDate: '2024-06-01',
        photo: '/pets/tank.jpg',
        weightUnit: 'g',
        allergies: [],
      },
      {
        id: 'bella',
        color: 'pink',
        name: 'Bella',
        species: 'dog',
        breed: 'Golden Retriever',
        birthDate: '2022-05-18',
        photo: '/pets/bella.jpg',
        weightUnit: 'lb',
        allergies: [],
        vet,
      },
    ],
    documents: [
      { id: 'doc-rocky-1', petId: 'rocky', title: 'Vaccine certificate', clinic: vet.clinic, date: addMonths(overdue, -36) },
      { id: 'doc-rocky-3', petId: 'rocky', title: 'Vaccine certificate', clinic: vet.clinic, date: spring },
      { id: 'doc-rocky-2', petId: 'rocky', title: 'Invoice · $148.00', clinic: vet.clinic, date: d(-28) },
      { id: 'doc-cleo-1', petId: 'cleo', title: 'Spay surgery discharge', clinic: vet.clinic, date: addMonths(t, -4) },
    ],
    vaccines: [
      { id: 'v1', petId: 'rocky', name: 'Rabies (3-year)', given: addMonths(overdue, -36), due: overdue, documentId: 'doc-rocky-1' },
      { id: 'v2', petId: 'rocky', name: 'DHPP', given: addMonths(overdue, -12), due: overdue, documentId: 'doc-rocky-1' },
      { id: 'v3', petId: 'rocky', name: 'Bordetella', given: spring, due: addMonths(spring, 12), documentId: 'doc-rocky-3' },
      { id: 'v4', petId: 'rocky', name: 'Leptospirosis', given: spring, due: addMonths(spring, 12), documentId: 'doc-rocky-3' },
      { id: 'v5', petId: 'cleo', name: 'FVRCP', given: addMonths(t, -4), due: addMonths(t, 8) },
      { id: 'v6', petId: 'cleo', name: 'Rabies (1-year)', given: addMonths(t, -4), due: addMonths(t, 8) },
      { id: 'v7', petId: 'bella', name: 'Rabies (1-year)', given: addMonths(d(8), -12), due: d(8) },
    ],
    meds: [
      { id: 'm1', petId: 'rocky', name: 'Apoquel', dose: '16 mg · daily', start: d(-11), until: d(18) },
      { id: 'm2', petId: 'milo', name: 'Revolution Plus', dose: '1 tube, monthly' },
      { id: 'm3', petId: 'cleo', name: 'Otomax ear drops', dose: '4 drops, twice a day', start: d(-4), until: d(3) },
    ],
    records: [
      { id: 'r1', petId: 'rocky', type: 'weight', date: d(-170), title: 'Weight', value: 25.3 },
      { id: 'r2', petId: 'rocky', type: 'weight', date: d(-80), title: 'Weight', value: 25.0 },
      { id: 'r3', petId: 'rocky', type: 'weight', date: d(-36), title: 'Weight', value: 24.6 },
      { id: 'r4', petId: 'rocky', type: 'health', date: d(-26), time: '08:40', title: 'Threw up after breakfast', detail: 'once, eating fine', said: 'Rocky threw up after breakfast. Just once, he’s eating fine.', question: 'Just once? Is Rocky eating normally?', answers: ['Once', 'Eating fine'] },
      { id: 'r5', petId: 'rocky', type: 'health', date: d(-28), title: 'Vet visit · ear infection', detail: 'Dr. Lee · Apoquel 16 mg for 30 days', documentId: 'doc-rocky-2' },
      { id: 'r6', petId: 'rocky', type: 'meds', date: d(-11), title: 'Started Apoquel 16 mg', detail: 'daily for 30 days', documentId: 'doc-rocky-2' },
      { id: 'r7', petId: 'rocky', type: 'document', date: d(-28), title: 'Invoice · $148.00', documentId: 'doc-rocky-2' },
      { id: 'r8', petId: 'rocky', type: 'vaccine', date: spring, title: 'Vaccines · Bordetella, Leptospirosis', documentId: 'doc-rocky-3' },
      { id: 'r9', petId: 'rocky', type: 'document', date: spring, title: 'Vaccine certificate', documentId: 'doc-rocky-3' },
      { id: 'r10', petId: 'milo', type: 'weight', date: addMonths(t, -2), title: 'Weight', value: 11.2 },
      { id: 'r11', petId: 'milo', type: 'weight', date: d(-6), title: 'Weight', value: 11.7 },
      { id: 'r12', petId: 'milo', type: 'meds', date: d(-35), title: 'Revolution Plus', detail: 'Monthly flea & tick' },
      { id: 'r13', petId: 'cleo', type: 'weight', date: addMonths(t, -4), title: 'Weight', value: 7.9 },
      { id: 'r14', petId: 'cleo', type: 'weight', date: d(-9), title: 'Weight', value: 8.6 },
      { id: 'r15', petId: 'cleo', type: 'document', date: addMonths(t, -4), title: 'Spay surgery discharge', documentId: 'doc-cleo-1' },
      { id: 'r16', petId: 'cleo', type: 'vaccine', date: addMonths(t, -4), title: 'Vaccines · FVRCP, Rabies' },
      { id: 'r17', petId: 'cleo', type: 'meds', date: d(-4), title: 'Started Otomax ear drops', detail: '4 drops, twice a day for 7 days' },
      { id: 'r18', petId: 'tank', type: 'note', date: d(-3), title: 'Changed 20% of the water' },
      { id: 'r19', petId: 'bella', type: 'weight', date: d(-40), title: 'Weight', value: 61.5 },
    ],
    tasks: [
      { id: 't1', petId: 'cleo', kind: 'med', title: 'Ear drops', detail: 'Otomax · 4 drops', date: t, time: '08:00' },
      { id: 't2', petId: 'milo', kind: 'chore', title: 'Breakfast', detail: '½ cup dry food', date: t, time: '07:30', doneAt: `${t}T07:42:00` },
      { id: 't3', petId: 'cleo', kind: 'chore', title: 'Breakfast', detail: '½ cup dry food', date: t, time: '07:30', doneAt: `${t}T07:42:00` },
      { id: 't4', petId: 'cleo', kind: 'med', title: 'Ear drops', detail: 'Otomax · 4 drops', date: t, time: '20:00' },
      { id: 't5', petId: 'tank', kind: 'chore', title: 'Feed', detail: 'A pinch of pellets', date: t, time: '18:00' },
      { id: 't6', petId: 'rocky', kind: 'med', title: 'Apoquel', detail: '16 mg', date: t, time: '09:00' },
      { id: 't7', petId: 'rocky', kind: 'med', title: 'Apoquel', detail: '16 mg', date: d(1), time: '09:00' },
      { id: 't8', petId: 'cleo', kind: 'vet', title: 'Ear recheck', detail: 'Paws & Claws', date: d(3), time: '10:30' },
      { id: 't9', petId: 'milo', kind: 'med', title: 'Flea drops', detail: 'Revolution Plus · 1 tube', date: d(-5), remind: true },
      { id: 't10', petId: 'rocky', kind: 'insurance', title: 'Claim for the ear visit', detail: 'Trupanion', date: d(2), remind: true },
      { id: 't11', petId: 'rocky', kind: 'vaccine', title: 'Rabies booster', detail: 'Rabies (3-year)', vaccine: 'Rabies (3-year)', date: overdue, remind: true },
      { id: 't12', petId: 'rocky', kind: 'vaccine', title: 'DHPP booster', detail: 'DHPP', vaccine: 'DHPP', date: overdue, remind: true },
      { id: 't13', petId: 'cleo', kind: 'lab', title: 'Bloodwork recheck', detail: 'After spay', date: d(12), remind: true },
      { id: 't14', petId: 'rocky', kind: 'med', title: 'Apoquel', detail: '16 mg', date: d(-1), time: '09:00', doneAt: `${d(-1)}T09:05:00` },
      { id: 't15', petId: 'tank', kind: 'chore', title: 'Change 20% of the water', date: d(4) },
      { id: 't16', petId: 'bella', kind: 'vaccine', title: 'Rabies', detail: 'Rabies (1-year)', vaccine: 'Rabies (1-year)', date: d(8), remind: true },
    ],
    settings: { remindDaysBefore: 14, booConsent: false, owner: { name: 'Anna', phone: '+14155550193' } },
  }
}
