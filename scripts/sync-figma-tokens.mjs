#!/usr/bin/env node
/**
 * Pull the Figma variables into tokens/tokens.json.
 *
 *   node scripts/sync-figma-tokens.mjs           report drift, change nothing
 *   node scripts/sync-figma-tokens.mjs --write    apply, then `npm run tokens`
 *
 * Needs two environment variables:
 *   FIGMA_TOKEN     personal access token with file read scope
 *   FIGMA_FILE_KEY  the library file key
 *
 * The file key is read from the environment rather than committed, because this
 * repository is public and the key identifies an internal file.
 *
 * Deliberately conservative: it only updates keys it actually finds in Figma,
 * never deletes anything, and reports what it could not see. A partial read
 * must never be able to wipe the token set.
 */
const TOKEN = process.env.FIGMA_TOKEN
const FILE_KEY = process.env.FIGMA_FILE_KEY
const WRITE = process.argv.includes('--write')

if (!TOKEN || !FILE_KEY) {
  console.error('Missing FIGMA_TOKEN and/or FIGMA_FILE_KEY. Nothing was changed.')
  process.exit(2)
}

const { readFileSync, writeFileSync } = await import('node:fs')

const res = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/variables/local`, {
  headers: { 'X-Figma-Token': TOKEN },
})

if (res.status === 403) {
  console.error(
    'Figma returned 403 for the variables endpoint.\n' +
      'The Variables REST API is limited to Enterprise plans, and the token needs file read scope.\n' +
      'Nothing was changed.',
  )
  process.exit(3)
}
if (!res.ok) {
  console.error(`Figma returned ${res.status} ${res.statusText}. Nothing was changed.`)
  process.exit(3)
}

const { meta } = await res.json()
const variables = Object.values(meta.variables ?? {})
const collections = meta.variableCollections ?? {}

const hex = ({ r, g, b, a = 1 }) => {
  const c = (n) => Math.round(n * 255).toString(16).padStart(2, '0')
  return a === 1 ? `#${c(r)}${c(g)}${c(b)}` : `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)} / ${+a.toFixed(3)})`
}

/** Resolve a value, following aliases to another variable. */
const resolve = (variable, depth = 0) => {
  const collection = collections[variable.variableCollectionId]
  const modeId = collection?.defaultModeId ?? Object.keys(variable.valuesByMode)[0]
  let value = variable.valuesByMode[modeId]
  if (value?.type === 'VARIABLE_ALIAS') {
    if (depth > 8) return null
    const target = meta.variables[value.id]
    return target ? resolve(target, depth + 1) : null
  }
  if (variable.resolvedType === 'COLOR' && value && typeof value === 'object') return hex(value)
  if (variable.resolvedType === 'FLOAT' && typeof value === 'number') return value
  if (variable.resolvedType === 'STRING') return value
  return null
}

// Figma variable name -> which tokens.json section and key it belongs to.
const route = (name) => {
  const m = (prefix, section) => (name.startsWith(prefix) ? [section, name.slice(prefix.length)] : null)
  return (
    m('color/', 'color') ??
    m('radius/', 'radius') ??
    m('border/width/', 'borderWidth') ??
    m('space/', 'space') ??
    m('size/', 'size') ??
    null
  )
}

const tokens = JSON.parse(readFileSync('tokens/tokens.json', 'utf8'))
const changes = []
const unseen = new Set()
for (const section of ['color', 'radius', 'borderWidth', 'space', 'size'])
  for (const key of Object.keys(tokens[section])) unseen.add(`${section}:${key}`)

const typeSeen = []

for (const variable of variables) {
  const value = resolve(variable)
  if (value === null || value === undefined) continue

  // Typography variables are per-facet (size / line-height / tracking) and are
  // reported rather than written: the code pairs them into single steps, and
  // the mapping is not one to one.
  if (variable.name.startsWith('type/')) {
    typeSeen.push(`${variable.name} = ${value}`)
    continue
  }

  const hit = route(variable.name)
  if (!hit) continue
  const [section, key] = hit
  unseen.delete(`${section}:${key}`)

  const next = typeof value === 'number' ? `${value}px` : value
  const current = tokens[section][key]
  if (current === undefined) changes.push({ kind: 'new', section, key, from: '—', to: next })
  else if (current !== next) changes.push({ kind: 'changed', section, key, from: current, to: next })
  if (current === undefined || current !== next) tokens[section][key] = next
}

console.log(`Read ${variables.length} variables from Figma.\n`)

if (changes.length === 0) {
  console.log('No drift. Code matches Figma.')
} else {
  console.log(`${changes.length} difference(s):\n`)
  for (const c of changes) console.log(`  ${c.kind.padEnd(8)} ${c.section}/${c.key}: ${c.from} -> ${c.to}`)
}

if (unseen.size) {
  console.log(`\n${unseen.size} token(s) in code that Figma did not return (left untouched):`)
  for (const k of [...unseen].sort()) console.log(`  ${k}`)
}

if (typeSeen.length) {
  console.log(`\n${typeSeen.length} typography variable(s) seen, reported only — pair these by hand:`)
  for (const t of typeSeen.slice(0, 40)) console.log(`  ${t}`)
}

if (WRITE && changes.length) {
  writeFileSync('tokens/tokens.json', JSON.stringify(tokens, null, 2) + '\n')
  console.log('\ntokens/tokens.json updated. Run `npm run tokens` to regenerate the CSS.')
} else if (changes.length) {
  console.log('\nDry run. Re-run with --write to apply.')
}
