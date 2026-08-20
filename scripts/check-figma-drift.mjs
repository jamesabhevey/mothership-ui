#!/usr/bin/env node
/**
 * Detect token drift between Figma and the code, without the variables API.
 *
 *   node scripts/check-figma-drift.mjs --calibrate   build the probe table
 *   node scripts/check-figma-drift.mjs               report drift
 *   node scripts/check-figma-drift.mjs --write       report and apply
 *
 * Why this exists
 * ---------------
 * Reading variable *definitions* needs Figma's variables REST API, which is
 * Enterprise-only. The ordinary file endpoint works on any plan, but returns
 * the values components actually paint rather than the variables behind them.
 *
 * So instead of asking "what is color/action/primary/default?", this asks
 * "what colour is the primary button still painted?" — and if that stops
 * matching the token, the token has drifted.
 *
 * Scope: colours only, deliberately.
 *
 * A first pass probed numbers too and produced nonsense — it matched the 4px
 * radius token to a 4px auto-layout gap, and a 44px touch target to an
 * unrelated 44px gap, because small integers recur everywhere. Any such probe
 * would raise a false alarm the moment an unrelated gap changed. Hex values are
 * distinctive enough for this to be sound; numbers are not, so they are left to
 * the variables API path or to a human.
 *
 * Shared values are handled as groups. Seven tokens are #ffffff, so a change
 * there cannot be attributed to one of them — the check reports the group and
 * asks for a decision instead of guessing. Groups holding a single token are
 * applied automatically.
 */
const TOKEN = process.env.FIGMA_TOKEN
const FILE_KEY = process.env.FIGMA_FILE_KEY
const CALIBRATE = process.argv.includes('--calibrate')
const WRITE = process.argv.includes('--write')

if (!TOKEN || !FILE_KEY) {
  console.error('Missing FIGMA_TOKEN and/or FIGMA_FILE_KEY. Nothing was changed.')
  process.exit(2)
}

const { readFileSync, writeFileSync, existsSync } = await import('node:fs')

const tokens = JSON.parse(readFileSync('tokens/tokens.json', 'utf8'))
const mappings = JSON.parse(readFileSync('code-connect/mappings.json', 'utf8'))
const nodeIds = Object.keys(mappings.components)

// ---------------------------------------------------------------- fetch

const url = `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${nodeIds.join(',')}`
const res = await fetch(url, { headers: { 'X-Figma-Token': TOKEN } })
if (!res.ok) {
  console.error(`Figma returned ${res.status} ${res.statusText}. Nothing was changed.`)
  process.exit(3)
}
const { nodes } = await res.json()

// ---------------------------------------------------------------- observe

const hex = ({ r, g, b }, opacity = 1) => {
  const c = (n) => Math.round(n * 255).toString(16).padStart(2, '0')
  return opacity >= 1
    ? `#${c(r)}${c(g)}${c(b)}`
    : `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)} / ${+opacity.toFixed(3)})`
}

/** Every observable value in the file, as `${nodeId}#${accessor}` -> value. */
const observed = new Map()

const paint = (list) => {
  const p = (list ?? []).find((x) => x.type === 'SOLID' && x.visible !== false)
  return p ? hex(p.color, p.opacity ?? 1) : null
}

const walk = (node) => {
  const id = node.id
  const fill = paint(node.fills)
  if (fill) observed.set(`${id}#fill`, fill)
  const stroke = paint(node.strokes)
  if (stroke) observed.set(`${id}#stroke`, stroke)
  if (typeof node.cornerRadius === 'number') observed.set(`${id}#cornerRadius`, `${node.cornerRadius}px`)
  if (typeof node.strokeWeight === 'number') observed.set(`${id}#strokeWeight`, `${node.strokeWeight}px`)
  if (typeof node.itemSpacing === 'number') observed.set(`${id}#itemSpacing`, `${node.itemSpacing}px`)
  if (node.absoluteBoundingBox?.height) observed.set(`${id}#height`, `${Math.round(node.absoluteBoundingBox.height)}px`)
  if (node.style) {
    const s = node.style
    if (s.fontSize) observed.set(`${id}#fontSize`, `${s.fontSize}px`)
    if (s.lineHeightPx) observed.set(`${id}#lineHeight`, `${Math.round(s.lineHeightPx)}px`)
    if (typeof s.letterSpacing === 'number') observed.set(`${id}#letterSpacing`, `${+s.letterSpacing.toFixed(2)}px`)
    if (s.fontWeight) observed.set(`${id}#fontWeight`, `${s.fontWeight}`)
  }
  for (const child of node.children ?? []) walk(child)
}

for (const key of Object.keys(nodes)) if (nodes[key]?.document) walk(nodes[key].document)

// ------------------------------------------------- flatten tokens to compare

