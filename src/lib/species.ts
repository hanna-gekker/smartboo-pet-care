// Species helpers: the label people read, and which species get vaccines.

import { SPECIES, type Species } from '../data/types'

export { SPECIES }

/** "guinea-pig" → "Guinea pig" */
export const speciesLabel = (s: Species) => (s[0].toUpperCase() + s.slice(1)).replace('-', ' ')

/** No vaccine records for fish, birds, reptiles and frogs. */
const NO_VACCINES: Species[] = ['fish', 'bird', 'parrot', 'turtle', 'lizard', 'snake', 'frog']
export const getsVaccines = (s: Species) => !NO_VACCINES.includes(s)

/** Popular breeds (kinds, for fish) per species, from Figma "Add your pet · step by step". Species without a list
 *  get only the search field. */
export const POPULAR_BREEDS: Partial<Record<Species, string[]>> = {
  dog: ['Labrador Retriever', 'Golden Retriever', 'French Bulldog', 'Beagle', 'German Shepherd', 'Poodle', 'Mixed breed'],
  hamster: ['Syrian', 'Dwarf Campbell', 'Winter White', 'Roborovski', 'Chinese'],
  fish: ['Betta', 'Goldfish', 'Clownfish', 'Guppy', 'Tetra', 'Angelfish'],
}
