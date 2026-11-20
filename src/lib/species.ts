// Species helpers: the label people read, and which species get vaccines.

import { SPECIES, type Species } from '../data/types'

export { SPECIES }

/** "guinea-pig" → "Guinea pig" */
export const speciesLabel = (s: Species) => (s[0].toUpperCase() + s.slice(1)).replace('-', ' ')

/** No vaccine records for fish, birds, reptiles and frogs. */
const NO_VACCINES: Species[] = ['fish', 'bird', 'parrot', 'turtle', 'lizard', 'snake', 'frog']
export const getsVaccines = (s: Species) => !NO_VACCINES.includes(s)
