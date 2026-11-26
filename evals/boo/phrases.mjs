// Test phrases for Boo, with what each should come back as. The household below is made up
// (it mirrors the app's sample pets). `kinds` lists the acceptable kinds; `petIds` must match exactly.

export const CONTEXT = {
  today: '2026-11-25',
  pets: [
    { id: 'rocky', name: 'Rocky', species: 'dog', breed: 'Beagle' },
    { id: 'milo', name: 'Milo', species: 'cat', breed: 'Tabby' },
    { id: 'cleo', name: 'Cleo', species: 'cat', breed: 'Tabby' },
    { id: 'tank', name: 'Tank', species: 'fish', breed: 'Clownfish' },
  ],
  vaccines: [
    { id: 'v1', petId: 'rocky', name: 'Rabies (1-year)', given: '2025-11-01', due: '2026-11-01' },
    { id: 'v2', petId: 'rocky', name: 'DHPP', given: '2025-11-01', due: '2026-11-01' },
    { id: 'v3', petId: 'milo', name: 'FVRCP', given: '2026-03-01', due: '2027-03-01' },
  ],
  records: [
    { id: 'r1', petId: 'rocky', date: '2026-10-30', type: 'health', title: 'Threw up after breakfast' },
    { id: 'r2', petId: 'cleo', date: '2026-11-20', type: 'weight', title: 'Weight 3.9 kg' },
    { id: 'r3', petId: 'rocky', date: '2026-11-14', type: 'meds', title: 'Started Apoquel 16 mg' },
  ],
}

export const PHRASES = [
  { text: 'Rocky weighs 25 lb', kinds: ['weight'], petIds: ['rocky'], weight: { value: 25, unit: 'lb' } },
  { text: 'Cleo is 4.1 kilos now', kinds: ['weight'], petIds: ['cleo'], weight: { value: 4.1, unit: 'kg' } },
  { text: 'rocky waits 25 pounds', note: 'misheard by speech-to-text', kinds: ['weight'], petIds: ['rocky'], weight: { value: 25, unit: 'lb' } },
  { text: 'Milo threw up twice this morning', kinds: ['symptom'], petIds: ['milo'] },
  { text: 'When is Rocky’s rabies due?', kinds: ['question'], petIds: ['rocky'], vaccineIds: ['v1'] },
  { text: 'When did Rocky last throw up?', kinds: ['question'], petIds: ['rocky'], recordIds: ['r1'] },
  { text: 'When is Tank’s rabies due?', note: 'nothing in the records: Boo must not make up a date', kinds: ['question'], petIds: ['tank'], vaccineIds: [] },
  { text: 'Fed the cat', note: 'two cats: Boo must ask', kinds: ['which-pet'], petIds: ['milo', 'cleo'] },
  { text: 'He’s limping a bit', note: 'no pet named', kinds: ['which-pet'], petIds: ['rocky', 'milo', 'cleo', 'tank'], petIdsSubset: true },
  { text: 'Walked Rocky for 40 minutes', kinds: ['record'], petIds: ['rocky'] },
  { text: 'Gave both cats their flea treatment', kinds: ['record', 'meds'], petIds: ['milo', 'cleo'] },
  { text: 'Ear drops for Cleo twice a day for 10 days', kinds: ['meds'], petIds: ['cleo'], meds: { perDay: 2, days: 10 } },
  { text: 'Rocky ate a whole bar of dark chocolate', kinds: ['red-flag'], petIds: ['rocky'] },
  { text: 'Milo is having a seizure', kinds: ['red-flag'], petIds: ['milo'] },
  { text: 'We just adopted Biscuit, a golden retriever puppy, 4 months old', kinds: ['new-pet'], petIds: [], newPet: { name: 'Biscuit', species: 'dog', ageMonths: 4 } },
  { text: 'What’s the weather tomorrow?', kinds: ['unclear'], petIds: [] },
]
