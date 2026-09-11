#!/usr/bin/env node
/**
 * tokens/tokens.json  ->  src/styles/tokens.css
 *
 * tokens.json is the single source of truth, mirroring the Figma variable
 * collections. Keys are the Figma variable paths, so `action/primary/default`
 * in the colour section is Figma's `color/action/primary/default`.
 *
 * Colour is the one collection with modes. Each colour token carries a light and
 * a dark value, exactly as its Figma variable does, and both are emitted: the
 * light one into the `@theme` block, the dark one into a `[data-theme='dark']`
 * block that redeclares the same custom property. Tailwind v4 utilities compile
 * to `var(--color-…)`, so redeclaring the variable under a selector is all it
 * takes for `bg-surface-default` to follow the mode — no `dark:` variants
 * anywhere in the components, and anything reading the variable directly
 * follows too.
 *
 * Nothing else has modes. The elevation tokens look like an exception but are
 * not: they are built on var(--color-shadow-default), so they change with it.
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

L.push('  /* Colour — light mode. Dark follows the @theme block. */')
for (const [k, val] of Object.entries(t.color)) L.push(`  --color-${v(k)}: ${val.light};`)

L.push('')
L.push('  /* Radius */')
for (const [k, val] of Object.entries(t.radius)) L.push(`  --radius-${v(k)}: ${val};`)

L.push('')
L.push('  /* Elevation */')
for (const [k, val] of Object.entries(t.elevation)) L.push(`  --shadow-elevation-${v(k)}: ${val};`)

L.push('')
L.push('  /* Motion */')
for (const [k, val] of Object.entries(t.duration)) L.push(`  --duration-${v(k)}: ${val};`)
for (const [k, val] of Object.entries(t.easing)) L.push(`  --ease-${v(k)}: ${val};`)
L.push('')
L.push('  /*')
L.push('   * Tailwind\'s own defaults, pointed at the scale above.')
L.push('   *')
L.push('   * Every `transition-*` utility in the library reads these, so setting them')
L.push('   * here is what makes the components tokenised rather than each one having')
L.push('   * to name a duration. A component only says a duration when it wants')
L.push('   * something other than the default.')
L.push('   *')
L.push('   * The spin keyframes are Tailwind\'s; only its timing comes from us.')
L.push('   */')
L.push('  --default-transition-duration: var(--duration-fast);')
L.push('  --default-transition-timing-function: var(--ease-standard);')
L.push('  --animate-spin: spin var(--duration-loop) linear infinite;')
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
L.push('  color-scheme: light;')
L.push('')
for (const [k, val] of Object.entries(t.space)) L.push(`  --space-${v(k)}: ${val};`)
L.push('')
for (const [k, val] of Object.entries(t.borderWidth)) L.push(`  --border-width-${v(k)}: ${val};`)
L.push('')
for (const [k, val] of Object.entries(t.size)) L.push(`  --size-${v(k)}: ${val};`)
L.push('}')
L.push('')

L.push('/*')
L.push(' * Light, restated.')
L.push(' *')
L.push(' * The @theme block above already carries these, so this looks redundant —')
L.push(' * but custom properties inherit, which means a subtree inside a dark page')
L.push(' * has no way back to light without them. With this block, data-theme works')
L.push(' * in both directions and can be nested: a light island inside a dark page,')
L.push(' * or the reverse. The Colour foundations page relies on it to show both')
L.push(' * values of every token at once, whichever mode you are reading it in.')
L.push(' */')
L.push("[data-theme='light'] {")
L.push('  color-scheme: light;')
L.push('')
for (const [k, val] of Object.entries(t.color)) L.push(`  --color-${v(k)}: ${val.light};`)
L.push('}')
L.push('')
L.push('/*')
L.push(' * Dark mode.')
L.push(' *')
L.push(' * Set data-theme="dark" on <html> and every colour token switches. Only')
L.push(' * colour has modes in Figma, so only colour is redeclared here — the type')
L.push(' * scale, spacing, radii and border widths are shared by both.')
L.push(' *')
L.push(' * color-scheme tells the browser to render its own furniture dark too:')
L.push(' * scrollbars, form control internals, the caret and the default focus ring.')
L.push(' */')
L.push("[data-theme='dark'] {")
L.push('  color-scheme: dark;')
L.push('')
for (const [k, val] of Object.entries(t.color)) L.push(`  --color-${v(k)}: ${val.dark};`)
L.push('}')
L.push('')

writeFileSync('src/styles/tokens.css', L.join('\n'))

/*
 * A second copy for Storybook's manager — the sidebar and toolbar.
 *
 * The manager is a separate document from the preview iframe and does not go
 * through Vite, so it cannot import the stylesheet above; and it could not use
 * it as-is anyway, because a browser loading tokens.css directly would skip the
 * whole `@theme` block as an unknown at-rule and lose every light value with
 * it.
 *
 * So this holds the two mode blocks and nothing else, as plain CSS, served from
 * public/ and linked from manager-head.html. Generated from the same source, so
 * the chrome cannot drift from the components.
 */
const M = []
M.push('/* Mothership UI tokens for the Storybook manager — GENERATED, DO NOT EDIT. */')
M.push('')
M.push('/* Shared by both modes. Radius and motion are here because the chrome is')
M.push('   shaped and timed from them too — the search field, the sidebar headings,')
M.push('   the light/dark cross-fade — and a var() that is not declared is not an')
M.push('   error: it silently computes to the property\'s initial value, which for a')
M.push('   radius is a square corner and for a duration is no animation at all. */')
M.push(':root {')
for (const [k, val] of Object.entries(t.radius)) M.push(`  --radius-${v(k)}: ${val};`)
for (const [k, val] of Object.entries(t.duration)) M.push(`  --duration-${v(k)}: ${val};`)
for (const [k, val] of Object.entries(t.easing)) M.push(`  --ease-${v(k)}: ${val};`)
M.push('}')
for (const mode of ['light', 'dark']) {
  M.push('')
  M.push(`[data-theme='${mode}'] {`)
  M.push(`  color-scheme: ${mode};`)
  M.push('')
  for (const [k, val] of Object.entries(t.color)) M.push(`  --color-${v(k)}: ${val[mode]};`)
  M.push('}')
}
M.push('')
writeFileSync('public/manager-tokens.css', M.join('\n'))

const n = Object.keys(t.color).length + Object.keys(t.radius).length + Object.keys(t.elevation).length +
  Object.keys(t.type).length + Object.keys(t.space).length + Object.keys(t.size).length +
  Object.keys(t.borderWidth).length + Object.keys(t.font).length +
  Object.keys(t.duration).length + Object.keys(t.easing).length
console.log(`src/styles/tokens.css written — ${n} tokens, ${Object.keys(t.color).length} of them in two modes`)
