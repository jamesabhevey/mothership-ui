#!/usr/bin/env node
/**
 * Read every colour token's Light and Dark value out of the Figma file.
 *
 * The variables endpoint would hand these over directly but is Enterprise-only
 * and 403s on this plan. The file endpoint works, and the Foundations / Colour
 * page happens to be laid out in exactly the shape needed: one group per token,
 * named for the variable, holding a Light swatch and a Dark swatch, each pinned
 * to its mode. Figma resolves the fill per mode, so reading the two swatches
 * reads the two values.
 *
 * Prints JSON. The Light values are printed too, deliberately — they should
 * match what tokens.json already holds, so they double as a check that this is
 * reading the right thing.
 *
 *   FIGMA_TOKEN=… FIGMA_FILE_KEY=… node scripts/sync-figma-modes.mjs
 */
const TOKEN = process.env.FIGMA_TOKEN
const FILE_KEY = process.env.FIGMA_FILE_KEY
const COLOUR_FRAME = '256:2' // Foundations / Colour

if (!TOKEN || !FILE_KEY) {
  console.error('FIGMA_TOKEN and FIGMA_FILE_KEY must both be set.')
  process.exit(1)
}

const res = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${COLOUR_FRAME}`, {
  headers: { 'X-Figma-Token': TOKEN },
})
if (!res.ok) {
  console.error(`HTTP ${res.status} reading the Colour frame`)
  process.exit(1)
}
const doc = (await res.json()).nodes[COLOUR_FRAME].document

/** Figma channels are 0–1 floats. Alpha is dropped when fully opaque. */
const hex = (c, opacity = 1) => {
  const ch = (n) => Math.round(n * 255).toString(16).padStart(2, '0')
  const a = (c.a ?? 1) * opacity
  return `#${ch(c.r)}${ch(c.g)}${ch(c.b)}${a >= 1 ? '' : ch(a)}`
}

/** First solid fill found anywhere under a node. */
const fillOf = (n) => {
  const solid = (n.fills ?? []).find((f) => f.type === 'SOLID' && f.visible !== false)
  if (solid) return hex(solid.color, solid.opacity ?? 1)
  for (const c of n.children ?? []) {
    const found = fillOf(c)
    if (found) return found
  }
  return null
}

const out = {}
const walk = (n) => {
  if (/^color\//.test(n.name)) {
    const modes = {}
    for (const child of n.children ?? []) {
      if (child.name === 'Light' || child.name === 'Dark') {
        const v = fillOf(child)
        if (v) modes[child.name.toLowerCase()] = v
      }
    }
    // Strip the `color/` prefix: tokens.json keys the colour section without it.
    if (modes.light || modes.dark) out[n.name.replace(/^color\//, '')] = modes
  }
  for (const c of n.children ?? []) walk(c)
}
walk(doc)

console.log('FIGMA_MODES_JSON_START')
console.log(JSON.stringify(out, null, 2))
console.log('FIGMA_MODES_JSON_END')
console.error(`\n${Object.keys(out).length} colour tokens read.`)
