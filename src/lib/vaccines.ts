// What a pet's vaccines add up to (Pet folder → Health → Vaccines, the Vaccines screen, the Attention card).

import type { Vaccine } from '../data/types'
import { formatDay, today } from './dates'

/** "Rabies (3-year)" → "Rabies" */
export const shortName = (v: Vaccine) => v.name.split(' (')[0]

export const isOverdue = (v: Vaccine, t = today()) => !!v.due && v.due < t

/** Soonest due first; overdue ones lead. */
export const byDue = (a: Vaccine, b: Vaccine) => (a.due ?? '9999').localeCompare(b.due ?? '9999')

/** "Rabies & DHPP", "Rabies, DHPP & Lyme" */
export function joinNames(names: string[]): string {
  return names.length < 2 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')} & ${names.at(-1)}`
}

export function vaccineSummary(vax: Vaccine[], t = today()) {
  const overdue = vax.filter((v) => isOverdue(v, t)).sort(byDue)
  const ok = vax.length - overdue.length
  const names = overdue.map(shortName)
  return {
    overdue,
    /** Health row: "2 overdue · 3 up to date" or "3 up to date" */
    line: overdue.length ? `${overdue.length} overdue${ok ? ` · ${ok} up to date` : ''}` : `${ok} up to date`,
    /** Health row, rose: "Rabies, DHPP · due Nov 1" */
    overdueLine: overdue.length ? `${names.join(', ')} · due ${formatDay(overdue[0].due!)}` : undefined,
    /** Attention card: "Rabies & DHPP are overdue" */
    attention: overdue.length ? `${joinNames(names)} ${overdue.length === 1 ? 'is' : 'are'} overdue` : undefined,
    /** Attention card, rose: "Due since Nov 1 · boarding will ask for proof" */
    attentionDetail: overdue.length ? `Due since ${formatDay(overdue[0].due!)} · boarding will ask for proof` : undefined,
  }
}

/** A vaccine's short name for titles: "Rabies (3-year)" → "Rabies". */
export const shortVaccine = (name: string) => name.split(' (')[0]
