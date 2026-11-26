// Boo spike, step 1: can Claude read real vet papers well enough?
//
// Reads every photo / PDF in a folder, asks Claude to pull out each pet with its vaccines and meds,
// the clinic and the amount, and writes what it found to <folder>/results/<model>/. Prints a table:
// time, tokens and cost per paper. For the made-up test papers (evals/boo/out) it also checks each
// answer against evals/boo/papers.mjs and gives a score. Nothing here touches the app.
//
// Run:  node --env-file=.env.local scripts/boo-spike.mjs [folder] [file name filter] [--model=claude-sonnet-5-5]
//       folder: boo-tests (your real papers, ignored by git; default) or evals/boo/out
// The AI key lives only in .env.local (ignored by git) as ANTHROPIC_API_KEY=...

import Anthropic from '@anthropic-ai/sdk'
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod'
import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const option = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=')[1]

const DIR = args[0] || 'boo-tests'
const MODEL = option('model') || 'claude-opus-5-5'
const OUT = path.join(DIR, 'results', MODEL)
// $ per token (Anthropic list prices, Nov 2026)
const PRICES = {
  'claude-opus-5-5': { input: 4 / 1e6, output: 20 / 1e6 },
  'claude-sonnet-5-5': { input: 2 / 1e6, output: 10 / 1e6 },
  'claude-haiku-5-5': { input: 0.1 / 1e6, output: 0.5 / 1e6 },
}
const PRICE = PRICES[MODEL]
if (!PRICE) throw new Error(`No price for ${MODEL}`)

const SPECIES = ['dog', 'cat', 'rabbit', 'hamster', 'guinea-pig', 'rat', 'chinchilla', 'ferret', 'hedgehog',
  'bird', 'parrot', 'fish', 'turtle', 'lizard', 'snake', 'frog', 'other']

// What Boo needs from a paper. Anything not written on the paper is null — never a guess.
// Vaccines and meds belong to a pet: one paper can be about two pets.
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
  meds: z.array(z.object({ name: z.string(), dose: z.string().nullable(), instructions: z.string().nullable() })),
})
const Paper = z.object({
  kind: z.enum(['vaccine certificate', 'invoice', 'visit summary', 'lab results', 'prescription', 'other vet paper', 'not a vet paper']),
  readable: z.enum(['clear', 'partly readable', 'too blurry']),
  pets: z.array(Pet).describe('every pet the paper is about, in the order they appear; empty if none can be read'),
  clinic: z.string().nullable(),
  vet: z.string().nullable(),
  visitDate: Day,
  amount: z.string().nullable().describe('total charged, with currency'),
  unsure: z.array(z.string()).describe('fields you could read only partly, e.g. "pets[0].vaccines[1].due"'),
})

const SYSTEM = `You read veterinary papers for a US pet owner's records app.
Copy what is written; never infer, round or invent a value. If something isn't on the paper, use null (or an empty list).
Dates: convert to YYYY-MM-DD only when the paper gives the full date; otherwise null and list the field in "unsure".
Pets: one entry per pet on the paper. Put each vaccine and medication under the pet it was given to.
Vaccines: one entry per vaccine, with the name as printed (e.g. "Rabies (3 year)", "DHPP"); "due" is the next due / expiration date if printed.
Vaccines and services listed on an invoice or visit summary without a date of their own were given on that paper's visit date.
Meds: only medicines prescribed or dispensed (tablets, liquids, drops, injections, flea / tick / heartworm products), with dose and instructions as written. Food, prescription diets and treats are not medicines, even when listed with them. Never add advice.
If a value is hard to read, give your best reading and list the field in "unsure".`

const MEDIA = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.pdf': 'application/pdf' }

const client = new Anthropic()
const filter = args[1]
// Known answers, for the made-up papers only
const EXPECTED = DIR.startsWith('evals/boo') ? Object.fromEntries((await import('../evals/boo/papers.mjs')).PAPERS.map((p) => [p.file, p.expected])) : {}
const files = fs.existsSync(DIR)
  ? fs.readdirSync(DIR).filter((f) => MEDIA[path.extname(f).toLowerCase()] && (!filter || f.includes(filter))).sort()
  : []
if (!files.length) {
  console.log(`No photos or PDFs in ${DIR}/. Put the vet papers there (jpg, png, webp, pdf).`)
  process.exit(1)
}
fs.mkdirSync(OUT, { recursive: true })

