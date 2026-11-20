// Weight units: lb / kg for larger pets, g / oz for small mammals, birds and reptiles; fish are not weighed.

import type { Species, WeightUnit } from '../data/types'

const GRAMS: Record<WeightUnit, number> = { g: 1, kg: 1000, oz: 28.3495, lb: 453.592 }

/** 950 g → 0.95 kg, rounded to what people write (one decimal for lb/kg/oz, whole grams). */
export function convertWeight(value: number, from: WeightUnit, to: WeightUnit): number {
  if (from === to) return value
  const out = (value * GRAMS[from]) / GRAMS[to]
  return to === 'g' ? Math.round(out) : Math.round(out * 10) / 10
}

const LARGER: Species[] = ['dog', 'cat', 'rabbit', 'ferret', 'other']

/** The two units offered for a species, the usual US one first. */
export const weightUnits = (s: Species): [WeightUnit, WeightUnit] => (LARGER.includes(s) ? ['lb', 'kg'] : ['g', 'oz'])

/** Fish have no weight step. */
export const getsWeighed = (s: Species) => s !== 'fish'
