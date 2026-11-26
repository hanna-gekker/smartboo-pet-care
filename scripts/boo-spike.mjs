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
import { PAPER_SYSTEM as SYSTEM, Paper } from '../server/boo/paper.ts'
import { scorePaper as score } from '../evals/boo/score.mjs'

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
