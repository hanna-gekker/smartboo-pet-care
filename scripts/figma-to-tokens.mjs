// Step 1 of `npm run tokens`: design/figma-variables.json (raw Figma export) → tokens.json (W3C DTCG).
//
// - Only the "SmartBoo · …" collections are used; "Legacy · …" archives are skipped.
// - Collections with one mode (Primitives, Layout) go to the top level as they are.
// - Collections with several modes (Color: Light, Dark) go under the mode name.
// - Names, values, types, descriptions and references ({blue.700}) stay exactly as in Figma.

import { readFileSync, writeFileSync } from 'node:fs'

const SOURCE = 'design/figma-variables.json'
const TARGET = 'tokens.json'
const PREFIX = 'SmartBoo · '

const figma = JSON.parse(readFileSync(SOURCE, 'utf8'))
const tokens = {}

const add = (target, groups, where) => {
  for (const [name, group] of Object.entries(groups)) {
    if (name in target) throw new Error(`Two Figma groups are both called "${name}" (${where}). Rename one in Figma.`)
    target[name] = group
  }
}

for (const [collection, modes] of Object.entries(figma)) {
  if (!collection.startsWith(PREFIX)) continue
  const modeNames = Object.keys(modes)
  if (modeNames.length === 1) {
    add(tokens, modes[modeNames[0]], collection)
  } else {
    for (const mode of modeNames) {
      tokens[mode] ??= {}
      add(tokens[mode], modes[mode], `${collection} / ${mode}`)
    }
  }
}

writeFileSync(TARGET, JSON.stringify(tokens, null, 2) + '\n')
console.log(`✓ ${TARGET} from ${SOURCE}`)
