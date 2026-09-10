#!/usr/bin/env node
/**
 * Does the code still hold the colours Figma holds — in both modes?
 *
 *   node scripts/check-figma-drift.mjs           report
 *   node scripts/check-figma-drift.mjs --write   report and bring the code into line
 *
 * How it reads Figma
 * ------------------
 * By name, from the Foundations / Colour page, where every token has a Light
 * and a Dark swatch pinned to its mode. See scripts/lib/figma-colour-modes.mjs.
 *
 * This replaced an earlier approach that had to work without being able to read
 * variable names at all: it recorded the colours components were painted and
 * watched for those to change. That worked, but it could only ever check the
 * mode the artwork happened to be in, and it could not attribute a change when
 * several tokens shared a value — seven tokens are #ffffff, so a change there
 * came out as "one of these seven" and needed a person. Reading by name has
 * neither problem, so both modes are covered and every difference names its
 * token.
 *
 * What it does not check: whether components in Figma are still *using* the
 * tokens. This compares the palette, not the artwork painted from it, so a
 * button given a hardcoded fill in Figma would not show up here.
 *
 * Scope is colour, because colour is the only collection with modes and the
 * only one this page exposes. Numbers were deliberately left out of the old
 * check too: small integers recur everywhere in a Figma file, so matching 4px
 * to a radius rather than to an unrelated gap was guesswork that produced false
 * alarms.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { readColourModes, sameValue } from './lib/figma-colour-modes.mjs'

const TOKEN = process.env.FIGMA_TOKEN
const FILE_KEY = process.env.FIGMA_FILE_KEY
const WRITE = process.argv.includes('--write')

if (!TOKEN || !FILE_KEY) {
  console.error('Missing FIGMA_TOKEN and/or FIGMA_FILE_KEY. Nothing was changed.')
  process.exit(2)
}

const tokens = JSON.parse(readFileSync('tokens/tokens.json', 'utf8'))

let figma
try {
  figma = await readColourModes({ fileKey: FILE_KEY, token: TOKEN })
} catch (error) {
  // Loudly, and without touching anything. A palette that cannot be read is
  // not the same as a palette that agrees, and the difference matters when
  // this runs unattended every Monday.
  console.error(`${error.message}\n\nNothing was changed.`)
  process.exit(3)
}

const MODES = ['light', 'dark']
const drift = []
const onlyInFigma = []
const onlyInCode = []
const incomplete = []

for (const [name, value] of Object.entries(figma.modes)) {
  if (!tokens.color[name]) {
    onlyInFigma.push(name)
    continue
  }
  for (const mode of MODES) {
    const theirs = value[mode]
    const ours = tokens.color[name]?.[mode]
    if (!theirs) {
      incomplete.push(`${name} has no ${mode} swatch in Figma`)
      continue
    }
    if (!sameValue(ours, theirs)) drift.push({ name, mode, from: ours, to: theirs })
  }
}

for (const name of Object.keys(tokens.color)) {
  if (!figma.modes[name]) onlyInCode.push(name)
}

const checked = Object.keys(figma.modes).length

console.log(`Read ${checked} colour tokens from ${figma.frame}, both modes.\n`)

if (incomplete.length) {
  console.log(`${incomplete.length} token(s) missing a swatch, so one mode could not be compared:`)
  for (const line of incomplete) console.log(`  ${line}`)
  console.log()
}

// Added and removed tokens are reported rather than applied. A new token needs
// a name, a place on the Colour page and usually a decision about what it is
// for; none of that belongs to a job running on a schedule.
if (onlyInFigma.length) {
  console.log(`${onlyInFigma.length} token(s) in Figma that the code does not have — add by hand:`)
  for (const name of onlyInFigma) {
    const v = figma.modes[name]
    console.log(`  color/${name}   light ${v.light ?? '—'}   dark ${v.dark ?? '—'}`)
  }
  console.log()
}

if (onlyInCode.length) {
  console.log(`${onlyInCode.length} token(s) in the code that Figma no longer has — remove by hand:`)
  for (const name of onlyInCode) console.log(`  color/${name}`)
  console.log()
}

if (!drift.length) {
  if (!onlyInFigma.length && !onlyInCode.length && !incomplete.length) {
    console.log('No drift. Figma and the code agree on every colour token, in both modes.')
  }
  process.exit(onlyInFigma.length || onlyInCode.length || incomplete.length ? 1 : 0)
}

const byMode = (mode) => drift.filter((d) => d.mode === mode)
console.log(
  `${drift.length} value(s) have drifted across ${new Set(drift.map((d) => d.name)).size} token(s) ` +
    `— ${byMode('light').length} in light, ${byMode('dark').length} in dark:\n`,
)
for (const mode of MODES) {
  for (const d of byMode(mode)) {
    console.log(`  ${mode.padEnd(5)} color/${d.name.padEnd(26)} ${d.from ?? '—'} -> ${d.to}`)
  }
}

if (WRITE) {
  for (const d of drift) tokens.color[d.name][d.mode] = d.to
  writeFileSync('tokens/tokens.json', JSON.stringify(tokens, null, 2) + '\n')
  console.log('\ntokens/tokens.json updated. Run `npm run tokens` to regenerate the stylesheets.')
}
process.exit(1)
