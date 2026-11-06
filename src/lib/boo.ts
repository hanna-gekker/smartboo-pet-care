// Boo client — FAKE for now (step 04). It pretends to read papers and phrases so the flows can be clicked through.
// The Boo spike (week 2) replaces these functions with calls to the server function functions/api/boo.

import type { Pet, PetRecord, Vaccine } from '../data/types'
import { addDays, addMonths, formatDay, relative, today } from './dates'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export type ParsedPaper = {
  pet: { name: string; species: Pet['species']; breed: string; birthDate: string }
  title: string
  clinic: string
  date: string
  vaccines: { name: string; given: string; due: string }[]
  amount: string
  /** Fields Boo isn't sure about — highlighted on the review card */
  unsure: string[]
}

/** Pretends to read a vet paper. Always returns the same sample certificate. */
export async function readPaper(): Promise<ParsedPaper> {
  await wait(2600)
  const t = today()
  const given = addDays(t, -2)
  return {
    pet: { name: 'Biscuit', species: 'dog', breed: 'Golden Retriever', birthDate: '2024-03-15' },
    title: 'Vaccine certificate',
    clinic: 'Mission Bay Vet Hospital',
    date: given,
    vaccines: [
      { name: 'Rabies (1-year)', given, due: addMonths(given, 12) },
      { name: 'DHPP', given, due: addMonths(given, 12) },
      { name: 'Bordetella', given, due: addMonths(given, 6) },
      { name: 'Leptospirosis', given, due: addDays(t, 19) },
    ],
    amount: '$142.00',
    unsure: ['birthDate'],
  }
}

export type BooResult =
  | { kind: 'weight'; petId: string; value: number; unit: 'kg' | 'g'; text: string }
  | { kind: 'record'; petId: string; type: PetRecord['type']; title: string; text: string }
  | { kind: 'symptom'; petId: string; title: string; question: string }
  | { kind: 'meds'; petId: string; name: string; dose: string; days: number; perDay: number }
  | { kind: 'answer'; text: string; source?: { petId: string; label: string } }
  | { kind: 'which-pet'; candidates: string[]; text: string }
  | { kind: 'unclear'; text: string }

const RED_FLAGS = ['seizure', 'not breathing', 'collapsed', 'bleeding', 'poison', 'ate chocolate', 'bloated', "can't pee", 'cannot pee']

function findPets(text: string, pets: Pet[]): Pet[] {
  const lower = text.toLowerCase()
  const named = pets.filter((p) => lower.includes(p.name.toLowerCase()))
  if (named.length) return named
  if (/\bboth\b|\bcats\b/.test(lower)) return pets.filter((p) => p.species === 'cat')
  return []
}

/** Pretends to understand a phrase. Simple patterns only. */
export async function understand(
  text: string,
  ctx: { pets: Pet[]; vaccines: Vaccine[]; records: PetRecord[] },
): Promise<BooResult> {
  await wait(900)
  const lower = text.toLowerCase().trim()
  const matched = findPets(lower, ctx.pets)
  const pet = matched.length === 1 ? matched[0] : ctx.pets.length === 1 ? ctx.pets[0] : undefined

  if (RED_FLAGS.some((f) => lower.includes(f))) {
    return {
      kind: 'answer',
      text: 'That sounds worth a call to your vet today. Boo keeps records — it isn’t a vet.',
      source: pet ? { petId: pet.id, label: `Call ${pet.name}'s vet` } : undefined,
    }
  }

  // Questions
  if (lower.endsWith('?') || /^(when|what|how|did|is|has)\b/.test(lower)) {
    if (!pet) return { kind: 'which-pet', candidates: ctx.pets.map((p) => p.id), text }
    const vax = ctx.vaccines.filter((v) => v.petId === pet.id && lower.includes(v.name.split(' ')[0].toLowerCase()))
    if (vax.length && vax[0].due) {
      return {
        kind: 'answer',
        text: `${pet.name}'s ${vax[0].name} is due ${formatDay(vax[0].due, { month: 'long', day: 'numeric', year: 'numeric' })} — ${relative(vax[0].due)}.`,
        source: { petId: pet.id, label: 'From the vaccine certificate' },
      }
    }
    const words = lower.replace(/[?.,!]/g, '').split(/\s+/).filter((w) => w.length > 3)
    const hit = ctx.records
      .filter((r) => r.petId === pet.id && words.some((w) => r.title.toLowerCase().includes(w)))
      .sort((a, b) => b.date.localeCompare(a.date))[0]
    if (hit) {
      return {
        kind: 'answer',
        text: `Last time: ${formatDay(hit.date, { month: 'long', day: 'numeric' })} (${relative(hit.date)}) — “${hit.title}”.`,
        source: { petId: pet.id, label: `Open ${pet.name}'s history` },
      }
    }
    return { kind: 'answer', text: `I don't have that in ${pet.name}'s records yet.` }
  }

  if (!pet && matched.length !== 1) {
    if (matched.length > 1 && /\b(fed|walk|gave)\b/.test(lower)) {
      return { kind: 'which-pet', candidates: matched.map((p) => p.id), text }
    }
    return { kind: 'which-pet', candidates: (matched.length ? matched : ctx.pets).map((p) => p.id), text }
  }
  const p = pet!

  // Weight: "Cleo weighs 3.9 kg", "Tank 12 grams"
  const w = lower.match(/(\d+(?:\.\d+)?)\s*(kg|kilos?|g|grams?|lbs?|pounds?)\b/)
  if (w && /weigh|weight|kg|grams?|lbs?|pounds?/.test(lower)) {
    let value = parseFloat(w[1])
    let unit: 'kg' | 'g' = w[2].startsWith('g') ? 'g' : 'kg'
    if (w[2].startsWith('lb') || w[2].startsWith('pound')) {
      value = Math.round(value * 0.4536 * 10) / 10
      unit = 'kg'
    }
    return { kind: 'weight', petId: p.id, value, unit, text }
  }

  // Meds course: "ear drops twice a day for 10 days"
  const course = lower.match(/(once|twice|three times|\d+ times) a day for (\d+) days?/)
  if (course) {
    const perDay = course[1] === 'once' ? 1 : course[1] === 'twice' ? 2 : course[1] === 'three times' ? 3 : parseInt(course[1])
    const name = text.replace(new RegExp(p.name, 'i'), '').split(/,|\bonce\b|\btwice\b|\bthree times\b|\d+ times/i)[0].replace(/\b(gets?|give|start(ed)?|on)\b/gi, '').trim()
    return { kind: 'meds', petId: p.id, name: name ? name[0].toUpperCase() + name.slice(1) : 'New medication', dose: `${course[1]} a day`, days: parseInt(course[2]), perDay }
  }

  // Symptoms
  if (/threw up|vomit|diarrh|limp|cough|sneez|scratch|not eating|lethargic|itch/.test(lower)) {
    return { kind: 'symptom', petId: p.id, title: text.replace(/\.$/, ''), question: `Just once? Is ${p.name} eating normally?` }
  }

  // Simple records: fed, walked, note
  if (/\b(fed|walk(ed)?|gave|groom|bath|changed)\b/.test(lower)) {
    return { kind: 'record', petId: p.id, type: 'note', title: text.replace(/\.$/, ''), text }
  }

  return { kind: 'unclear', text }
}

export const RED_FLAG_NOTE = 'Boo keeps your pet’s records. It isn’t a vet.'
