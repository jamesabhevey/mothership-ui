#!/usr/bin/env node
/**
 * Can the Dark mode values be read from the Figma file?
 *
 * The variables endpoint that would hand over every mode's value in one call is
 * Enterprise-only and 403s on this plan. The plain file endpoint works, and it
 * returns *resolved* fills — so any frame the designer has switched to Dark mode
 * reports dark hexes. That makes the dark palette readable, but only if such
 * artwork exists in the file, and only if each swatch is labelled with the
 * variable it shows.
 *
 * This prints the file's structure so we can tell. It prints names and node
 * ids, never any part of the token.
 *
 *   FIGMA_TOKEN=… FIGMA_FILE_KEY=… node scripts/probe-figma-modes.mjs
 */
const TOKEN = process.env.FIGMA_TOKEN
const FILE_KEY = process.env.FIGMA_FILE_KEY
if (!TOKEN || !FILE_KEY) {
  console.error('FIGMA_TOKEN and FIGMA_FILE_KEY must both be set.')
  process.exit(1)
}

const get = async (path) => {
  const res = await fetch(`https://api.figma.com/v1/${path}`, { headers: { 'X-Figma-Token': TOKEN } })
  if (!res.ok) {
    console.error(`  HTTP ${res.status} on /v1/${path.split('?')[0]}`)
    return null
  }
  return res.json()
}

console.log('\n1. Pages and their top-level frames\n')
const file = await get(`files/${FILE_KEY}?depth=2`)
if (!file) process.exit(1)

for (const page of file.document.children ?? []) {
  console.log(`  ${page.id.padEnd(10)} PAGE  ${page.name}`)
  for (const child of page.children ?? []) {
    console.log(`  ${child.id.padEnd(10)}   ${(child.type || '').padEnd(9)} ${child.name}`)
  }
}

console.log('\n2. Anything explicitly switched to a non-default variable mode\n')
const deep = await get(`files/${FILE_KEY}?depth=6`)
const modal = []
const walk = (n, trail) => {
  const here = [...trail, n.name]
  if (n.explicitVariableModes && Object.keys(n.explicitVariableModes).length) {
    modal.push({ id: n.id, path: here.join(' / '), modes: n.explicitVariableModes })
  }
  for (const c of n.children ?? []) walk(c, here)
}
if (deep) walk(deep.document, [])
if (!modal.length) console.log('  none — no frame in the file is pinned to a mode')
for (const m of modal) console.log(`  ${m.id.padEnd(12)} ${m.path}\n${' '.repeat(15)}${JSON.stringify(m.modes)}`)

console.log('\n3. Does the variables endpoint work after all?\n')
const vars = await get(`files/${FILE_KEY}/variables/local`)
console.log(vars ? `  yes — ${Object.keys(vars.meta?.variables ?? {}).length} local variables` : '  no (expected on a non-Enterprise plan)')
console.log('')
