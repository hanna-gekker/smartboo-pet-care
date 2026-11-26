// Boo reads a vet paper: the form Claude fills in and the rules it follows.
// Used by the server function (functions/api/boo.ts) and the spike script (scripts/boo-spike.mjs).
// Scored on evals/boo (made-up papers with known answers) — change the rules there first.

import { z } from 'zod'

export const SPECIES = ['dog', 'cat', 'rabbit', 'hamster', 'guinea-pig', 'rat', 'chinchilla', 'ferret', 'hedgehog',
  'bird', 'parrot', 'fish', 'turtle', 'lizard', 'snake', 'frog', 'other'] as const

// Anything not written on the paper is null — never a guess. Vaccines and meds belong to a pet:
// one paper can be about two pets.
const Day = z.string().nullable().describe('YYYY-MM-DD exactly as written on the paper, or null')

const Pet = z.object({
  name: z.string().nullable(),
  species: z.enum(SPECIES).nullable(),
  breed: z.string().nullable(),
  birthDate: Day,
  sex: z.string().nullable(),
  weight: z.string().nullable().describe('with its unit, as written'),
  microchip: z.string().nullable(),
  vaccines: z.array(z.object({ name: z.string(), given: Day, due: Day })),
  meds: z.array(z.object({
    name: z.string(),
    where: z.enum(['given at the clinic', 'to give at home', 'unclear']),
    dose: z.string().nullable().describe('one dose, from the instructions (e.g. "½ tablet", "2.5 mL"); never a quantity dispensed or billed'),
    instructions: z.string().nullable(),
    perDay: z.number().nullable().describe('times a day, from the instructions ("twice daily", "every 12 hours" → 2); null if not daily or not written'),
    days: z.number().nullable().describe('how many days, from the instructions; null if not written'),
  })),
})

export const Paper = z.object({
  kind: z.enum(['vaccine certificate', 'invoice', 'visit summary', 'lab results', 'prescription', 'other vet paper', 'not a vet paper']),
  readable: z.enum(['clear', 'partly readable', 'too blurry']),
  pets: z.array(Pet).describe('every pet the paper is about, in the order they appear; empty if none can be read'),
  clinic: z.string().nullable(),
  vet: z.string().nullable(),
  visitDate: Day,
  amount: z.string().nullable().describe('total charged, with currency'),
  unsure: z.array(z.string()).describe('fields you could read only partly, e.g. "pets[0].vaccines[1].due"'),
})
export type Paper = z.infer<typeof Paper>

export const PAPER_SYSTEM = `You read veterinary papers for a US pet owner's records app.
Copy what is written; never infer, round or invent a value. If something isn't on the paper, use null (or an empty list).
Dates: convert to YYYY-MM-DD only when the paper gives the full date; otherwise null and list the field in "unsure".
Pets: one entry per pet on the paper. Put each vaccine and medication under the pet it was given to.
Vaccines: one entry per vaccine, with the name as printed (e.g. "Rabies (3 year)", "DHPP"); "due" is the next due / expiration date if printed.
Vaccines and services listed on an invoice or visit summary without a date of their own were given on that paper's visit date.
Meds: only medicines given, prescribed or dispensed in this visit (tablets, liquids, drops, injections, fluids, flea / tick / heartworm products), with instructions as written. Food, prescription diets and treats are not medicines, even when listed with them. A medicine the pet was already on ("current meds") is not one of this visit's meds. Never add advice.
For each medicine, "where": "given at the clinic" when the clinic gave it (injections, IV / SQ fluids, a dose given during the visit or stay); "to give at home" when it was dispensed or prescribed for the owner to give; "unclear" when the paper doesn't say.
"dose" is one dose from the instructions; a quantity dispensed or billed (e.g. "60 mL", "6,000 mg", "Qty 30") is not a dose — leave dose null when there are no instructions.
"perDay" and "days" only from the instructions as written ("every 12 hours for 7 days" → 2 and 7). A schedule that changes ("twice daily for 14 days, then once daily") → the first part. Monthly or as-needed medicines → null. Never fill them from a medicine's usual schedule.
If a value is hard to read, give your best reading and list the field in "unsure".`

export const PAPER_MEDIA = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'] as const
export type PaperMedia = (typeof PAPER_MEDIA)[number]

/** The content block for one paper. */
export const paperBlock = (mediaType: PaperMedia, data: string) =>
  mediaType === 'application/pdf'
    ? ({ type: 'document', source: { type: 'base64', media_type: mediaType, data } } as const)
    : ({ type: 'image', source: { type: 'base64', media_type: mediaType, data } } as const)
