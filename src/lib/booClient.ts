// The real Boo: sends a paper or a phrase to the server function (functions/api/boo, Claude) and turns the
// answer into the shapes the Boo sheet already shows. Claude only reads and classifies; what to save and
// every answer's wording and dates come from here and from the app's own records.
// VITE_BOO=fake (or Storybook) uses the stand-in Boo in boo.ts instead.

import { Capacitor } from '@capacitor/core'
import type { Paper } from '../../server/boo/paper.ts'
import type { Phrase, PhraseContext } from '../../server/boo/phrase.ts'
import { useApp } from '../data/useApp'
import type { Pet, Species } from '../data/types'
import { RED_FLAGS, understandFake, vaccineAnswer, type BooResult, type ParsedPaper } from './boo'
import { BooPaperError } from './booErrors'
import { addDays, addMonths, formatDay, relative, today } from './dates'

/** The web version calls its own origin; the iPhone app calls the web version's function. */
const BOO_URL = Capacitor.isNativePlatform() ? 'https://smartboo-pet-care.pages.dev/api/boo' : '/api/boo'
const FAKE = import.meta.env.VITE_BOO === 'fake'
const MAX_SIDE = 2000 // px: plenty for reading a paper, and small enough to send quickly
const MAX_PDF = 8 * 1024 * 1024

/** An anonymous id, made once and kept in Settings. Only for the server's daily limit. */
function deviceId() {
  const { settings, updateSettings } = useApp.getState()
  if (settings.deviceId) return settings.deviceId
  const id = crypto.randomUUID()
  updateSettings({ deviceId: id })
  return id
}

async function ask<T>(body: object): Promise<T> {
  if (!navigator.onLine) throw new BooPaperError('offline')
  let res: Response
  try {
    res = await fetch(BOO_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Boo-Device': deviceId() }, body: JSON.stringify(body) })
  } catch {
    throw new BooPaperError(navigator.onLine ? 'failed' : 'offline')
  }
  if (res.status === 429) throw new BooPaperError('limit')
  if (!res.ok) throw new BooPaperError('failed')
  return res.json() as Promise<T>
}

// --- Papers ---

const TITLES: Record<Paper['kind'], string> = {
  'vaccine certificate': 'Vaccine certificate',
  invoice: 'Invoice',
  'visit summary': 'Visit summary',
  'lab results': 'Lab results',
  prescription: 'Prescription',
  'other vet paper': 'Vet paper',
  'not a vet paper': 'Vet paper',
}

/** Reads a vet paper. A photo is made smaller first; a PDF goes as it is. */
export async function readPaper(file: File): Promise<ParsedPaper> {
  const { mediaType, data } = await prepare(file)
  const { paper } = await ask<{ paper: Paper }>({ type: 'paper', mediaType, data })
  if (paper.readable === 'too blurry') throw new BooPaperError('blurry')
  if (paper.kind === 'not a vet paper' || !paper.pets.length) throw new BooPaperError('not-paper')
  const pet = paper.pets[0]
  return {
    pet: { name: pet.name ?? '', species: (pet.species ?? 'other') as Species, breed: pet.breed ?? '', birthDate: pet.birthDate ?? '' },
    title: TITLES[paper.kind],
    clinic: paper.clinic ?? '',
    date: paper.visitDate ?? pet.vaccines.find((v) => v.given)?.given ?? today(),
    // A vaccine without a "given" date can't be filed; it stays on the paper
    vaccines: pet.vaccines.filter((v) => v.given).map((v) => ({ name: v.name, given: v.given!, due: v.due ?? '' })),
    amount: paper.amount ?? '',
    unsure: paper.unsure.map((f) => f.replace(/^pets\[0\]\./, '')),
    source: paper,
  }
}

async function prepare(file: File): Promise<{ mediaType: string; data: string }> {
  if (file.type === 'application/pdf') {
    if (file.size > MAX_PDF) throw new BooPaperError('failed')
    return { mediaType: 'application/pdf', data: await base64(file) }
  }
  if (!file.type.startsWith('image/')) throw new BooPaperError('not-paper')
  const bitmap = await createImageBitmap(file).catch(() => null)
  if (!bitmap) throw new BooPaperError('not-paper')
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.85))
  if (!blob) throw new BooPaperError('not-paper')
  return { mediaType: 'image/jpeg', data: await base64(blob) }
}

const base64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
    reader.onerror = () => reject(new BooPaperError('not-paper'))
    reader.readAsDataURL(blob)
  })

// --- Phrases ---

type Ctx = Parameters<typeof understandFake>[1]

/** What a phrase is about. Throws BooPaperError ('offline' | 'limit' | 'failed') when Boo can't be asked. */
export async function understand(text: string, ctx: Ctx): Promise<BooResult> {
  if (FAKE) return understandFake(text, ctx)
  const lower = text.toLowerCase()
  const named = ctx.pets.filter((p) => new RegExp(`\\b${p.name.toLowerCase()}\\b`).test(lower))

  // Red flags don't wait for the AI (and work offline): a fixed list, checked here first
  if (RED_FLAGS.some((f) => lower.includes(f))) return { kind: 'red-flag', petId: named.length === 1 ? named[0].id : ctx.pets.length === 1 ? ctx.pets[0].id : undefined, text }

  const context: PhraseContext = {
    today: today(),
    pets: ctx.pets.map((p) => ({ id: p.id, name: p.name, species: p.species, ...(p.breed && { breed: p.breed }) })),
    vaccines: ctx.vaccines.slice(-200).map((v) => ({ id: v.id, petId: v.petId, name: v.name, ...(v.given && { given: v.given }), ...(v.due && { due: v.due }) })),
    records: [...ctx.records].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 150).map((r) => ({ id: r.id, petId: r.petId, date: r.date, type: r.type, title: r.title })),
  }
  const { phrase } = await ask<{ phrase: Phrase }>({ type: 'phrase', text, context })
  return toResult(phrase, text, ctx)
}

