#!/usr/bin/env node
/**
 * tokens/tokens.json  ->  src/styles/tokens.css
 *
 * tokens.json is the single source of truth, mirroring the Figma variable
 * collections. Keys are the Figma variable paths, so `action/primary/default`
 * in the colour section is Figma's `color/action/primary/default`.
 *
 * Run `npm run tokens` after changing tokens.json. Never edit tokens.css.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const t = JSON.parse(readFileSync('tokens/tokens.json', 'utf8'))
const v = (path) => path.replace(/\//g, '-')
const L = []

L.push('/*')
L.push(' * Mothership UI design tokens — GENERATED FILE, DO NOT EDIT.')
L.push(' *')
L.push(' * Source: tokens/tokens.json, which mirrors the Figma variable collections')
L.push(' * (Semantic / Dimension / Typography). Regenerate with `npm run tokens`.')
L.push(' *')
L.push(' * The Figma variable name maps straight onto the custom property:')
L.push(' *   color/action/primary/default  ->  --color-action-primary-default')
L.push(' */')
L.push('')
L.push('@theme {')

L.push('  /* Colour */')
for (const [k, val] of Object.entries(t.color)) L.push(`  --color-${v(k)}: ${val};`)

L.push('')
L.push('  /* Radius */')
for (const [k, val] of Object.entries(t.radius)) L.push(`  --radius-${v(k)}: ${val};`)

L.push('')
L.push('  /* Elevation */')
for (const [k, val] of Object.entries(t.elevation)) L.push(`  --shadow-elevation-${v(k)}: ${val};`)

L.push('')
L.push('  /* Type family */')
for (const [k, val] of Object.entries(t.font)) L.push(`  --font-${v(k)}: ${val};`)

L.push('')
L.push('  /* Type scale */')
for (const [k, s] of Object.entries(t.type)) {
  const name = v(k)
  L.push(`  --text-${name}: ${s.size};`)
  if (s.lineHeight) L.push(`  --text-${name}--line-height: ${s.lineHeight};`)
  if (s.letterSpacing) L.push(`  --text-${name}--letter-spacing: ${s.letterSpacing};`)
  if (s.weight) L.push(`  --text-${name}--font-weight: ${s.weight};`)
}
L.push('}')
L.push('')
L.push('/*')
L.push(' * Spacing, border widths and control sizes.')
L.push(' *')
L.push(' * Published as plain variables rather than Tailwind theme keys: the space')
L.push(' * scale already lands on Tailwind\'s 4px grid, so components use stock')
L.push(' * utilities and p-4 *is* space/16. These exist for anyone consuming the')
L.push(' * tokens outside Tailwind, or cross-checking against Figma.')
L.push(' */')
L.push(':root {')
for (const [k, val] of Object.entries(t.space)) L.push(`  --space-${v(k)}: ${val};`)
L.push('')
for (const [k, val] of Object.entries(t.borderWidth)) L.push(`  --border-width-${v(k)}: ${val};`)
L.push('')
for (const [k, val] of Object.entries(t.size)) L.push(`  --size-${v(k)}: ${val};`)
L.push('}')
L.push('')

writeFileSync('src/styles/tokens.css', L.join('\n'))

const n = Object.keys(t.color).length + Object.keys(t.radius).length + Object.keys(t.elevation).length +
  Object.keys(t.type).length + Object.keys(t.space).length + Object.keys(t.size).length +
  Object.keys(t.borderWidth).length + Object.keys(t.font).length
console.log(`src/styles/tokens.css written — ${n} tokens`)
