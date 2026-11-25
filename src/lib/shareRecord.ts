// What a shared record says (Share → Figma 17): one builder for both the on-screen preview and the PDF, so the
// preview is exactly what the boarding place, the new vet or the ER gets.

import type { AppData, Pet } from '../data/types'
import { addDays, ageShort, formatDay, today } from './dates'
import { formatPhone } from './phone'
import { getsVaccines, speciesLabel } from './species'
import { byDue, isOverdue, shortName } from './vaccines'

export type SetKey = 'boarding' | 'vet' | 'emergency'

/** Figma 15 "Who is it for?" */
export const SETS: { key: SetKey; icon: 'home' | 'stethoscope' | 'shield-alert'; title: string; what: string; record: string }[] = [
  { key: 'boarding', icon: 'home', title: 'Boarding & groomer', what: 'Vaccines, vet, your contacts', record: 'Boarding & groomer record' },
  { key: 'vet', icon: 'stethoscope', title: 'New vet', what: 'Everything: history, meds, vaccines, documents', record: 'New vet record' },
  { key: 'emergency', icon: 'shield-alert', title: 'Emergency', what: 'Meds now, allergies, last 2 weeks of symptoms, vet, weight', record: 'Emergency record' },
]

export type RecordLine = { text: string; warn?: boolean }
export type RecordSection = { title?: string; lines: RecordLine[] }
export type ShareRecord = { title: string; date: string; pets: { heading: string; sections: RecordSection[] }[]; contacts: RecordSection }

const long = (day: string) => formatDay(day, { month: 'short', day: 'numeric', year: 'numeric' })

/** "Dog · vaccines: 2 overdue" / "Dog · vaccines up to date" / "Cat" (Figma 16). */
export function petLine(pet: Pet, data: Pick<AppData, 'vaccines'>): { text: string; overdue: string[] } {
  const vax = data.vaccines.filter((v) => v.petId === pet.id)
  const overdue = vax.filter((v) => isOverdue(v)).map(shortName)
  const status = !getsVaccines(pet.species) || !vax.length ? '' : overdue.length ? `vaccines: ${overdue.length} overdue` : 'vaccines up to date'
  return { text: [speciesLabel(pet.species), status].filter(Boolean).join(' · '), overdue }
}

export function buildRecord(set: SetKey, petIds: string[], data: AppData): ShareRecord {
  const t = today()
  const pets = petIds.map((id) => data.pets.find((p) => p.id === id)).filter((p): p is Pet => !!p)
  return {
    title: SETS.find((s) => s.key === set)!.record,
    date: long(t),
    pets: pets.map((p) => {
      const vax = data.vaccines.filter((v) => v.petId === p.id).sort(byDue)
      const meds = data.meds.filter((m) => m.petId === p.id && (!m.until || m.until >= t))
      const weights = data.records.filter((r) => r.petId === p.id && r.type === 'weight' && r.value !== undefined).sort((a, b) => b.date.localeCompare(a.date))
      const vaccineLines: RecordLine[] = vax.length
        ? vax.map((v) => ({
            text: `${shortName(v)} — given ${long(v.given)}${v.due ? ` · due ${long(v.due)}` : ''}${isOverdue(v) ? ' (overdue)' : ''}`,
            warn: isOverdue(v),
          }))
        : [{ text: 'No vaccine records yet' }]
      const medLines = meds.length ? meds.map((m) => ({ text: `${m.name} — ${m.dose}${m.until ? ` · until ${long(m.until)}` : ''}` })) : [{ text: 'None' }]
      const allergyLines = [{ text: p.allergies.join(', ') || 'None known' }]
      const weightLines = weights[0] ? [{ text: `${weights[0].value} ${p.weightUnit} · ${long(weights[0].date)}` }] : []
      const sections: RecordSection[] =
        set === 'boarding'
          ? getsVaccines(p.species)
            ? [{ lines: vaccineLines }]
            : []
          : set === 'emergency'
            ? [
                { title: 'Meds now', lines: medLines },
                { title: 'Allergies', lines: allergyLines },
                {
                  title: 'Symptoms, last 2 weeks',
                  lines: data.records
                    .filter((r) => r.petId === p.id && r.type === 'health' && r.date >= addDays(t, -14))
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((r) => ({ text: `${formatDay(r.date)} — ${r.title}` })),
                },
                ...(weightLines.length ? [{ title: 'Weight', lines: weightLines }] : []),
              ]
            : [
                ...(getsVaccines(p.species) ? [{ title: 'Vaccines', lines: vaccineLines }] : []),
                { title: 'Meds now', lines: medLines },
                { title: 'Allergies', lines: allergyLines },
                ...(weightLines.length ? [{ title: 'Weight', lines: weightLines }] : []),
                {
                  title: 'History',
                  lines: data.records
                    .filter((r) => r.petId === p.id && r.type !== 'weight')
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .slice(0, 12)
                    .map((r) => ({ text: `${long(r.date)} — ${r.title}${r.detail ? ` · ${r.detail}` : ''}` })),
                },
                {
                  title: 'Documents',
                  lines: data.documents.filter((d) => d.petId === p.id).map((d) => ({ text: [d.title, d.clinic, long(d.date)].filter(Boolean).join(' · ') })),
                },
              ]
      // An empty list says so instead of vanishing
      for (const s of sections) if (!s.lines.length) s.lines.push({ text: 'None logged' })
      return {
        heading: [p.name, speciesLabel(p.species), p.breed, ageShort(p.birthDate), set !== 'boarding' && p.microchip && `Chip ${p.microchip}`].filter(Boolean).join(' · '),
        sections,
      }
    }),
    contacts: {
      title: 'Vet & owner',
      lines: [
        ...[...new Map(pets.filter((p) => p.vet).map((p) => [p.vet!.name, p.vet!])).values()].map((v) => ({
          text: [v.name, v.clinic, formatPhone(v.phone)].filter(Boolean).join(' · '),
        })),
        ...(data.settings.owner ? [{ text: [data.settings.owner.name, formatPhone(data.settings.owner.phone), data.settings.owner.email].filter(Boolean).join(' · ') }] : []),
      ],
    },
  }
}