/** Colour token name -> current value. Colours only; see the note above. */
const flat = new Map()
for (const [k, v] of Object.entries(tokens.color)) flat.set(k, v.toLowerCase())

const setTokenValue = (key, value) => {
  tokens.color[key] = value
}

/** Only colour observations are usable as probes. */
const colourObservations = () =>
  [...observed].filter(([k]) => k.endsWith('#fill') || k.endsWith('#stroke'))

// ---------------------------------------------------------------- calibrate

const PROBES = 'tokens/figma-probes.json'

if (CALIBRATE) {
  // Group tokens by value. A group with one token is attributable; a group with
  // several is still worth watching, it just needs a human to say which changed.
  const byValue = new Map()
  for (const [key, value] of flat) {
    if (!byValue.has(value)) byValue.set(value, [])
    byValue.get(value).push(key)
  }

  const colours = colourObservations()
  const probes = {}
  const unobserved = []

  for (const [value, keys] of byValue) {
    const spot = colours.find(([, v]) => String(v).toLowerCase() === value)
    if (!spot) {
      unobserved.push(`${value} (${keys.join(', ')})`)
      continue
    }
    probes[value] = { at: spot[0], expect: value, tokens: keys }
  }

  writeFileSync(
    PROBES,
    JSON.stringify(
      {
        $comment: [
          'Generated by `node scripts/check-figma-drift.mjs --calibrate`.',
          'Each entry names one place in the Figma file where a token value is',
          'observable, as nodeId#property. Regenerate after restructuring the',
          'Figma file or renaming tokens.',
        ],
        generated: new Date().toISOString().slice(0, 10),
        probes,
      },
      null,
      2,
    ) + '\n',
  )

  const covered = Object.values(probes).reduce((n, p) => n + p.tokens.length, 0)
  const single = Object.values(probes).filter((p) => p.tokens.length === 1).length
  console.log(`Observed ${colours.length} colour values across ${nodeIds.length} components.`)
  console.log(`${Object.keys(probes).length} probe(s) covering ${covered} of ${flat.size} colour tokens.`)
  console.log(`${single} probe(s) map to a single token and can be applied automatically.\n`)
  for (const [value, p] of Object.entries(probes)) {
    const mark = p.tokens.length === 1 ? 'auto ' : 'group'
    console.log(`  ${mark} ${value.padEnd(22)} ${p.tokens.join(', ')}`)
  }
  if (unobserved.length) {
    console.log(`\n${unobserved.length} value(s) not painted anywhere in the probed components:`)
    for (const u of unobserved) console.log(`  ${u}`)
  }
  process.exit(0)
}

// ---------------------------------------------------------------- check

if (!existsSync(PROBES)) {
  console.error(`No probe table at ${PROBES}. Run with --calibrate first.`)
  process.exit(2)
}

const { probes } = JSON.parse(readFileSync(PROBES, 'utf8'))
const drift = []
const needsDecision = []
const gone = []

for (const [value, probe] of Object.entries(probes)) {
  const now = observed.get(probe.at)
  if (now === undefined) {
    gone.push(`${value} — probe ${probe.at} no longer exists in the file`)
    continue
  }
  if (String(now).toLowerCase() === String(value).toLowerCase()) continue

  if (probe.tokens.length === 1) {
    drift.push({ path: probe.tokens[0], from: value, to: now, at: probe.at })
  } else {
    needsDecision.push({ tokens: probe.tokens, from: value, to: now, at: probe.at })
  }
}

console.log(`Checked ${Object.keys(probes).length} colour probes across ${nodeIds.length} components.\n`)

if (gone.length) {
  console.log(`${gone.length} probe(s) no longer resolve. Re-run --calibrate:`)
  for (const g of gone) console.log(`  ${g}`)
  console.log()
}

if (needsDecision.length) {
  console.log(`${needsDecision.length} change(s) that cannot be attributed to one token — decide by hand:\n`)
  for (const d of needsDecision)
    console.log(`  ${d.from} -> ${d.to}   affects one of: ${d.tokens.join(', ')}   (seen at ${d.at})`)
  console.log()
}

if (drift.length === 0) {
  if (!needsDecision.length) console.log('No drift. Figma and the code agree on every probed colour.')
  process.exit(gone.length || needsDecision.length ? 1 : 0)
}

console.log(`${drift.length} token(s) have drifted:\n`)
for (const d of drift) console.log(`  ${d.path}: ${d.from} -> ${d.to}   (seen at ${d.at})`)

if (WRITE) {
  for (const d of drift) setTokenValue(d.path, d.to)
  writeFileSync('tokens/tokens.json', JSON.stringify(tokens, null, 2) + '\n')
  console.log('\ntokens/tokens.json updated. Run `npm run tokens` to regenerate the CSS.')
}
process.exit(1)
