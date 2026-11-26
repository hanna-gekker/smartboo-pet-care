// Checks Boo's server function end to end, the way the app will call it:
// the made-up papers (evals/boo/out, from make-papers.mjs) and the test phrases (evals/boo/phrases.mjs).
//
// Run:  npm run functions          (in another terminal: the function on http://localhost:8788)
//       node scripts/boo-eval.mjs [--url=https://smartboo-pet-care.pages.dev] [--only=papers|phrases]

import fs from 'node:fs'
import path from 'node:path'
import { PAPERS } from '../evals/boo/papers.mjs'
import { CONTEXT, PHRASES } from '../evals/boo/phrases.mjs'
import { scorePaper } from '../evals/boo/score.mjs'

const option = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=')[1]
const URL_ = `${option('url') ?? 'http://localhost:8788'}/api/boo`
const ONLY = option('only')
const MEDIA = { '.jpg': 'image/jpeg', '.png': 'image/png', '.pdf': 'application/pdf' }

const ask = async (body) => {
  const started = performance.now()
  const res = await fetch(URL_, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Boo-Device': 'eval-script' }, body: JSON.stringify(body) })
  return { status: res.status, json: await res.json().catch(() => null), sec: ((performance.now() - started) / 1000).toFixed(1) }
}

let ok = 0, all = 0
const tally = (score) => { const [a, b] = score.split('/').map(Number); ok += a; all += b }

if (ONLY !== 'phrases') {
  console.log(`\nPapers → ${URL_}`)
  for (const p of PAPERS) {
    const file = path.join('evals/boo/out', p.file)
    if (!fs.existsSync(file)) { console.log(`  (missing ${file} — run node evals/boo/make-papers.mjs)`); continue }
    const { status, json, sec } = await ask({ type: 'paper', mediaType: MEDIA[path.extname(file)], data: fs.readFileSync(file).toString('base64') })
    const { score, misses } = status === 200 ? scorePaper(json.paper, p.expected) : { score: '0/1', misses: [`HTTP ${status} ${JSON.stringify(json)}`] }
    tally(score)
    console.log(`  ${misses.length ? '✗' : '✓'} ${p.file.padEnd(30)} ${score.padStart(6)}  ${sec}s${misses.length ? `  ${misses.join(' · ')}` : ''}`)
  }
}

if (ONLY !== 'papers') {
  console.log(`\nPhrases → ${URL_}`)
  for (const c of PHRASES) {
    const { status, json, sec } = await ask({ type: 'phrase', text: c.text, context: CONTEXT })
    const got = json?.phrase
    const misses = []
    let checks = 0
    const check = (label, pass, seen) => { checks++; if (!pass) misses.push(`${label}: ${JSON.stringify(seen)}`) }
    if (status !== 200 || !got) { checks++; misses.push(`HTTP ${status} ${JSON.stringify(json)}`) } else {
      check('kind', c.kinds.includes(got.kind), got.kind)
      const ids = [...got.petIds].sort().join(','), want = [...c.petIds].sort().join(',')
      check('pets', c.petIdsSubset ? got.petIds.length > 1 && got.petIds.every((id) => c.petIds.includes(id)) : ids === want, got.petIds)
      if (c.weight) check('weight', got.weight?.value === c.weight.value && got.weight?.unit === c.weight.unit, got.weight)
      if (c.vaccineIds) check('vaccines', (got.question?.vaccineIds ?? []).join(',') === c.vaccineIds.join(','), got.question?.vaccineIds)
      if (c.recordIds) check('records', (got.question?.recordIds ?? [])[0] === c.recordIds[0], got.question?.recordIds)
      if (c.meds) check('meds', got.meds?.perDay === c.meds.perDay && got.meds?.days === c.meds.days, got.meds)
      if (c.newPet) check('new pet', got.newPet?.name === c.newPet.name && got.newPet?.species === c.newPet.species && got.newPet?.ageMonths === c.newPet.ageMonths, got.newPet)
    }
    ok += checks - misses.length; all += checks
    const extra = got?.symptom?.question ? `  “${got.symptom.question}”` : ''
    console.log(`  ${misses.length ? '✗' : '✓'} ${c.text.padEnd(64)} ${got?.kind ?? ''} ${sec}s${extra}${misses.length ? `  ${misses.join(' · ')}` : ''}`)
  }
}

console.log(`\nScore: ${ok}/${all} checks right (${Math.round((ok / all) * 100)}%)`)
