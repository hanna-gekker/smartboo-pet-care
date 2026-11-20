// Pet frame colours from Figma (pet/*): the petals around a pet's photo, and its placeholder when there is no photo.
// A new pet gets a colour no other pet of the same species uses (its species' own colour first, as in Figma
// "Pet avatars · final"). Older pets without a stored colour get one by their place in the list.

import type { Pet, PetColor, Species } from '../data/types'

export type { PetColor }

const ORDER: PetColor[] = ['ocean', 'lavender', 'butter', 'mint', 'pink', 'slate']

export const petColorAt = (index: number): PetColor => ORDER[index % ORDER.length]

/** Each species' own colour in Figma. */
const SPECIES_COLOR: Record<Species, PetColor> = {
  dog: 'ocean', cat: 'pink', rabbit: 'lavender', hamster: 'butter', 'guinea-pig': 'butter', rat: 'lavender',
  chinchilla: 'ocean', ferret: 'pink', hedgehog: 'butter', bird: 'mint', parrot: 'mint', fish: 'ocean',
  turtle: 'mint', lizard: 'mint', snake: 'lavender', frog: 'mint', other: 'ocean',
}

/** The pet's frame colour: the one it was given, or one by its place in the list. */
export function petColor(pet: Pet, pets: Pet[]): PetColor {
  return pet.color ?? petColorAt(Math.max(0, pets.findIndex((p) => p.id === pet.id)))
}

/** For a new pet: its species' colour if free, else a colour no pet of that species uses, else any. */
export function pickPetColor(species: Species, pets: Pet[]): PetColor {
  const taken = new Set(pets.filter((p) => p.species === species).map((p) => petColor(p, pets)))
  const own = SPECIES_COLOR[species]
  if (!taken.has(own)) return own
  return ORDER.find((c) => !taken.has(c)) ?? own
}

/** True when another pet of the same species shares this frame colour: show the first letter to tell them apart. */
export function needsInitial(pet: Pet, pets: Pet[]): boolean {
  if (pet.photo) return false
  const c = petColor(pet, pets)
  return pets.some((p) => p.id !== pet.id && p.species === pet.species && !p.photo && petColor(p, pets) === c)
}