const rows = []
for (const file of files) {
  const media = MEDIA[path.extname(file).toLowerCase()]
  const data = fs.readFileSync(path.join(DIR, file)).toString('base64')
  const source = media === 'application/pdf'
    ? { type: 'document', source: { type: 'base64', media_type: media, data } }
    : { type: 'image', source: { type: 'base64', media_type: media, data } }
  const started = performance.now()
  try {
    const response = await client.beta.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      // A refusal is retried on another model by Anthropic (Haiku has no server-side fallback)
      ...(MODEL !== 'claude-haiku-5-5' && { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' }),
      output_config: { effort: 'medium', format: betaZodOutputFormat(Paper) },
      system: SYSTEM,
      messages: [{ role: 'user', content: [source, { type: 'text', text: 'Read this paper.' }] }],
    })
    const seconds = (performance.now() - started) / 1000
    const { input_tokens, output_tokens } = response.usage
    const cost = input_tokens * PRICE.input + output_tokens * PRICE.output
    const paper = response.parsed_output
    fs.writeFileSync(path.join(OUT, `${file}.json`), JSON.stringify({ model: response.model, stop: response.stop_reason, seconds, input_tokens, output_tokens, cost, paper }, null, 2))
    rows.push({
      file,
      kind: paper?.kind ?? `(${response.stop_reason})`,
      readable: paper?.readable ?? '',
      pets: paper?.pets.map((p) => [p.name, p.species].filter(Boolean).join(' · ')).join(' + ') ?? '',
      vaccines: paper?.pets.reduce((n, p) => n + p.vaccines.length, 0) ?? 0,
      meds: paper?.pets.reduce((n, p) => n + p.meds.length, 0) ?? 0,
      unsure: paper?.unsure.length ?? 0,
      ...(EXPECTED[file] && score(paper, EXPECTED[file])),
      sec: seconds.toFixed(1),
      cents: (cost * 100).toFixed(2),
    })
  } catch (error) {
    rows.push({ file, kind: `error: ${error instanceof Anthropic.APIError ? `${error.status} ${error.message}` : error}` })
  }
}

console.log(`\n${MODEL}`)
console.table(rows.map(({ misses: _misses, ...r }) => r))
for (const r of rows) if (r.misses?.length) console.log(`✗ ${r.file}: ${r.misses.join(' · ')}`)
const scored = rows.filter((r) => r.score)
if (scored.length) {
  const [ok, all] = scored.reduce(([a, b], r) => { const [x, y] = r.score.split('/').map(Number); return [a + x, b + y] }, [0, 0])
  console.log(`Score: ${ok}/${all} checks right (${Math.round((ok / all) * 100)}%)`)
}
const done = rows.filter((r) => r.cents)
if (done.length) {
  const avg = (k) => done.reduce((s, r) => s + Number(r[k]), 0) / done.length
  console.log(`${done.length} papers · average ${avg('sec').toFixed(1)} s · ${avg('cents').toFixed(2)} ¢ each · details in ${OUT}/`)
}

/** Compares Boo's reading with the known answer. Empty on the paper must stay empty. */
function score(got, want) {
  const misses = []
  let checks = 0
  const norm = (v) => (v == null ? null : String(v).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim())
  const same = (label, g, w, loose = false) => {
    checks++
    const a = norm(g), b = norm(w)
    const ok = b == null ? a == null : a != null && (loose ? a.includes(b) || b.includes(a) : a === b)
    if (!ok) misses.push(`${label}: ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`)
  }
  const pet = (label, g, w) => {
    for (const k of ['name', 'species', 'breed', 'birthDate', 'microchip']) if (k in w) same(`${label}.${k}`, g?.[k], w[k], k === 'breed')
    if (w.vaccines) {
      same(`${label} vaccines count`, g?.vaccines.length ?? 0, w.vaccines.length)
      for (const v of w.vaccines) {
        const x = g?.vaccines.find((y) => norm(y.name).includes(norm(v.name)))
        if (!x) { checks++; misses.push(`${label} vaccine ${v.name} missing`); continue }
        same(`${label} ${v.name}.given`, x.given, v.given)
        same(`${label} ${v.name}.due`, x.due, v.due)
      }
    }
    if (w.meds) {
      same(`${label} meds count`, g?.meds.length ?? 0, w.meds.length)
      for (const m of w.meds) {
        checks++
        if (!g?.meds.some((y) => norm(y.name).includes(norm(m.name)))) misses.push(`${label} med ${m.name} missing`)
      }
    }
  }
  if (!got) return { score: `0/1`, misses: ['no answer'] }
  if (want.kind) same('kind', got.kind, want.kind)
  if (want.readable) same('readable', got.readable, want.readable)
  if (want.pets) {
    same('pets count', got.pets.length, want.pets.length)
    for (const w of want.pets) pet(w.name ?? 'pet', got.pets.find((p) => norm(p.name) === norm(w.name)) ?? (want.pets.length === 1 ? got.pets[0] : undefined), w)
  }
  if ('clinic' in want) same('clinic', got.clinic, want.clinic, true)
  if ('visitDate' in want) same('visitDate', got.visitDate, want.visitDate)
  if ('amount' in want) {
    checks++
    const g = got.amount?.replace(/[^0-9.]/g, '') || null
    if ((want.amount ?? null) !== g && !(want.amount && g?.startsWith(want.amount))) misses.push(`amount: ${JSON.stringify(got.amount)} ≠ ${JSON.stringify(want.amount)}`)
  }
  return { score: `${checks - misses.length}/${checks}`, misses }
}
