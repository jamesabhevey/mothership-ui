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
 * It then checks the other direction: whether the components are still painted
 * from that palette. Any solid fill or stroke in a mapped component whose value
 * is not a token in either mode was typed in by hand, and is reported with the
 * layers painting it. That question is asked by value rather than by name, so
 * it does not care which token a colour belongs to — only whether it is in the
 * system at all. Which is why it has none of the ambiguity that sank the old
 * approach: it never has to decide which of seven #ffffff tokens a colour is.
 *
 * It then reads the type scale and the dimension scale, from the Foundations
 * Typography and Dimension frames. Numbers were left out of the old check for
 * a good reason — small integers recur everywhere in a Figma file, so matching
 * 4px to a radius rather than to an unrelated gap was guesswork that produced
 * false alarms — but that reason does not apply here. Each token has its own
 * named frame stating its own value, so nothing is inferred from the artwork.
 *
 * Only colour is compared in both modes, because colour is the only collection
 * that has modes. Motion is not compared at all: its durations and curves live
 * only as Figma variables, with no page to read them from, and variables are
 * the one thing this plan cannot fetch.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { readColourModes, readPaintedColours, sameValue } from './lib/figma-colour-modes.mjs'
import { readTypeStyles, readDimensions, normaliseName } from './lib/figma-foundations.mjs'

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

// ------------------------------------------------------- hard-coded colours

const hardCoded = []
try {
  const mappings = JSON.parse(readFileSync('code-connect/mappings.json', 'utf8'))
  const nodeIds = Object.keys(mappings.components ?? {})
  if (nodeIds.length) {
    const painted = await readPaintedColours({ fileKey: FILE_KEY, token: TOKEN, nodeIds })
    const palette = Object.values(figma.modes).flatMap((v) => [v.light, v.dark]).filter(Boolean)
    for (const [value, where] of painted) {
      if (!palette.some((p) => sameValue(p, value))) hardCoded.push({ value, where })
    }
  }
} catch (error) {
  console.log(`Could not check for hard-coded colours: ${error.message}\n`)
}

if (hardCoded.length) {
  console.log(
    `NEEDS A PERSON — ${hardCoded.length} colour(s) painted in the components are not in the ` +
      'palette, in either mode. Either the layer needs binding to a variable, or the colour needs ' +
      'to become one:\n',
  )
  for (const { value, where } of hardCoded) {
    console.log(`  ${value}`)
    for (const w of where) console.log(`      ${w}`)
  }
  console.log()
} else {
  console.log('Every colour painted in the components is a token. Nothing hard-coded.\n')
}

// ------------------------------------------------- type and dimension scales
//
// Reported, never written. A colour that has moved is a value to copy across;
// a type step or a spacing token that has appeared, vanished or changed size is
// a decision about the scale itself, and the person who made it in Figma is the
// one who should make it here.

const scaleDiffs = []
const scaleMissing = []
let scaleError = null

/**
 * Compare one flat map of Figma names against one of code names.
 *
 * `fields` is explicit rather than taken from whatever keys the Figma side
 * happens to carry. The dimension reader also returns the section a token was
 * listed under, which is useful in a report and meaningless as a comparison —
 * left implicit, it reported every dimension token as drifted because the code
 * has no section at all.
 */
const compareScale = (kind, fields, fromFigma, fromCode) => {
  const codeByKey = new Map(Object.entries(fromCode).map(([n, v]) => [normaliseName(n), [n, v]]))
  const seen = new Set()

  for (const [name, figmaValue] of Object.entries(fromFigma)) {
    const key = normaliseName(name)
    seen.add(key)
    const match = codeByKey.get(key)
    if (!match) {
      scaleMissing.push({ kind, name, where: 'Figma', value: figmaValue })
      continue
    }
    const [codeName, codeValue] = match
    for (const field of fields) {
      if (String(figmaValue[field]) !== String(codeValue[field])) {
        scaleDiffs.push({ kind, name: codeName, field, from: codeValue[field], to: figmaValue[field] })
      }
    }
  }

  for (const [key, [codeName, codeValue]] of codeByKey) {
    if (!seen.has(key)) scaleMissing.push({ kind, name: codeName, where: 'the code', value: codeValue })
  }
}

try {
  const type = await readTypeStyles({ fileKey: FILE_KEY, token: TOKEN })
  compareScale('type', ['size', 'lineHeight', 'letterSpacing', 'weight'], type.styles, tokens.type)

  const dim = await readDimensions({ fileKey: FILE_KEY, token: TOKEN })
  const codeDimensions = {}
  for (const [group, prefix] of [
    ['space', 'space/'],
    ['radius', 'radius/'],
    ['borderWidth', 'border-width/'],
    ['size', 'size/'],
  ]) {
    for (const [key, value] of Object.entries(tokens[group] ?? {})) {
      codeDimensions[`${prefix}${key}`] = { value }
    }
  }
  compareScale('dimension', ['value'], dim.values, codeDimensions)
} catch (error) {
  scaleError = error.message
}

if (scaleError) {
  console.log(`Could not compare the type and dimension scales: ${scaleError}\n`)
} else if (!scaleDiffs.length && !scaleMissing.length) {
  console.log('Figma and the code agree on every type step and every dimension token.\n')
} else {
  if (scaleDiffs.length) {
    console.log(`${scaleDiffs.length} value(s) have drifted on the type and dimension scales:\n`)
    for (const d of scaleDiffs) {
      console.log(`  ${d.kind.padEnd(9)} ${d.name.padEnd(28)} ${d.field.padEnd(13)} ${d.from ?? '—'} -> ${d.to}`)
    }
    console.log()
  }
  if (scaleMissing.length) {
    console.log(
      `NEEDS A PERSON — ${scaleMissing.length} token(s) exist on one side only. Adding or ` +
        'removing a step changes the scale, so neither is applied automatically:\n',
    )
    for (const m of scaleMissing) {
      const value = m.value.value ?? m.value.size ?? ''
      console.log(`  only in ${m.where.padEnd(8)} ${m.kind.padEnd(9)} ${m.name.padEnd(28)} ${value}`)
    }
    console.log()
  }
}

const scaleNeedsAPerson = scaleMissing.length + scaleDiffs.length + (scaleError ? 1 : 0)

const needsAPerson = onlyInFigma.length + onlyInCode.length + incomplete.length + hardCoded.length + scaleNeedsAPerson

if (!drift.length) {
  if (!needsAPerson) {
    console.log('No drift. Figma and the code agree on every colour token, in both modes.')
  }
  process.exit(needsAPerson ? 1 : 0)
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