function toResult(p: Phrase, text: string, ctx: Ctx): BooResult {
  const pet: Pet | undefined = p.petIds.length === 1 ? ctx.pets.find((x) => x.id === p.petIds[0]) : undefined
  const needsPet = ['weight', 'record', 'symptom', 'meds', 'question'].includes(p.kind)
  // Never guess a pet: anything about a pet that isn't clear goes back as "which one?" (a course of meds can be
  // for several pets at once; a note for two pets is picked with "Both" in the sheet)
  if (p.kind === 'which-pet' || (needsPet && !pet && !(p.kind === 'meds' && p.petIds.length > 1))) {
    if (!ctx.pets.length) return { kind: 'unclear', text }
    return { kind: 'which-pet', candidates: p.petIds.length ? p.petIds : ctx.pets.map((x) => x.id), text }
  }

  switch (p.kind) {
    case 'new-pet': {
      if (!p.newPet) return { kind: 'unclear', text }
      const { name, species, breed, ageYears, ageMonths } = p.newPet
      const birthDate = ageMonths ? addMonths(today(), -ageMonths) : ageYears ? addMonths(today(), -12 * ageYears) : undefined
      return { kind: 'new-pet', name, species, breed: breed ?? undefined, birthDate, text }
    }
    case 'weight':
      return p.weight ? { kind: 'weight', petId: pet!.id, value: p.weight.value, unit: p.weight.unit, text } : { kind: 'unclear', text }
    case 'record':
      return { kind: 'record', petId: pet!.id, type: 'note', title: p.record?.title ?? text.replace(/\.$/, ''), text }
    case 'symptom':
      return { kind: 'symptom', petId: pet!.id, title: p.symptom?.title ?? text.replace(/\.$/, ''), question: p.symptom?.question ?? `Just once? Is ${pet!.name} eating normally?` }
    case 'meds': {
      // A course needs how often and how long; if the phrase doesn't say, Boo doesn't guess
      if (!p.meds?.perDay || !p.meds.days) return { kind: 'unclear', text }
      const { name, dose, perDay, days } = p.meds
      const often = perDay === 1 ? 'once a day' : perDay === 2 ? 'twice a day' : `${perDay} times a day`
      return { kind: 'meds', petId: pet?.id ?? p.petIds[0], name, dose: dose ?? often, days, perDay, ...(p.petIds.length > 1 && { petIds: p.petIds }) }
    }
    case 'question':
      return answer(p, pet!, ctx)
    case 'red-flag':
      return { kind: 'red-flag', petId: pet?.id, text }
    default:
      return { kind: 'unclear', text }
  }
}

/** Boo's answer, written from the records Claude pointed to (Figma 10). Dates never come from the AI. */
function answer(p: Phrase, pet: Pet, ctx: Ctx): BooResult {
  const v = ctx.vaccines.find((x) => p.question?.vaccineIds.includes(x.id) && x.petId === pet.id && x.due)
  if (v?.due) {
    const doc = ctx.documents?.find((d) => d.id === v.documentId)
    const word = v.name.split(' ')[0].toLowerCase()
    const task = ctx.tasks?.find((t) => t.petId === pet.id && t.kind === 'vaccine' && !t.doneAt && (t.detail === v.name || t.title.toLowerCase().includes(word)))
    return {
      kind: 'answer',
      text: vaccineAnswer(pet.name, v.name, v.due),
      source: {
        petId: pet.id,
        label: `Source: ${(doc?.title ?? 'Vaccine certificate').toLowerCase()}`,
        detail: doc ? [doc.clinic, formatDay(doc.date, { month: 'short', day: 'numeric', year: 'numeric' })].filter(Boolean).join(' · ') : undefined,
        to: `/pets/${pet.id}/vaccines`,
      },
      petId: pet.id,
      taskId: v.due <= addDays(today(), 30) ? task?.id : undefined,
    }
  }
  const hit = ctx.records.filter((r) => p.question?.recordIds.includes(r.id) && r.petId === pet.id).sort((a, b) => b.date.localeCompare(a.date))[0]
  if (hit) {
    return {
      kind: 'answer',
      text: `Last time: ${formatDay(hit.date, { month: 'long', day: 'numeric' })} (${relative(hit.date)}) — “${hit.title}”.`,
      source: { petId: pet.id, label: `Source: ${hit.title}`, detail: formatDay(hit.date, { month: 'short', day: 'numeric', year: 'numeric' }), to: `/pets/${pet.id}` },
    }
  }
  return { kind: 'answer', text: `I don't have that in ${pet.name}'s records yet.` }
}
