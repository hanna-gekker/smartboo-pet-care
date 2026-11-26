// Scores Boo's answers against the known ones in papers.mjs and phrases.mjs.

/** Compares Boo's reading with the known answer. Empty on the paper must stay empty. */
export function scorePaper(got, want) {
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
        const x = g?.meds.find((y) => norm(y.name).includes(norm(m.name)))
        if (!x) misses.push(`${label} med ${m.name} missing`)
        else {
          if (m.where) same(`${label} ${m.name}.where`, x.where, m.where)
          for (const k of ['perDay', 'days']) if (k in m) same(`${label} ${m.name}.${k}`, x[k], m[k])
        }
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
