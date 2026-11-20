// Focus outline guard (runs with `npm run lint`).
// The keyboard focus outline must sit only on things you can tap, follow their shape and not be cut off.
// 1. base.css: the focus rule lists tappable elements only (Storybook's "focus" switch marks every element).
// 2. Stories: `pseudo: { focusVisible: true }` outlines every box in the story; name the element instead.
// 3. Tappable things (`press`) are rounded (rounded-*) or draw the outline inside (focus-inset) in a card.

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const problems = []
const files = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? files(join(dir, f)) : [join(dir, f)]))

const css = readFileSync('src/styles/base.css', 'utf8')
if (/(^|[\s,}])\s*:focus-visible/m.test(css)) problems.push('src/styles/base.css: a bare :focus-visible rule outlines every element. Use :where(button, a[href], …):focus-visible.')

for (const file of files('src').filter((f) => f.endsWith('.tsx'))) {
  const text = readFileSync(file, 'utf8')
  text.split('\n').forEach((line, i) => {
    const at = `${file}:${i + 1}`
    if (file.endsWith('.stories.tsx') && /focusVisible:\s*true/.test(line)) problems.push(`${at}: focusVisible: true outlines every box. Use focusVisible: ['button'] (or a selector for one element).`)
    for (const [, cls] of line.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\})/g).map((m) => [m[0], m[1] ?? m[2]])) {
      if (!/(^|\s)press(\s|$)/.test(cls) || cls.includes('${')) continue
      if (!/(^|\s)(rounded-\S+|focus-inset)(\s|$)/.test(cls)) problems.push(`${at}: a tappable element without rounded-* or focus-inset: its focus outline would be a square box.`)
    }
  })
}

if (problems.length) {
  console.error(`Focus outline check: ${problems.length} problem(s)\n` + problems.map((p) => `  - ${p}`).join('\n'))
  process.exit(1)
}
console.log('Focus outline check: ok')
